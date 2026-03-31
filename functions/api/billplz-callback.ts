// functions/api/billplz-callback.ts
// Handles Billplz payment callbacks (POST) and redirects (GET) after payment

interface Env {
  RESEND_API_KEY: string;
  NOTIFICATION_EMAIL: string;
  FROM_EMAIL: string;
  BILLPLZ_X_SIGNATURE_KEY: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function respond(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/plain", ...corsHeaders }
  });
}

/**
 * Validate Billplz X-Signature.
 * Algorithm: HMAC-SHA256 of alphabetically sorted key|value pairs joined by |
 * Docs: https://www.billplz.com/api#x-signature
 */
async function validateXSignature(
  params: Record<string, string>,
  xSignatureKey: string,
  receivedSignature: string
): Promise<boolean> {
  // Exclude x_signature itself from the signed payload
  const signingParams = Object.entries(params)
    .filter(([key]) => key !== "x_signature")
    .sort(([a], [b]) => a.localeCompare(b));

  const payload = signingParams.map(([k, v]) => `${k}|${v}`).join("|");

  const encoder = new TextEncoder();
  const keyData = encoder.encode(xSignatureKey);
  const msgData = encoder.encode(payload);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  const hexSignature = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hexSignature === receivedSignature.toLowerCase();
}

async function sendPaymentConfirmationEmail(
  env: Env,
  params: Record<string, string>
): Promise<void> {
  const billId = params.id || "-";
  const billName = params.name || "Client";
  const billEmail = params.email || "-";
  const billMobile = params.mobile || "-";
  const paidAmount = params.paid_amount ? `RM ${(Number(params.paid_amount) / 100).toFixed(2)}` : "-";
  const paidAt = params.paid_at || new Date().toISOString();
  const billUrl = params.url || "-";

  const html = `
    <div style="font-family:'Manrope',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff">
      <div style="padding:24px 0 16px;border-bottom:2px solid #0f6da8">
        <h1 style="margin:0;font-size:24px;color:#132941">✅ Payment Confirmed</h1>
        <p style="margin:8px 0 0;color:#5b6a7f;font-size:14px">A Billplz payment has been successfully received.</p>
      </div>

      <div style="padding:24px 0">
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:8px 0;color:#5b6a7f;width:40%">Bill ID</td>
            <td style="padding:8px 0;color:#132941;font-weight:600">${billId}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#5b6a7f">Payer Name</td>
            <td style="padding:8px 0;color:#132941;font-weight:600">${billName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#5b6a7f">Payer Email</td>
            <td style="padding:8px 0;color:#132941;font-weight:600">${billEmail}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#5b6a7f">Mobile</td>
            <td style="padding:8px 0;color:#132941;font-weight:600">${billMobile}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#5b6a7f">Amount Paid</td>
            <td style="padding:8px 0;color:#0a8a4a;font-weight:700;font-size:18px">${paidAmount}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#5b6a7f">Paid At</td>
            <td style="padding:8px 0;color:#132941;font-weight:600">${paidAt}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#5b6a7f">Bill URL</td>
            <td style="padding:8px 0"><a href="${billUrl}" style="color:#0f6da8">${billUrl}</a></td>
          </tr>
        </table>
      </div>

      <div style="padding:16px;background:#f0faf5;border-radius:12px;border:1px solid #b7e4cc">
        <p style="margin:0;color:#0a5c30;font-size:14px">
          <strong>Action required:</strong> Proceed to issue the policy for ${billName}. Premium received in full.
        </p>
      </div>
    </div>
  `;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: [env.NOTIFICATION_EMAIL],
      subject: `💳 Payment Received — ${billName} — ${paidAmount}`,
      html
    })
  });
}

// ─── CORS preflight ────────────────────────────────────────────────────────────

export const onRequestOptions = async () =>
  new Response(null, { status: 204, headers: corsHeaders });

// ─── GET — Billplz redirect_url after payment ──────────────────────────────────
// Billplz redirects the user's browser here after they complete payment.
// We just redirect them to the success page; the POST callback handles the real work.

export const onRequestGet: PagesFunction<Env> = async ({ request }) => {
  const url = new URL(request.url);
  const paid = url.searchParams.get("paid");
  const origin = url.origin;

  if (paid === "true") {
    return Response.redirect(`${origin}/?payment=success`, 302);
  } else {
    return Response.redirect(`${origin}/?payment=cancelled`, 302);
  }
};

// ─── POST — Billplz server-to-server callback ──────────────────────────────────

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.BILLPLZ_X_SIGNATURE_KEY) {
    return respond("Missing BILLPLZ_X_SIGNATURE_KEY", 500);
  }

  try {
    const formData = await request.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = String(value);
    });

    const receivedSignature = params.x_signature;
    if (!receivedSignature) {
      return respond("Missing x_signature", 400);
    }

    // Validate signature
    const isValid = await validateXSignature(
      params,
      env.BILLPLZ_X_SIGNATURE_KEY,
      receivedSignature
    );

    if (!isValid) {
      console.error("Billplz X-Signature validation failed", { params });
      return respond("Invalid signature", 400);
    }

    const isPaid = params.paid === "true";

    if (isPaid && env.RESEND_API_KEY && env.NOTIFICATION_EMAIL) {
      await sendPaymentConfirmationEmail(env, params);
    }

    // Billplz expects a 200 response to acknowledge receipt
    return respond("OK", 200);
  } catch (error) {
    console.error("Billplz callback error:", error);
    return respond("Internal error", 500);
  }
};
