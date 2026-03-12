interface Env {
  RESEND_API_KEY: string;
  NOTIFICATION_EMAIL: string;
  FROM_EMAIL: string;
  CLIENT_CONFIRMATION_EMAIL?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
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

export const onRequestOptions = async () =>
  new Response(null, {
    status: 204,
    headers: corsHeaders
  });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.RESEND_API_KEY || !env.NOTIFICATION_EMAIL || !env.FROM_EMAIL) {
    return json(
      {
        error: "Missing RESEND_API_KEY, NOTIFICATION_EMAIL, or FROM_EMAIL environment variable."
      },
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
      bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
      });
      attachments = [
        {
          filename: attachment.name,
          content: btoa(binary)
        }
      ];
    }

    const proposerRows = renderDefinitionList([
      ["Name", payload.proposer.name],
      ["Mobile", payload.proposer.mobile],
      ["Email", payload.proposer.email],
      ["Occupation", payload.proposer.occupation],
      ["Address", payload.proposer.address],
      ["Bank", payload.proposer.bankName ? `${payload.proposer.bankName}${payload.proposer.bankAccountType ? ` (${payload.proposer.bankAccountType})` : ""}` : "-"],
      ["Account number", payload.proposer.bankAccountNumber || "-"]
    ]);

    const productRows = renderDefinitionList([
      ["Insurance type", payload.product.insuranceType],
      ["Coverage scope", payload.product.coverageScope],
      ["Coverage area", payload.product.coverageArea],
      ["Policy type", payload.product.policyType],
      ["Plan", payload.product.selectedPlan],
      ["Departure", payload.product.departureDate],
      ["Return", payload.product.returnDate],
      ["Destination", payload.product.destination || "Malaysia"],
      ["Payment method", payload.paymentMethod],
      ["Total quote", `RM ${Number(payload.quote.total).toFixed(2)}`]
    ]);

    const travellerRows = payload.insuredTravellers
      .map(
        (traveller: Record<string, string>, index: number) => `
          <tr>
            <td colspan="2" style="padding-top:14px;font-weight:700;color:#0f6da8">Traveller ${index + 1}</td>
          </tr>
          ${renderDefinitionList([
            ["Age bucket", traveller.ageBand],
            ["Family role", traveller.category || "-"],
            ["Name", traveller.fullName],
            ["Nationality", traveller.nationality],
            ["ID", traveller.idNumber],
            ["DOB", traveller.dateOfBirth],
            ["Gender", traveller.gender],
            ["Mobile", traveller.mobile],
            ["Email", traveller.email],
            ["Occupation", traveller.occupation],
            ["Address", traveller.address]
          ])}
        `
      )
      .join("");

    const flightRows = (payload.flights || [])
      .map(
        (flight: Record<string, string>, index: number) => `
          <tr>
            <td colspan="2" style="padding-top:14px;font-weight:700;color:#0f6da8">Flight ${index + 1}</td>
          </tr>
          ${renderDefinitionList([
            ["Departure flight", String(flight.departureFlightNumber || "-")],
            ["Departure date", String(flight.departureDate || "-")],
            ["Arrival flight", String(flight.arrivalFlightNumber || "-")],
            ["Arrival date", String(flight.arrivalDate || "-")]
          ])}
        `
      )
      .join("");

    const nomineeRows = (payload.nominees || [])
      .map(
        (nominee: Record<string, string | number>, index: number) => `
          <tr>
            <td colspan="2" style="padding-top:14px;font-weight:700;color:#0f6da8">Nominee ${index + 1}</td>
          </tr>
          ${renderDefinitionList([
            ["Name", String(nominee.name || "-")],
            ["Relationship", String(nominee.relationship || "-")],
            ["ID", String(nominee.idNumber || "-")],
            ["Contact", String(nominee.contact || "-")],
            ["Share", `${Number(nominee.share || 0)}%`]
          ])}
        `
      )
      .join("");

    const bankRows = (payload.bankDetails || [])
      .map(
        (bank: Record<string, string>, index: number) => `
          <tr>
            <td colspan="2" style="padding-top:14px;font-weight:700;color:#0f6da8">${escapeHtml(
              bank.travellerName ? `Bank ${index + 1} for ${bank.travellerName}` : `Bank ${index + 1}`
            )}</td>
          </tr>
          ${renderDefinitionList([
            ["Bank", String(bank.bankName ? `${bank.bankName}${bank.bankAccountType ? ` (${bank.bankAccountType})` : ""}` : "-")],
            ["Account number", String(bank.bankAccountNumber || "-")]
          ])}
        `
      )
      .join("");

    const html = `
      <div style="font-family:Arial,sans-serif;background:#f7f4ef;padding:24px;color:#132941">
        <div style="max-width:760px;margin:0 auto;background:#fff;border-radius:20px;padding:28px">
          <p style="margin:0 0 8px;color:#0f6da8;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase">
            Travel insurance submission
          </p>
          <h1 style="margin:0 0 16px;font-size:28px;line-height:1.1">New Tokio Marine Explorer intake</h1>
          <p style="margin:0 0 18px;color:#5b6a7f">
            Sent from the client-facing travel insurance site. Payment slip is attached if supplied.
          </p>

          <h2 style="margin:24px 0 10px;font-size:18px">Product and quote</h2>
          <table style="width:100%;border-collapse:collapse">${productRows}</table>

          <h2 style="margin:24px 0 10px;font-size:18px">Proposer</h2>
          <table style="width:100%;border-collapse:collapse">${proposerRows}</table>

          <h2 style="margin:24px 0 10px;font-size:18px">Bank details</h2>
          <table style="width:100%;border-collapse:collapse">${bankRows || renderDefinitionList([["Bank details", "None provided"]])}</table>

          <h2 style="margin:24px 0 10px;font-size:18px">Insured travellers</h2>
          <table style="width:100%;border-collapse:collapse">${travellerRows}</table>

          <h2 style="margin:24px 0 10px;font-size:18px">Flight details</h2>
          <table style="width:100%;border-collapse:collapse">${flightRows || renderDefinitionList([["Flights", "None provided"]])}</table>

          <h2 style="margin:24px 0 10px;font-size:18px">Nominee</h2>
          <table style="width:100%;border-collapse:collapse">${nomineeRows || renderDefinitionList([["Nominees", "None provided"]])}</table>
        </div>
      </div>
    `;

    const resendPayload: Record<string, unknown> = {
      from: env.FROM_EMAIL,
      to: [env.NOTIFICATION_EMAIL],
      subject: `Explorer submission - ${payload.proposer.name || "Client"} - RM ${Number(payload.quote.total).toFixed(2)}`,
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

    return json({ ok: true });
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "Unknown submission error."
      },
      500
    );
  }
};
