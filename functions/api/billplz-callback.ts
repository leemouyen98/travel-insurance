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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:7px 0;color:#5b6a7f;vertical-align:top;width:38%;font-size:14px">${escapeHtml(label)}</td>
      <td style="padding:7px 0;color:#132941;font-weight:600;vertical-align:top;font-size:14px">${escapeHtml(value)}</td>
    </tr>
  `;
}

function sectionHeader(title: string) {
  return `
    <tr>
      <td colspan="2" style="padding:20px 0 6px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;color:#0f6da8;border-bottom:2px solid #dce8f5">
        ${escapeHtml(title)}
      </td>
    </tr>
    <tr><td colspan="2" style="height:6px"></td></tr>
  `;
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
  const signingParams = Object.entries(params)
    .filter(([key]) => key !== "x_signature")
    .sort(([a], [b]) => a.localeCompare(b));

  const payload = signingParams.map(([k, v]) => `${k}|${v}`).join("|");

  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(xSignatureKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(payload));
  const hexSignature = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hexSignature === receivedSignature.toLowerCase();
}

async function sendPaymentConfirmationEmail(
  env: Env,
  params: Record<string, string>
): Promise<void> {
  const billId     = params.id       || "—";
  const billName   = params.name     || "Client";
  const billEmail  = params.email    || "—";
  const billMobile = params.mobile   || "—";
  const paidAmount = params.paid_amount
    ? `RM ${(Number(params.paid_amount) / 100).toFixed(2)}`
    : "—";
  const paidAt  = params.paid_at || new Date().toISOString();
  const billUrl = params.url     || "—";

  const emailBody = `
    <!-- Hero -->
    <tr>
      <td colspan="2" style="padding:0 0 4px;font-size:22px;font-weight:800;color:#08254d;letter-spacing:-0.02em">
        ${escapeHtml(billName)}
      </td>
    </tr>
    <tr>
      <td colspan="2" style="font-size:13px;color:#5b6a7f;padding-bottom:8px">
        Card via Billplz &nbsp;&middot;&nbsp; Payment confirmed
      </td>
    </tr>
    <tr>
      <td colspan="2" style="padding:6px 0 24px;font-size:34px;font-weight:800;color:#0a8a4a;letter-spacing:-0.03em;border-bottom:3px solid #08254d">
        ${escapeHtml(paidAmount)}
      </td>
    </tr>

    ${sectionHeader("Payment Details")}
    ${row("Bill ID",    billId)}
    ${row("Payer",      billName)}
    ${row("Email",      billEmail)}
    ${row("Mobile",     billMobile)}
    ${row("Amount",     paidAmount)}
    ${row("Paid At",    paidAt)}
    ${row("Bill URL",   billUrl)}

    <!-- Action prompt -->
    <tr>
      <td colspan="2" style="padding-top:28px">
        <div style="background:#f0faf5;border:1px solid #b7e4cc;border-radius:10px;padding:14px 18px">
          <div style="font-size:13px;font-weight:700;color:#0a5c30;margin-bottom:2px">Action Required</div>
          <div style="font-size:13px;color:#0a5c30">
            Payment received in full from <strong>${escapeHtml(billName)}</strong>. Proceed to issue the policy.
          </div>
        </div>
      </td>
    </tr>
  `;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;background:#ffffff;color:#132941;font-size:15px;line-height:1.5;padding:0 0 32px">
      <div style="background:#08254d;padding:18px 24px;margin-bottom:24px">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#c9953a">
          Tokio Marine Explorer
        </div>
        <div style="font-size:18px;font-weight:700;color:#ffffff;margin-top:4px">
          💳 Payment Confirmed
        </div>
      </div>
      <div style="padding:0 24px">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${emailBody}
        </table>
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
      subject: `💳 Payment Confirmed — ${billName} — ${paidAmount}`,
      html
    })
  });
}

// ─── CORS preflight ────────────────────────────────────────────────────────────

export const onRequestOptions = async () =>
  new Response(null, { status: 204, headers: corsHeaders });

// ─── GET — Billplz redirect_url after payment ──────────────────────────────────

export const onRequestGet: PagesFunction<Env> = async ({ request }) => {
  const url  = new URL(request.url);
  const paid = url.searchParams.get("paid");
  const origin = url.origin;

  return paid === "true"
    ? Response.redirect(`${origin}/?payment=success`, 302)
    : Response.redirect(`${origin}/?payment=cancelled`, 302);
};

// ─── POST — Billplz server-to-server callback ──────────────────────────────────

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.BILLPLZ_X_SIGNATURE_KEY) {
    return respond("Missing BILLPLZ_X_SIGNATURE_KEY", 500);
  }

  try {
    const formData = await request.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => { params[key] = String(value); });

    const receivedSignature = params.x_signature;
    if (!receivedSignature) return respond("Missing x_signature", 400);

    const isValid = await validateXSignature(params, env.BILLPLZ_X_SIGNATURE_KEY, receivedSignature);
    if (!isValid) {
      console.error("Billplz X-Signature validation failed", { params });
      return respond("Invalid signature", 400);
    }

    const isPaid = params.paid === "true";
    if (isPaid && env.RESEND_API_KEY && env.NOTIFICATION_EMAIL) {
      await sendPaymentConfirmationEmail(env, params);
    }

    return respond("OK", 200);

  } catch (error) {
    console.error("Billplz callback error:", error);
    return respond("Internal error", 500);
  }
};
