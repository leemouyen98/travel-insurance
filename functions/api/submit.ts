// functions/api/submit.ts
// Cloudflare Pages Function — handles form submission, Resend email, and Billplz bill creation

interface Env {
  RESEND_API_KEY: string;
  NOTIFICATION_EMAIL: string;
  FROM_EMAIL: string;
  BILLPLZ_API_KEY: string;
  BILLPLZ_X_SIGNATURE_KEY: string;
  BILLPLZ_SANDBOX?: string; // "true" for sandbox, "false" or omit for production
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders }
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

function renderDefinitionList(entries: Array<[string, string | number]>) {
  return entries
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 0;color:#5b6a7f;vertical-align:top">${escapeHtml(label)}</td>
          <td style="padding:8px 0;color:#132941;font-weight:600;vertical-align:top">${escapeHtml(String(value))}</td>
        </tr>
      `
    )
    .join("");
}

function titleCase(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      if (/^(RM|NRIC|ID|CFAR)$/i.test(word)) return word.toUpperCase();
      if (/^\d/.test(word)) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function formatInsuranceType(value: string) {
  const map: Record<string, string> = { individual: "Individual", family: "Family", group: "Group" };
  return map[value] || titleCase(value);
}

function formatCoverageArea(value: string) {
  const map: Record<string, string> = { area1: "Area 1", area2: "Area 2", area3: "Area 3", domestic: "Domestic" };
  return map[value] || titleCase(value);
}

function formatPolicyType(value: string) {
  const map: Record<string, string> = { individual: "Individual", family: "Family", group: "Group" };
  return map[value] || titleCase(value);
}

function formatPlan(value: string) {
  const map: Record<string, string> = {
    basic: "Basic Plan",
    essential: "Essential Plan",
    deluxe: "Deluxe Plan",
    domestic: "Domestic Plan"
  };
  return map[value] || `${titleCase(value)} Plan`;
}

function formatPaymentMethod(value: string) {
  const map: Record<string, string> = {
    duitnow: "DuitNow QR",
    tng: "Touch 'n Go",
    bank: "Bank Transfer",
    billplz: "Card via Billplz"
  };
  return map[value] || titleCase(value);
}

function formatAgeBand(value: string) {
  const map: Record<string, string> = { Adult: "Adult", Senior: "Senior" };
  return map[value] || titleCase(value);
}

// ─── Billplz ──────────────────────────────────────────────────────────────────

interface BillplzBill {
  id: string;
  collection_id: string;
  paid: boolean;
  state: string;
  amount: number;
  paid_amount: number;
  due_at: string;
  email: string;
  mobile: string | null;
  name: string;
  url: string;
  reference_1: string | null;
  reference_2: string | null;
}

async function createBillplzBill(
  env: Env,
  opts: {
    name: string;
    email: string;
    mobile?: string;
    amount: number;       // in sen (MYR cents)
    description: string;
    callbackUrl: string;
    redirectUrl: string;
    reference1?: string;
  }
): Promise<BillplzBill> {
  const sandbox = env.BILLPLZ_SANDBOX === "true";
  const baseUrl = sandbox
    ? "https://www.billplz-sandbox.com/api/v3"
    : "https://www.billplz.com/api/v3";

  const body = new URLSearchParams({
    collection_id: "cy4n8ebb",
    email: opts.email,
    name: opts.name,
    amount: String(opts.amount),
    callback_url: opts.callbackUrl,
    description: opts.description,
    redirect_url: opts.redirectUrl
  });

  // ── Credit card only ──────────────────────────────────────────────────────
  // Restricts the Billplz payment page to Visa / Mastercard only.
  // Remove this line to re-enable FPX and other channels.
  body.append("payment_channels[]", "credit_card");

  if (opts.mobile) body.set("mobile", opts.mobile);
  if (opts.reference1) body.set("reference_1", opts.reference1.substring(0, 120));

  const credentials = btoa(`${env.BILLPLZ_API_KEY}:`);

  const res = await fetch(`${baseUrl}/bills`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body.toString()
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Billplz bill creation failed (${res.status}): ${err}`);
  }

  return res.json() as Promise<BillplzBill>;
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

