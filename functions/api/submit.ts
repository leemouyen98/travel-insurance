// functions/api/submit.ts
// Cloudflare Pages Function — handles form submission, Resend email, and Billplz bill creation

interface Env {
  RESEND_API_KEY: string;
  NOTIFICATION_EMAIL: string;
  FROM_EMAIL: string;
  BILLPLZ_API_KEY: string;
  BILLPLZ_COLLECTION_ID: string;
  BILLPLZ_X_SIGNATURE_KEY: string;
  BILLPLZ_SANDBOX?: string; // "true" for sandbox, omit for production
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

// ─── Formatters ───────────────────────────────────────────────────────────────

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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
      if (/^\d/.test(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

const COVERAGE_AREA_LABELS: Record<string, string> = {
  area1: "Area 1 — Asia Pacific",
  area2: "Area 2 — Worldwide excl. USA/Canada",
  area3: "Area 3 — Worldwide incl. USA/Canada",
  domestic: "Domestic (Malaysia)"
};

const PLAN_LABELS: Record<string, string> = {
  basic: "Basic Plan",
  essential: "Essential Plan",
  deluxe: "Deluxe Plan"
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  duitnow: "DuitNow QR",
  tng: "Touch 'n Go",
  bank: "Bank Transfer",
  billplz: "Card via Billplz"
};

const INSURANCE_TYPE_LABELS: Record<string, string> = {
  single: "Single Trip",
  annual: "Annual"
};

const POLICY_TYPE_LABELS: Record<string, string> = {
  individual: "Individual",
  family: "Family",
  group: "Group"
};

const AGE_BAND_LABELS: Record<string, string> = {
  Adult: "Adult",
  Senior: "Senior (71–85)"
};

// ISO 3166-1 alpha-2 → country name (subset matching the frontend dropdown)
const COUNTRY_NAMES: Record<string, string> = {
  MY: "Malaysia", SG: "Singapore", BN: "Brunei", KH: "Cambodia", ID: "Indonesia",
  LA: "Laos", MM: "Myanmar", PH: "Philippines", TH: "Thailand", VN: "Vietnam",
  AU: "Australia", CN: "China", HK: "Hong Kong", IN: "India", JP: "Japan",
  KR: "South Korea", NZ: "New Zealand", PK: "Pakistan", TW: "Taiwan",
  CA: "Canada", FR: "France", DE: "Germany", GB: "United Kingdom", US: "United States",
  AE: "United Arab Emirates", SA: "Saudi Arabia", QA: "Qatar", BH: "Bahrain",
  KW: "Kuwait", OM: "Oman", LK: "Sri Lanka", BD: "Bangladesh", NP: "Nepal",
  MO: "Macau", IR: "Iran", IQ: "Iraq", EG: "Egypt", ZA: "South Africa",
  NG: "Nigeria", KE: "Kenya", GH: "Ghana", RU: "Russia", TR: "Turkey",
  IT: "Italy", ES: "Spain", PT: "Portugal", NL: "Netherlands", BE: "Belgium",
  SE: "Sweden", NO: "Norway", DK: "Denmark", FI: "Finland", AT: "Austria",
  CH: "Switzerland", PL: "Poland", OTHER: "Other"
};

function formatCountry(code: string): string {
  return COUNTRY_NAMES[code] || code;
}

function fmt(map: Record<string, string>, value: string, fallback?: string): string {
  return map[value] || fallback || titleCase(value);
}

/**
 * Format an ID number.
 * Malaysian NRIC (12 digits) → add dashes: 000000-00-0000
 * Everything else (passports, foreign IDs) → return as-is.
 */
function formatIdNumber(value: string, nationality = "MY"): string {
  const trimmed = (value || "").trim();
  if (!trimmed) return "—";
  if (nationality === "MY") {
    const digits = trimmed.replace(/\D/g, "");
    if (digits.length === 12) {
      return `${digits.slice(0, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
    }
  }
  return trimmed;
}

/**
 * Derive DOB from Malaysian NRIC.
 * Only called when nationality is MY and no explicit DOB was submitted.
 */
function dobFromNric(nric: string): string {
  const digits = nric.replace(/\D/g, "");
  if (digits.length < 6) return "";
  const yy = Number(digits.slice(0, 2));
  const mm = Number(digits.slice(2, 4));
  const dd = Number(digits.slice(4, 6));
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return "";
  const currentYear = new Date().getFullYear() % 100;
  const fullYear = yy > currentYear ? 1900 + yy : 2000 + yy;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${dd.toString().padStart(2, "0")} ${months[mm - 1]} ${fullYear}`;
}

// ─── Email template helpers ───────────────────────────────────────────────────

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

function emailWrapper(subject: string, body: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;background:#ffffff;color:#132941;font-size:15px;line-height:1.5;padding:0 0 32px">

      <!-- Header bar -->
      <div style="background:#08254d;padding:18px 24px;margin-bottom:24px">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#c9953a">
          Tokio Marine Explorer
        </div>
        <div style="font-size:18px;font-weight:700;color:#ffffff;margin-top:4px">
          ${escapeHtml(subject)}
        </div>
      </div>

      <div style="padding:0 24px">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${body}
        </table>
      </div>

    </div>
  `;
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

  const collectionId = env.BILLPLZ_COLLECTION_ID;
  if (!collectionId) throw new Error("Missing BILLPLZ_COLLECTION_ID environment variable.");

  const body = new URLSearchParams({
    collection_id: collectionId,
    email: opts.email,
    name: opts.name,
    amount: String(opts.amount),
    callback_url: opts.callbackUrl,
    description: opts.description,
    redirect_url: opts.redirectUrl
  });

  // Restrict to credit card only (Visa / Mastercard)
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

// ─── Request handlers ─────────────────────────────────────────────────────────

export const onRequestOptions = async () =>
  new Response(null, { status: 204, headers: corsHeaders });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.RESEND_API_KEY || !env.NOTIFICATION_EMAIL || !env.FROM_EMAIL) {
    return json(
      { error: "Server misconfiguration: missing RESEND_API_KEY, NOTIFICATION_EMAIL, or FROM_EMAIL." },
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

    // Validate: every traveller must have a name
    const travellersRaw: Array<Record<string, string>> = payload.insuredTravellers || [];
    const missingNames = travellersRaw.filter(t => !String(t.fullName || "").trim());
    if (missingNames.length > 0) {
      return json(
        { error: `Full name is required for all travellers. ${missingNames.length} traveller(s) missing.` },
        400
      );
    }

    // ── Payment slip attachment ─────────────────────────────────────────────
    const attachment = formData.get("paymentSlip");
    let attachments: Array<{ filename: string; content: string }> = [];
    if (attachment instanceof File) {
      const buffer = await attachment.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = "";
      bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
      attachments = [{ filename: attachment.name, content: btoa(binary) }];
    }

    const hasSlip = attachments.length > 0;
    const totalPax = travellersRaw.length;
    const planLabel = fmt(PLAN_LABELS, payload.product.selectedPlan);
    const totalFormatted = `RM ${Number(payload.quote.total).toFixed(2)}`;

    // ── Proposer / contact ──────────────────────────────────────────────────
    // Only show the Contact section if the proposer is NOT Traveller 1.
    const showContactSection = payload.proposer.sameAsFirstTraveller === false;

    const contactRows = [
      row("Name",       String(payload.proposer.name       || "—")),
      row("Mobile",     String(payload.proposer.mobile      || "—")),
      row("Email",      String(payload.proposer.email       || "—")),
      row("Occupation", titleCase(String(payload.proposer.occupation || "—"))),
      row("Address",    String(payload.proposer.address     || "—")),
    ].join("");

    // ── Trip ───────────────────────────────────────────────────────────────
    const isAnnual = payload.product.insuranceType === "annual";
    const tripRows = [
      row("Trip Type",     fmt(INSURANCE_TYPE_LABELS, payload.product.insuranceType)),
      row("Policy Type",   fmt(POLICY_TYPE_LABELS, payload.product.policyType)),
      row("Coverage Area", fmt(COVERAGE_AREA_LABELS, payload.product.coverageArea)),
      row("Destination",   String(payload.product.destination || "Malaysia")),
      isAnnual
        ? row("Policy Start", String(payload.product.departureDate || "—"))
        : row("Departure",    String(payload.product.departureDate || "—")),
      isAnnual
        ? row("Policy End",   String(payload.product.returnDate    || "—"))
        : row("Return",       String(payload.product.returnDate    || "—")),
    ].join("");

    // ── Plan & premium ─────────────────────────────────────────────────────
    const planRows = [
      row("Plan",          planLabel),
      row("Total Premium", totalFormatted),
    ].join("");

    const quoteBreakdownRows = (payload.quote.items || [])
      .map((item: Record<string, string | number>) => {
        const label = String(item.label || "Item");
        const value = Number(item.value ?? 0);
        let displayValue: string;
        if (label === "Stamp Duty" && value === 0) {
          displayValue = "Waived";
        } else if (value < 0) {
          displayValue = `−RM ${Math.abs(value).toFixed(2)}`;
        } else {
          displayValue = `RM ${value.toFixed(2)}`;
        }
        return `
          <tr>
            <td style="padding:5px 0 5px 16px;color:#5b6a7f;vertical-align:top;width:38%;font-size:13px">${escapeHtml(label)}</td>
            <td style="padding:5px 0;color:${value < 0 ? "#0a8a4a" : "#132941"};font-weight:500;vertical-align:top;font-size:13px">${escapeHtml(displayValue)}</td>
          </tr>
        `;
      })
      .join("");

    // ── Payment ────────────────────────────────────────────────────────────
    const paymentRows = [
      row("Method", fmt(PAYMENT_METHOD_LABELS, payload.paymentMethod)),
      row("Slip",   hasSlip ? "✓ Attached" : "Not provided"),
    ].join("");

    // ── Travellers (each with their nominees and bank details) ─────────────
    const allNominees: Array<Record<string, string | number>> = payload.nominees || [];
    const allBankDetails: Array<Record<string, string>> = payload.bankDetails || [];

    const travellerRows = (payload.insuredTravellers as Array<Record<string, string>>)
      .map((traveller, index) => {
        const displayName = String(traveller.fullName || "");
        const nationality  = String(traveller.nationality || "MY");
        const idFormatted  = formatIdNumber(String(traveller.idNumber || ""), nationality);
        const submittedDob = String(traveller.dateOfBirth || "").trim();
        const dob = submittedDob || (nationality === "MY" && traveller.idNumber
          ? dobFromNric(String(traveller.idNumber))
          : "");

        const travellerBanks = allBankDetails.filter(
          b => String(b.travellerIndex) === String(index) || b.travellerName === displayName
        );
        const bankBlock = travellerBanks.map(bank => `
          ${sectionHeader(`Bank — ${displayName || `Traveller ${index + 1}`}`)}
          ${[
            row("Bank",           String(bank.bankName || "—")),
            row("Account Number", String(bank.bankAccountNumber || "—")),
          ].join("")}
        `).join("");

        const travellerNominees = allNominees.filter(
          n => String(n.travellerIndex) === String(index)
        );
        const nomineeBlock = travellerNominees.map((nominee, ni) => `
          ${sectionHeader(`Nominee ${ni + 1} — ${displayName || `Traveller ${index + 1}`}`)}
          ${[
            row("Name",            String(nominee.name         || "—")),
            row("Relationship",    String(nominee.relationship || "—")),
            row("NRIC / Passport", String(nominee.idNumber     || "—")),
            row("Allocation",      `${Number(nominee.share || 0)}%`),
          ].join("")}
        `).join("");

        const genderRaw = String(traveller.gender || "").toLowerCase();
        const genderDisplay = (genderRaw && genderRaw !== "gender")
          ? titleCase(genderRaw) : "—";

        return `
          ${sectionHeader(`Traveller ${index + 1}${displayName ? ` — ${displayName}` : ""}`)}
          ${[
            row("Full Name",       displayName || "—"),
            row("Nationality",     formatCountry(nationality)),
            row("NRIC / Passport", idFormatted),
            row("Date of Birth",   dob || "—"),
            row("Gender",          genderDisplay),
            row("Age Band",        fmt(AGE_BAND_LABELS, String(traveller.ageBand || ""))),
            // Contact info — shown on traveller 0 when same as proposer; avoids duplication
            ...(index === 0 && !showContactSection
              ? [
                  row("Mobile", String(payload.proposer.mobile || "—")),
                  row("Email",  String(payload.proposer.email  || "—")),
                ]
              : []),
            ...(traveller.occupation ? [row("Occupation", String(traveller.occupation))] : []),
            ...(traveller.address    ? [row("Address",    String(traveller.address))]    : []),
          ].join("")}
          ${bankBlock}
          ${nomineeBlock}
        `;
      })
      .join("");

    // ── Flights ────────────────────────────────────────────────────────────
    const flightRows = (payload.flights || [] as Array<Record<string, string>>)
      .map((flight: Record<string, string>, index: number) => `
        ${sectionHeader(`Flight ${index + 1}`)}
        ${[
          row("Airline & Flight No.", String(flight.departureFlightNumber || "—")),
          row("Departure Date",       String(flight.departureDate         || "—")),
          row("Arrival Date",         String(flight.arrivalDate           || "—")),
        ].join("")}
      `)
      .join("");

    const hasFlights = (payload.flights || []).length > 0;

    // ── Assemble email ─────────────────────────────────────────────────────
    const emailBody = `
      <!-- Hero row: name + premium -->
      <tr>
        <td colspan="2" style="padding:0 0 4px;font-size:22px;font-weight:800;color:#08254d;letter-spacing:-0.02em">
          ${escapeHtml(payload.proposer.name || "Client")}
        </td>
      </tr>
      <tr>
        <td colspan="2" style="font-size:13px;color:#5b6a7f;padding-bottom:8px">
          ${escapeHtml(planLabel)} &nbsp;&middot;&nbsp; ${escapeHtml(fmt(PAYMENT_METHOD_LABELS, payload.paymentMethod))} &nbsp;&middot;&nbsp; ${totalPax} pax
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding:6px 0 24px;font-size:34px;font-weight:800;color:#0f6da8;letter-spacing:-0.03em;border-bottom:3px solid #08254d">
          ${escapeHtml(totalFormatted)}
        </td>
      </tr>

      ${showContactSection ? `${sectionHeader("Proposer / Contact")}${contactRows}` : ""}

      ${sectionHeader("Trip")}
      ${tripRows}

      ${sectionHeader("Plan & Premium")}
      ${planRows}
      ${quoteBreakdownRows}

      ${sectionHeader("Payment")}
      ${paymentRows}

      ${travellerRows}

      ${hasFlights ? flightRows : ""}

      <!-- Action prompt -->
      <tr>
        <td colspan="2" style="padding-top:28px">
          ${((): string => {
            const method = String(payload.paymentMethod || "");
            const name   = escapeHtml(payload.proposer.name || "Client");
            const plan   = escapeHtml(planLabel);
            const total  = escapeHtml(totalFormatted);

            if (method === "billplz") {
              return `
                <div style="background:#fef9ec;border:1px solid #f0d080;border-radius:10px;padding:14px 18px">
                  <div style="font-size:13px;font-weight:700;color:#7a5c00;margin-bottom:2px">Awaiting Payment</div>
                  <div style="font-size:13px;color:#7a5c00">
                    Payment link created for <strong>${name}</strong> — <strong>${plan}</strong> ${total}. Issue policy once Billplz confirms payment.
                  </div>
                </div>`;
            }
            if (hasSlip) {
              return `
                <div style="background:#f0faf5;border:1px solid #b7e4cc;border-radius:10px;padding:14px 18px">
                  <div style="font-size:13px;font-weight:700;color:#0a5c30;margin-bottom:2px">Receipt Attached — Issue Policy</div>
                  <div style="font-size:13px;color:#0a5c30">
                    <strong>${name}</strong> — <strong>${plan}</strong> ${total}. Receipt attached. Verify and issue.
                  </div>
                </div>`;
            }
            return `
              <div style="background:#fef3ec;border:1px solid #f0b880;border-radius:10px;padding:14px 18px">
                <div style="font-size:13px;font-weight:700;color:#7a3800;margin-bottom:2px">Awaiting Receipt</div>
                <div style="font-size:13px;color:#7a3800">
                  <strong>${name}</strong> — <strong>${plan}</strong> ${total}. No receipt uploaded. Chase client before issuing.
                </div>
              </div>`;
          })()}
        </td>
      </tr>
    `;

    const html = emailWrapper(`New Application — ${planLabel}`, emailBody);

    const subject = [
      "TM Explorer",
      payload.proposer.name || "Client",
      planLabel,
      totalFormatted,
      `${totalPax} Pax`,
      payload.product.departureDate || ""
    ].filter(Boolean).join(" · ");

    // ── Send via Resend ─────────────────────────────────────────────────────
    const resendPayload: Record<string, unknown> = {
      from: env.FROM_EMAIL,
      to: [env.NOTIFICATION_EMAIL],
      subject,
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
      return json({ error: `Email delivery failed: ${errorText}` }, 502);
    }

    // ── Billplz: create bill ────────────────────────────────────────────────
    if (payload.paymentMethod === "billplz") {
      if (!env.BILLPLZ_API_KEY) {
        return json({ error: "Missing BILLPLZ_API_KEY environment variable." }, 500);
      }

      // Add 2% card convenience fee
      const basePremium       = Number(payload.quote.total);
      const convenienceFee    = Math.round(basePremium * 0.02 * 100) / 100;
      const totalWithFee      = Math.round((basePremium + convenienceFee) * 100) / 100;
      const amountInSen       = Math.round(totalWithFee * 100);
      const origin            = new URL(request.url).origin;

      const bill = await createBillplzBill(env, {
        name:        String(payload.proposer.name  || "Client"),
        email:       String(payload.proposer.email || env.NOTIFICATION_EMAIL),
        mobile:      payload.proposer.mobile
          ? String(payload.proposer.mobile).replace(/[^0-9+]/g, "")
          : undefined,
        amount:      amountInSen,
        description: `Tokio Marine Explorer — ${planLabel} — ${payload.proposer.name || "Client"} (incl. 2% card fee)`,
        callbackUrl: `${origin}/api/billplz-callback`,
        redirectUrl: `${origin}/?payment=success`,
        reference1:  String(payload.proposer.name || "Client")
      });

      return json({ ok: true, billplzUrl: bill.url, billId: bill.id, convenienceFee, totalWithFee });
    }

    return json({ ok: true });

  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Unknown error." },
      500
    );
  }
};
