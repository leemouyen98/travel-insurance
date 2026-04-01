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
          <td style="padding:8px 0;color:#5b6a7f;vertical-align:top;width:38%">${escapeHtml(label)}</td>
          <td style="padding:8px 0;color:#132941;font-weight:600;vertical-align:top">${escapeHtml(String(value))}</td>
        </tr>
      `
    )
    .join("");
}

function sectionHeader(title: string) {
  return `
    <tr>
      <td colspan="2" style="padding:24px 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#0f6da8;border-bottom:2px solid #dce8f5">${escapeHtml(title)}</td>
    </tr>
    <tr><td colspan="2" style="height:8px"></td></tr>
  `;
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

    const hasSlip = attachments.length > 0;

    const contactRows = renderDefinitionList([
      ["Name",       payload.proposer.name       || "—"],
      ["Mobile",     payload.proposer.mobile      || "—"],
      ["Email",      payload.proposer.email       || "—"],
      ["Occupation", titleCase(payload.proposer.occupation || "—")],
      ["Address",    payload.proposer.address     || "—"],
    ]);

    const tripRows = renderDefinitionList([
      ["Insurance Type", formatInsuranceType(payload.product.insuranceType)],
      ["Policy Type",    formatPolicyType(payload.product.policyType)],
      ["Coverage Area",  formatCoverageArea(payload.product.coverageArea)],
      ["Departure",      payload.product.departureDate],
      ["Return",         payload.product.returnDate],
      ["Destination",    payload.product.destination || "Malaysia"],
    ]);

    const planRows = renderDefinitionList([
      ["Plan",          formatPlan(payload.product.selectedPlan)],
      ["Total Premium", `RM ${Number(payload.quote.total).toFixed(2)}`],
    ]);

    const quoteRows = renderDefinitionList(
      (payload.quote.items || []).map((item: Record<string, string | number>) => [
        `  ${titleCase(String(item.label || "Item"))}`,
        `RM ${Number(item.value || 0).toFixed(2)}`
      ])
    );

    const paymentRows = renderDefinitionList([
      ["Method", formatPaymentMethod(payload.paymentMethod)],
      ["Slip",   hasSlip ? "Attached" : "Not provided"],
    ]);

    const travellerRows = payload.insuredTravellers
      .map(
        (traveller: Record<string, string>, index: number) => `
          ${sectionHeader(`Traveller ${index + 1}${traveller.name ? ` — ${String(traveller.name)}` : ""}`)}
          ${renderDefinitionList([
            ["Name",            String(traveller.name       || "—")],
            ["NRIC / Passport", String(traveller.idNumber   || "—")],
            ["Date of Birth",   String(traveller.dob        || "—")],
            ["Gender",          titleCase(String(traveller.gender || "—"))],
            ["Age Band",        formatAgeBand(String(traveller.ageBand || ""))],
            ["Occupation",      String(traveller.occupation || "—")],
            ["Mobile",          String(traveller.mobile     || "—")],
            ["Email",           String(traveller.email      || "—")],
            ["Address",         String(traveller.address    || "—")],
          ])}
        `
      )
      .join("");

    const flightRows = (payload.flights || [])
      .map(
        (flight: Record<string, string>, index: number) => `
          ${sectionHeader(`Flight ${index + 1}`)}
          ${renderDefinitionList([
            ["Departure Flight", String(flight.departureFlightNumber || "—")],
            ["Departure Date",   String(flight.departureDate         || "—")],
            ["Return Flight",    String(flight.arrivalFlightNumber   || "—")],
            ["Return Date",      String(flight.arrivalDate           || "—")],
          ])}
        `
      )
      .join("");

    const nomineeRows = (payload.nominees || [])
      .map(
        (nominee: Record<string, string | number>, index: number) => `
          ${sectionHeader(nominee.travellerName ? `Nominee — ${String(nominee.travellerName)}` : `Nominee ${index + 1}`)}
          ${renderDefinitionList([
            ["Name",            String(nominee.name         || "—")],
            ["Relationship",    String(nominee.relationship || "—")],
            ["NRIC / Passport", String(nominee.idNumber     || "—")],
            ["Contact",         String(nominee.contact      || "—")],
            ["Share",           `${Number(nominee.share || 0)}%`],
          ])}
        `
      )
      .join("");

    const proposerBankRows = payload.proposer.bankAccountNumber
      ? renderDefinitionList([
          [
            "Bank (Proposer)",
            payload.proposer.bankName
              ? `${payload.proposer.bankName}${payload.proposer.bankAccountType ? ` (${payload.proposer.bankAccountType})` : ""}`
              : "—",
          ],
          ["Account Number", payload.proposer.bankAccountNumber],
        ])
      : "";

    const bankRows = (payload.bankDetails || [])
      .map(
        (bank: Record<string, string>, index: number) => `
          ${sectionHeader(bank.travellerName ? `Bank — ${bank.travellerName}` : `Bank ${index + 1}`)}
          ${renderDefinitionList([
            ["Bank",           String(bank.bankName ? `${bank.bankName}${bank.bankAccountType ? ` (${bank.bankAccountType})` : ""}` : "—")],
            ["Account Number", String(bank.bankAccountNumber || "—")],
          ])}
        `
      )
      .join("");

    const hasBankInfo  = !!(proposerBankRows || bankRows);
    const hasFlights   = (payload.flights  || []).length > 0;
    const hasNominees  = (payload.nominees || []).length > 0;

    // ── Email HTML ──────────────────────────────────────────────────────────

    const html = `
      <div style="font-family:'Manrope',Arial,sans-serif;max-width:640px;margin:0 auto;background:#ffffff;color:#132941;font-size:15px;line-height:1.5">
        <table width="100%" cellpadding="0" cellspacing="0">

          <tr>
            <td colspan="2" style="padding:24px 0 4px;font-size:22px;font-weight:800;color:#08254d;letter-spacing:-0.02em">
              ${escapeHtml(payload.proposer.name || "Client")}
            </td>
          </tr>
          <tr>
            <td colspan="2" style="font-size:13px;color:#5b6a7f;padding-bottom:6px">
              ${escapeHtml(formatPlan(payload.product.selectedPlan))} &nbsp;&middot;&nbsp; ${escapeHtml(formatPaymentMethod(payload.paymentMethod))} &nbsp;&middot;&nbsp; ${escapeHtml(payload.product.departureDate)} &rarr; ${escapeHtml(payload.product.returnDate)}
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding:6px 0 24px;font-size:32px;font-weight:800;color:#0f6da8;letter-spacing:-0.03em;border-bottom:3px solid #08254d">
              RM ${Number(payload.quote.total).toFixed(2)}
            </td>
          </tr>

          ${sectionHeader("Contact")}
          ${contactRows}

          ${sectionHeader("Trip")}
          ${tripRows}

          ${sectionHeader("Plan & Premium")}
          ${planRows}
          ${quoteRows}

          ${sectionHeader("Payment")}
          ${paymentRows}

          ${travellerRows}

          ${hasFlights  ? flightRows  : ""}
          ${hasNominees ? nomineeRows : ""}
          ${hasBankInfo ? `${sectionHeader("Bank Details")}${proposerBankRows}${bankRows}` : ""}

        </table>
      </div>
    `;

    // ── Send intake email via Resend ────────────────────────────────────────

    const resendPayload: Record<string, unknown> = {
      from: env.FROM_EMAIL,
      to: [env.NOTIFICATION_EMAIL],
      subject: `TM Explorer — ${payload.proposer.name || "Client"} — ${formatPlan(payload.product.selectedPlan)} — RM ${Number(payload.quote.total).toFixed(2)} — Dep ${payload.product.departureDate || ""}`,
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

      // ── 2% credit card convenience fee ────────────────────────────────────
      const basePremium = Number(payload.quote.total);
      const convenienceFeeRate = 0.02;
      const convenienceFee = Math.round(basePremium * convenienceFeeRate * 100) / 100;
      const totalWithFee = Math.round((basePremium + convenienceFee) * 100) / 100;
      const amountInSen = Math.round(totalWithFee * 100);

      const origin = new URL(request.url).origin;

      const bill = await createBillplzBill(env, {
        name: String(payload.proposer.name || "Client"),
        email: String(payload.proposer.email || env.NOTIFICATION_EMAIL),
        mobile: payload.proposer.mobile
          ? String(payload.proposer.mobile).replace(/[^0-9+]/g, "")
          : undefined,
        amount: amountInSen,
        description: `Tokio Marine Explorer — ${formatPlan(payload.product.selectedPlan)} — ${payload.proposer.name || "Client"} (incl. 2% card fee)`,
        callbackUrl: `${origin}/api/billplz-callback`,
        redirectUrl: `${origin}/?payment=success`,
        reference1: String(payload.proposer.name || "Client")
      });

      return json({ ok: true, billplzUrl: bill.url, billId: bill.id, convenienceFee, totalWithFee });
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