export const onRequestOptions = async () =>
  new Response(null, { status: 204, headers: corsHeaders });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.RESEND_API_KEY || !env.NOTIFICATION_EMAIL || !env.FROM_EMAIL) {
    return json(
      { error: "Missing RESEND_API_KEY, NOTIFICATION_EMAIL, or FROM_EMAIL environment variable." },
      500
    );
  }

  try {
    const formData = await request.formData();
    const submissionText = formData.get("submission");

    if (typeof submissionText !== "string") {
      return json({ error: "Submission payload is required." }, 400);
    }

    const payload = JSON.parse(submissionText);
    const attachment = formData.get("paymentSlip");

    let attachments: Array<{ filename: string; content: string }> = [];
    if (attachment instanceof File) {
      const buffer = await attachment.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = "";
      bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
      attachments = [{ filename: attachment.name, content: btoa(binary) }];
    }

    // ── Build email rows ────────────────────────────────────────────────────

    const proposerRows = renderDefinitionList([
      ["Name", payload.proposer.name],
      ["Mobile", payload.proposer.mobile],
      ["Email", payload.proposer.email],
      ["Occupation", titleCase(payload.proposer.occupation)],
      ["Address", payload.proposer.address],
      [
        "Bank",
        payload.proposer.bankName
          ? `${payload.proposer.bankName}${payload.proposer.bankAccountType ? ` (${payload.proposer.bankAccountType})` : ""}`
          : "-"
      ],
      ["Account Number", payload.proposer.bankAccountNumber || "-"]
    ]);

    const productRows = renderDefinitionList([
      ["Insurance Type", formatInsuranceType(payload.product.insuranceType)],
      ["Coverage Scope", formatCoverageArea(payload.product.coverageScope)],
      ["Coverage Area", formatCoverageArea(payload.product.coverageArea)],
      ["Policy Type", formatPolicyType(payload.product.policyType)],
      ["Selected Plan", formatPlan(payload.product.selectedPlan)],
      ["Departure Date", payload.product.departureDate],
      ["Return Date", payload.product.returnDate],
      ["Destination", payload.product.destination || "Malaysia"],
      ["Payment Method", formatPaymentMethod(payload.paymentMethod)],
      ["Total Premium", `RM ${Number(payload.quote.total).toFixed(2)}`]
    ]);

    const quoteRows = renderDefinitionList(
      (payload.quote.items || []).map((item: Record<string, string | number>) => [
        titleCase(String(item.label || "Item")),
        `RM ${Number(item.value || 0).toFixed(2)}`
      ])
    );

    const travellerRows = payload.insuredTravellers
      .map(
        (traveller: Record<string, string>, index: number) => `
          <tr><td colspan="2" style="padding-top:14px;font-weight:700;color:#0f6da8">Traveller ${index + 1}</td></tr>
          ${renderDefinitionList([
            ["Name", String(traveller.name || "-")],
            ["NRIC / Passport", String(traveller.idNumber || "-")],
            ["Date of Birth", String(traveller.dob || "-")],
            ["Age Band", formatAgeBand(String(traveller.ageBand || ""))],
            ["Gender", titleCase(String(traveller.gender || ""))],
            ["Mobile", String(traveller.mobile || "-")],
            ["Email", String(traveller.email || "-")],
            ["Occupation", String(traveller.occupation || "-")],
            ["Address", String(traveller.address || "-")]
          ])}
        `
      )
      .join("");

    const flightRows = (payload.flights || [])
      .map(
        (flight: Record<string, string>, index: number) => `
          <tr><td colspan="2" style="padding-top:14px;font-weight:700;color:#0f6da8">Flight ${index + 1}</td></tr>
          ${renderDefinitionList([
            ["Departure Flight Number", String(flight.departureFlightNumber || "-")],
            ["Departure Date", String(flight.departureDate || "-")],
            ["Arrival Flight Number", String(flight.arrivalFlightNumber || "-")],
            ["Arrival Date", String(flight.arrivalDate || "-")]
          ])}
        `
      )
      .join("");

    const nomineeRows = (payload.nominees || [])
      .map(
        (nominee: Record<string, string | number>, index: number) => `
          <tr><td colspan="2" style="padding-top:14px;font-weight:700;color:#0f6da8">
            ${escapeHtml(nominee.travellerName ? `Nominee for ${String(nominee.travellerName)}` : `Nominee ${index + 1}`)}
          </td></tr>
          ${renderDefinitionList([
            ["Name", String(nominee.name || "-")],
            ["Relationship", nominee.relationship ? titleCase(String(nominee.relationship)) : "-"],
            ["NRIC / Passport", String(nominee.idNumber || "-")],
            ["Contact", String(nominee.contact || "-")],
            ["Share", `${Number(nominee.share || 0)}%`]
          ])}
        `
      )
      .join("");

    const bankRows = (payload.bankDetails || [])
      .map(
        (bank: Record<string, string>, index: number) => `
          <tr><td colspan="2" style="padding-top:14px;font-weight:700;color:#0f6da8">
            ${escapeHtml(bank.travellerName ? `Bank ${index + 1} for ${bank.travellerName}` : `Bank ${index + 1}`)}
          </td></tr>
          ${renderDefinitionList([
            ["Bank", String(bank.bankName ? `${bank.bankName}${bank.bankAccountType ? ` (${bank.bankAccountType})` : ""}` : "-")],
            ["Account Number", String(bank.bankAccountNumber || "-")]
          ])}
        `
      )
      .join("");

    // ── Email HTML ──────────────────────────────────────────────────────────

    const html = `
      <div style="font-family:'Manrope',Arial,sans-serif;max-width:680px;margin:0 auto;background:#ffffff">
        <h1 style="margin:0 0 12px;font-size:30px;line-height:1.1">Tokio Marine Explorer Intake Summary</h1>
        <p style="margin:0 0 24px;color:#5b6a7f;font-size:15px;line-height:1.6">
          This summary was sent from the live intake form. Any uploaded payment slip is attached for review.
        </p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:0 0 28px">
          <div style="padding:14px 16px;border-radius:16px;background:#f8fafc;border:1px solid #e3ebf5">
            <div style="font-size:12px;color:#5b6a7f;text-transform:uppercase;letter-spacing:0.08em">Applicant</div>
            <div style="margin-top:6px;font-size:18px;font-weight:700;color:#132941">${escapeHtml(payload.proposer.name || "Client")}</div>
          </div>
          <div style="padding:14px 16px;border-radius:16px;background:#f8fafc;border:1px solid #e3ebf5">
            <div style="font-size:12px;color:#5b6a7f;text-transform:uppercase;letter-spacing:0.08em">Plan</div>
            <div style="margin-top:6px;font-size:18px;font-weight:700;color:#132941">${escapeHtml(formatPlan(payload.product.selectedPlan))}</div>
          </div>
          <div style="padding:14px 16px;border-radius:16px;background:#f8fafc;border:1px solid #e3ebf5">
            <div style="font-size:12px;color:#5b6a7f;text-transform:uppercase;letter-spacing:0.08em">Total Premium</div>
            <div style="margin-top:6px;font-size:18px;font-weight:700;color:#132941">RM ${Number(payload.quote.total).toFixed(2)}</div>
          </div>
        </div>
        <h2 style="margin:24px 0 10px;font-size:18px">Product Summary</h2>
        <table style="width:100%;border-collapse:collapse">${productRows}</table>
        <h2 style="margin:24px 0 10px;font-size:18px">Premium Breakdown</h2>
        <table style="width:100%;border-collapse:collapse">${quoteRows || renderDefinitionList([["Premium Breakdown", "Not available"]])}</table>
        <h2 style="margin:24px 0 10px;font-size:18px">Proposer Details</h2>
        <table style="width:100%;border-collapse:collapse">${proposerRows}</table>
        <h2 style="margin:24px 0 10px;font-size:18px">Bank Details</h2>
        <table style="width:100%;border-collapse:collapse">${bankRows || renderDefinitionList([["Bank Details", "None provided"]])}</table>
        <h2 style="margin:24px 0 10px;font-size:18px">Insured Travellers</h2>
        <table style="width:100%;border-collapse:collapse">${travellerRows}</table>
        <h2 style="margin:24px 0 10px;font-size:18px">Flight Details</h2>
        <table style="width:100%;border-collapse:collapse">${flightRows || renderDefinitionList([["Flight Details", "None provided"]])}</table>
        <h2 style="margin:24px 0 10px;font-size:18px">Nominee Details</h2>
        <table style="width:100%;border-collapse:collapse">${nomineeRows || renderDefinitionList([["Nominee Details", "None provided"]])}</table>
      </div>
    `;

    // ── Send intake email via Resend ────────────────────────────────────────

    const resendPayload: Record<string, unknown> = {
      from: env.FROM_EMAIL,
      to: [env.NOTIFICATION_EMAIL],
      subject: `Tokio Marine Explorer Submission — ${payload.proposer.name || "Client"} — RM ${Number(payload.quote.total).toFixed(2)}`,
      html,
      attachments
    };

    if (payload.proposer.email) {
      resendPayload.reply_to = payload.proposer.email;
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(resendPayload)
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      return json({ error: `Resend request failed: ${errorText}` }, 502);
    }

    // ── Billplz: create bill and return payment URL ─────────────────────────

    if (payload.paymentMethod === "billplz") {
      if (!env.BILLPLZ_API_KEY) {
        return json({ error: "Missing BILLPLZ_API_KEY environment variable." }, 500);
      }

      const amountInSen = Math.round(Number(payload.quote.total) * 100);
      const origin = new URL(request.url).origin;

      const bill = await createBillplzBill(env, {
        name: String(payload.proposer.name || "Client"),
        email: String(payload.proposer.email || env.NOTIFICATION_EMAIL),
        mobile: payload.proposer.mobile
          ? String(payload.proposer.mobile).replace(/[^0-9+]/g, "")
          : undefined,
        amount: amountInSen,
        description: `Tokio Marine Explorer — ${formatPlan(payload.product.selectedPlan)} — ${payload.proposer.name || "Client"}`,
        callbackUrl: `${origin}/api/billplz-callback`,
        redirectUrl: `${origin}/?payment=success`,
        reference1: String(payload.proposer.name || "Client")
      });

      return json({ ok: true, billplzUrl: bill.url, billId: bill.id });
    }

    // ── Non-Billplz: return success ─────────────────────────────────────────

    return json({ ok: true });

  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Unknown submission error." },
      500
    );
  }
};
