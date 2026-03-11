const PREMIUMS = {
  international: {
    area1: {
      under70: {
        basic: [47, 68, 110, 144, 34, 365],
        essential: [58, 84, 135, 179, 44, 455],
        deluxe: [86, 130, 187, 238, 58, 627]
      },
      senior: {
        basic: [128, 192, 300, 395, 95, 1031],
        essential: [161, 237, 368, 483, 115, 1264],
        deluxe: [185, 277, 412, 531, 127, 1408]
      },
      family: {
        basic: [120, 173, 278, 365, 85, 924],
        essential: [149, 216, 343, 455, 111, 1114],
        deluxe: [219, 331, 476, 605, 148, 1550]
      }
    },
    area2: {
      under70: {
        basic: [71, 102, 164, 216, 50, 506],
        essential: [83, 123, 198, 265, 66, 650],
        deluxe: [121, 176, 260, 334, 83, 851]
      },
      senior: {
        basic: [192, 287, 449, 592, 143, 1432],
        essential: [237, 353, 548, 721, 173, 1747],
        deluxe: [271, 401, 601, 779, 187, 1920]
      },
      family: {
        basic: [178, 258, 415, 546, 128, 1281],
        essential: [213, 314, 505, 673, 166, 1525],
        deluxe: [308, 449, 660, 847, 209, 2033]
      }
    },
    area3: {
      under70: {
        basic: [175, 253, 408, 538, 126, 1137],
        essential: [215, 310, 496, 705, 164, 1438],
        deluxe: [324, 466, 671, 899, 212, 2006]
      },
      senior: {
        basic: [478, 716, 1121, 1478, 357, 3218],
        essential: [583, 871, 1360, 1792, 432, 3907],
        deluxe: [688, 1021, 1525, 1972, 477, 4447]
      },
      family: {
        basic: [441, 641, 1033, 1362, 319, 2875],
        essential: [502, 754, 1231, 1651, 415, 3358],
        deluxe: [779, 1149, 1674, 2140, 536, 4796]
      }
    }
  },
  domestic: {
    under70: [23, 30, 45, 60, 15, 230],
    senior: [62, 83, 124, 165, 41, 620],
    family: [57, 76, 114, 152, 38, 570]
  }
};

const AREA_LABELS = {
  area1: "Area 1",
  area2: "Area 2",
  area3: "Area 3",
  domestic: "Domestic"
};

const PAYMENT_CONTENT = {
  duitnow: `
    <strong>DuitNow QR</strong>
    <p>Ask the client to scan Henry's DuitNow QR and pay the exact total shown in the summary. Upload the screenshot before submitting.</p>
  `,
  tng: `
    <strong>Touch 'n Go eWallet</strong>
    <p>Transfer to <b>LEE MOU YEN</b> at <b>012 612 3540</b>, then upload the payment screenshot.</p>
  `,
  bank: `
    <strong>RHB Bank Transfer</strong>
    <p>Account name <b>LEE MOU YEN</b><br>Account number <b>1040 2700 307120</b></p>
  `,
  billplz: `
    <strong>Billplz card request</strong>
    <p>After submission, Henry can send the client a secure Billplz payment link. Slip upload is optional for this option.</p>
  `
};

const state = {
  step: 1,
  selectedPlan: "basic",
  policyType: "individual",
  insuredCount: 1,
  quote: null,
  travellerSignature: ""
};

const form = document.querySelector("#applicationForm");
const insuredList = document.querySelector("#insuredList");
const segmentsList = document.querySelector("#segmentsList");
const summaryList = document.querySelector("#summaryList");
const paymentDetailBox = document.querySelector("#paymentDetailBox");

function getField(id) {
  return document.getElementById(id);
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2
  }).format(value);
}

function parseDate(value) {
  return value ? new Date(`${value}T00:00:00`) : null;
}

function dateDiffInDays(start, end) {
  if (!start || !end) return null;
  return Math.round((end - start) / 86400000);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toInputDate(date) {
  return date.toISOString().split("T")[0];
}

function getTripDays() {
  const insuranceType = getField("insuranceType").value;
  const departure = parseDate(getField("departureDate").value);
  if (!departure) return null;
  if (insuranceType === "annual") return 365;
  const returned = parseDate(getField("returnDate").value);
  return dateDiffInDays(departure, returned);
}

function getTravellerCounts() {
  return {
    under70: Number(getField("under70Count").value || 0),
    senior: Number(getField("seniorCount").value || 0)
  };
}

function getTotalTravellers() {
  const { under70, senior } = getTravellerCounts();
  return under70 + senior;
}

function getSelectedArea() {
  return getField("coverageScope").value === "domestic"
    ? "domestic"
    : document.querySelector('input[name="coverageArea"]:checked').value;
}

function getPolicyOptions() {
  const { under70, senior } = getTravellerCounts();
  const total = under70 + senior;
  if (total <= 1) {
    return [{ value: "individual", label: "Individual", note: "For exactly one traveller." }];
  }
  if (senior > 0) {
    return [{ value: "group", label: "Group", note: "Required when any traveller is aged 71 to 85." }];
  }
  return [
    { value: "family", label: "Family", note: "All travellers aged 30 days to 70 years." },
    { value: "group", label: "Group", note: "Minimum 2 travellers, 5% discount." }
  ];
}

function renderPolicyChoices() {
  const container = getField("policyTypeChoices");
  const options = getPolicyOptions();
  if (!options.some((item) => item.value === state.policyType)) {
    state.policyType = options[0].value;
  }
  container.innerHTML = options
    .map(
      (option) => `
        <label class="choice">
          <input type="radio" name="policyType" value="${option.value}" ${option.value === state.policyType ? "checked" : ""}>
          <span>
            <strong>${option.label}</strong>
            <small>${option.note}</small>
          </span>
        </label>
      `
    )
    .join("");

  container.querySelectorAll('input[name="policyType"]').forEach((input) => {
    input.addEventListener("change", () => {
      state.policyType = input.value;
      refreshQuote();
    });
  });

  getField("policyTypePill").textContent = `Policy type: ${state.policyType[0].toUpperCase()}${state.policyType.slice(1)}`;
}

function renderPlanChoices() {
  const container = getField("planChoices");
  const isDomestic = getField("coverageScope").value === "domestic";
  const plans = isDomestic
    ? [{ value: "domestic", label: "Domestic", note: "Accidents-only domestic cover." }]
    : [
        { value: "basic", label: "Basic", note: "Entry tier international cover." },
        { value: "essential", label: "Essential", note: "Includes lounge access benefits." },
        { value: "deluxe", label: "Deluxe", note: "Includes Cancel for Any Reason benefit." }
      ];

  if (!plans.some((item) => item.value === state.selectedPlan)) {
    state.selectedPlan = plans[0].value;
  }

  container.innerHTML = plans
    .map(
      (plan) => `
        <label class="choice">
          <input type="radio" name="selectedPlan" value="${plan.value}" ${plan.value === state.selectedPlan ? "checked" : ""}>
          <span>
            <strong>${plan.label}</strong>
            <small>${plan.note}</small>
          </span>
        </label>
      `
    )
    .join("");

  container.querySelectorAll('input[name="selectedPlan"]').forEach((input) => {
    input.addEventListener("change", () => {
      state.selectedPlan = input.value;
      refreshQuote();
    });
  });
}

function getBracketValue(table, days, annual) {
  if (annual) return table[5];
  if (days <= 5) return table[0];
  if (days <= 10) return table[1];
  if (days <= 18) return table[2];
  if (days <= 31) return table[3];
  const extraWeeks = Math.ceil((days - 31) / 7);
  return table[3] + extraWeeks * table[4];
}

function calculateQuote() {
  const insuranceType = getField("insuranceType").value;
  const coverageScope = getField("coverageScope").value;
  const annual = insuranceType === "annual";
  const days = getTripDays();
  const area = getSelectedArea();
  const counts = getTravellerCounts();
  const totalTravellers = counts.under70 + counts.senior;

  if (!days || totalTravellers === 0) return null;

  let premium = 0;
  let discount = 0;
  const items = [];

  if (coverageScope === "domestic") {
    const domesticTable = PREMIUMS.domestic;
    if (state.policyType === "family") {
      premium = getBracketValue(domesticTable.family, days, annual);
      items.push({ label: "Domestic family premium", value: premium });
    } else if (state.policyType === "group") {
      const under70Rate = getBracketValue(domesticTable.under70, days, annual) * counts.under70;
      const seniorRate = getBracketValue(domesticTable.senior, days, annual) * counts.senior;
      premium = under70Rate + seniorRate;
      discount = premium * 0.05;
      items.push({ label: "Domestic group base", value: premium });
      items.push({ label: "Group discount (5%)", value: -discount });
    } else {
      const bucket = counts.senior > 0 ? "senior" : "under70";
      premium = getBracketValue(domesticTable[bucket], days, annual);
      items.push({ label: `Domestic ${bucket === "senior" ? "senior" : "individual"} premium`, value: premium });
    }

    const taxablePremium = premium - discount;
    const serviceTax = taxablePremium * 0.08;
    const stampDuty = 10;
    return {
      area,
      days,
      premium: taxablePremium,
      discount,
      serviceTax,
      stampDuty,
      total: taxablePremium + serviceTax + stampDuty,
      items: [...items, { label: "Service tax (8%)", value: serviceTax }, { label: "Stamp duty", value: stampDuty }]
    };
  }

  const areaTable = PREMIUMS.international[area];
  if (state.policyType === "family") {
    premium = getBracketValue(areaTable.family[state.selectedPlan], days, annual);
    items.push({ label: `${state.selectedPlan} family premium`, value: premium });
  } else if (state.policyType === "group") {
    const under70Rate = getBracketValue(areaTable.under70[state.selectedPlan], days, annual) * counts.under70;
    const seniorRate = getBracketValue(areaTable.senior[state.selectedPlan], days, annual) * counts.senior;
    premium = under70Rate + seniorRate;
    discount = premium * 0.05;
    items.push({ label: "Group base premium", value: premium });
    items.push({ label: "Group discount (5%)", value: -discount });
  } else {
    const bucket = counts.senior > 0 ? "senior" : "under70";
    premium = getBracketValue(areaTable[bucket][state.selectedPlan], days, annual);
    items.push({ label: `${state.selectedPlan} ${bucket === "senior" ? "senior" : "individual"} premium`, value: premium });
  }

  const stampDuty = 10;
  return {
    area,
    days,
    premium: premium - discount,
    discount,
    serviceTax: 0,
    stampDuty,
    total: premium - discount + stampDuty,
    items: [...items, { label: "Stamp duty", value: stampDuty }]
  };
}

function refreshQuote() {
  state.quote = calculateQuote();
  const quote = state.quote;
  const breakdown = getField("quoteBreakdown");
  if (!quote) {
    getField("quoteTotal").textContent = formatMoney(0);
    getField("quoteNote").textContent = "Choose your trip details to calculate.";
    breakdown.innerHTML = "";
    return;
  }

  getField("quoteTotal").textContent = formatMoney(quote.total);
  getField("quoteNote").textContent =
    `${quote.days} day${quote.days > 1 ? "s" : ""} • ${AREA_LABELS[quote.area]} • ${state.policyType}`;

  breakdown.innerHTML = quote.items
    .map((item) => `<div><dt>${item.label}</dt><dd>${item.value < 0 ? "-" : ""}${formatMoney(Math.abs(item.value))}</dd></div>`)
    .join("");

  syncTravellerCards();
  populateSummary();
}

function buildTravellerCard(index, category) {
  return `
    <article class="traveller-card" data-traveller-card="${index}">
      <div class="card-header">
        <h5>Insured ${index + 1}</h5>
        <span class="badge">${category === "senior" ? "Age 71-85" : "Age 30 days-70"}</span>
      </div>
      <div class="field-grid two">
        <label class="field">
          <span>Full name</span>
          <input type="text" name="insuredName_${index}" required>
        </label>
        <label class="field">
          <span>NRIC / passport</span>
          <input type="text" name="insuredId_${index}" required>
        </label>
      </div>
      <div class="field-grid three">
        <label class="field">
          <span>Date of birth</span>
          <input type="date" name="insuredDob_${index}" required>
        </label>
        <label class="field">
          <span>Gender</span>
          <select name="insuredGender_${index}" required>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <label class="field">
          <span>Nationality</span>
          <input type="text" name="insuredNationality_${index}" required>
        </label>
      </div>
      <div class="field-grid two">
        <label class="field">
          <span>Relationship to proposer</span>
          <input type="text" name="insuredRelationship_${index}" required>
        </label>
        <label class="field">
          <span>Passport expiry (optional)</span>
          <input type="date" name="insuredPassportExpiry_${index}">
        </label>
      </div>
    </article>
  `;
}

function syncTravellerCards() {
  const counts = getTravellerCounts();
  const travellers = [
    ...Array.from({ length: counts.under70 }, () => "under70"),
    ...Array.from({ length: counts.senior }, () => "senior")
  ];
  const signature = travellers.join("|");

  state.insuredCount = travellers.length;
  getField("travellerSummaryText").textContent = `${travellers.length} traveller${travellers.length === 1 ? "" : "s"} to complete.`;
  if (signature === state.travellerSignature) {
    return;
  }
  state.travellerSignature = signature;
  insuredList.innerHTML = travellers.map((type, index) => buildTravellerCard(index, type)).join("");
}

function buildSegmentCard(index) {
  return `
    <article class="segment-card" data-segment-card="${index}">
      <div class="card-header">
        <h5>Segment ${index + 1}</h5>
        ${index === 0 ? "" : `<button type="button" class="button button-secondary" data-remove-segment="${index}">Remove</button>`}
      </div>
      <div class="field-grid two">
        <label class="field">
          <span>Airline / carrier</span>
          <input type="text" name="segmentCarrier_${index}">
        </label>
        <label class="field">
          <span>Flight / route number</span>
          <input type="text" name="segmentNumber_${index}">
        </label>
      </div>
      <div class="field-grid three">
        <label class="field">
          <span>From</span>
          <input type="text" name="segmentFrom_${index}">
        </label>
        <label class="field">
          <span>To</span>
          <input type="text" name="segmentTo_${index}">
        </label>
        <label class="field">
          <span>Date</span>
          <input type="date" name="segmentDate_${index}">
        </label>
      </div>
    </article>
  `;
}

function renderSegments(count = 1, values = []) {
  segmentsList.innerHTML = Array.from({ length: count }, (_, index) => buildSegmentCard(index)).join("");
  values.forEach((segment, index) => {
    if (!form.elements[`segmentCarrier_${index}`]) return;
    form.elements[`segmentCarrier_${index}`].value = segment.carrier || "";
    form.elements[`segmentNumber_${index}`].value = segment.number || "";
    form.elements[`segmentFrom_${index}`].value = segment.from || "";
    form.elements[`segmentTo_${index}`].value = segment.to || "";
    form.elements[`segmentDate_${index}`].value = segment.date || "";
  });
  bindSegmentActions();
}

function bindSegmentActions() {
  segmentsList.querySelectorAll("[data-remove-segment]").forEach((button) => {
    button.addEventListener("click", () => {
      const values = getSegmentDrafts();
      if (values.length <= 1) return;
      values.splice(Number(button.dataset.removeSegment), 1);
      renderSegments(values.length, values);
    });
  });
}

function collectTravellers() {
  return Array.from(insuredList.querySelectorAll("[data-traveller-card]")).map((card, index) => ({
    category: card.querySelector(".badge").textContent,
    fullName: form.elements[`insuredName_${index}`].value.trim(),
    idNumber: form.elements[`insuredId_${index}`].value.trim(),
    dateOfBirth: form.elements[`insuredDob_${index}`].value,
    gender: form.elements[`insuredGender_${index}`].value,
    nationality: form.elements[`insuredNationality_${index}`].value.trim(),
    relationship: form.elements[`insuredRelationship_${index}`].value.trim(),
    passportExpiry: form.elements[`insuredPassportExpiry_${index}`].value
  }));
}

function collectSegments() {
  return Array.from(segmentsList.querySelectorAll("[data-segment-card]")).map((_, index) => ({
    carrier: form.elements[`segmentCarrier_${index}`]?.value.trim() || "",
    number: form.elements[`segmentNumber_${index}`]?.value.trim() || "",
    from: form.elements[`segmentFrom_${index}`]?.value.trim() || "",
    to: form.elements[`segmentTo_${index}`]?.value.trim() || "",
    date: form.elements[`segmentDate_${index}`]?.value || ""
  })).filter((segment) => Object.values(segment).some(Boolean));
}

function getSegmentDrafts() {
  return Array.from(segmentsList.querySelectorAll("[data-segment-card]")).map((_, index) => ({
    carrier: form.elements[`segmentCarrier_${index}`]?.value.trim() || "",
    number: form.elements[`segmentNumber_${index}`]?.value.trim() || "",
    from: form.elements[`segmentFrom_${index}`]?.value.trim() || "",
    to: form.elements[`segmentTo_${index}`]?.value.trim() || "",
    date: form.elements[`segmentDate_${index}`]?.value || ""
  }));
}

function populateSummary() {
  const quote = state.quote;
  if (!quote) return;

  const departureDate = getField("departureDate").value;
  const insuranceType = getField("insuranceType").value;
  const coverageScope = getField("coverageScope").value;
  const returnDate = insuranceType === "annual"
    ? toInputDate(addDays(parseDate(departureDate), 365))
    : getField("returnDate").value;

  summaryList.innerHTML = `
    <div><dt>Insurance type</dt><dd>${insuranceType === "annual" ? "Annual" : "Single trip"}</dd></div>
    <div><dt>Coverage scope</dt><dd>${coverageScope === "domestic" ? "Domestic" : "International"}</dd></div>
    <div><dt>Coverage area</dt><dd>${AREA_LABELS[quote.area]}</dd></div>
    <div><dt>Policy type</dt><dd>${state.policyType}</dd></div>
    <div><dt>Plan</dt><dd>${state.selectedPlan}</dd></div>
    <div><dt>Travellers</dt><dd>${getTotalTravellers()}</dd></div>
    <div><dt>Travel dates</dt><dd>${departureDate} to ${returnDate}</dd></div>
    <div><dt>Destination</dt><dd>${coverageScope === "domestic" ? "Malaysia" : getField("destination").value.trim() || "-"}</dd></div>
    <div><dt>Proposer</dt><dd>${getField("proposerName").value.trim() || "-"}</dd></div>
    <div><dt>Payment method</dt><dd>${(document.querySelector('input[name="paymentMethod"]:checked')?.value || "").toUpperCase()}</dd></div>
  `;

  getField("summaryTotal").textContent = formatMoney(quote.total);
}

function setPaymentContent() {
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  paymentDetailBox.innerHTML = PAYMENT_CONTENT[paymentMethod];
  populateSummary();
}

function showError(id, message) {
  const errorEl = document.querySelector(`[data-error-for="${id}"]`);
  if (errorEl) errorEl.textContent = message;
}

function clearError(id) {
  showError(id, "");
}

function validateStep(step) {
  let valid = true;
  const insuranceType = getField("insuranceType").value;
  const coverageScope = getField("coverageScope").value;
  const departureDate = parseDate(getField("departureDate").value);
  const returnDate = parseDate(getField("returnDate").value);
  const totalTravellers = getTotalTravellers();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (step === 1) {
    clearError("departureDate");
    clearError("returnDate");
    clearError("policyType");
    clearError("selectedPlan");
    clearError("destination");
    clearError("travelPurpose");

    if (!departureDate) {
      showError("departureDate", "Select a departure or policy start date.");
      valid = false;
    }

    if (coverageScope !== "domestic" && !getField("destination").value.trim()) {
      valid = false;
      showError("destination", "Destination is required for international cover.");
    }

    if (!getField("travelPurpose").value) {
      valid = false;
      showError("travelPurpose", "Select the travel purpose.");
    }

    if (departureDate && departureDate < today) {
      showError("departureDate", "Backdating is not allowed.");
      valid = false;
    }

    if (departureDate) {
      const twentyFourMonths = new Date(today);
      twentyFourMonths.setMonth(twentyFourMonths.getMonth() + 24);
      if (departureDate > twentyFourMonths) {
        showError("departureDate", "Inception date cannot be more than 24 months from today.");
        valid = false;
      }
      if (insuranceType === "annual") {
        const sixMonths = new Date(today);
        sixMonths.setMonth(sixMonths.getMonth() + 6);
        if (departureDate > sixMonths) {
          showError("departureDate", "Annual plan cannot be issued more than 6 months in advance.");
          valid = false;
        }
      }
    }

    if (insuranceType === "single") {
      if (!returnDate || !departureDate || returnDate <= departureDate) {
        showError("returnDate", "Return date must be after departure date.");
        valid = false;
      } else {
        const days = getTripDays();
        if (days > 180) {
          showError("returnDate", "Single trip maximum cover is 180 days.");
          valid = false;
        }
      }
    }

    if (totalTravellers === 0) {
      showError("policyType", "At least one traveller is required.");
      valid = false;
    } else if (totalTravellers > 20) {
      showError("policyType", "Only a maximum of 20 travellers are allowed.");
      valid = false;
    }

    if (!state.selectedPlan) {
      showError("selectedPlan", "Select a plan.");
      valid = false;
    }

    if (!state.quote) {
      showError("selectedPlan", "Quote could not be calculated. Check the dates and traveller setup.");
      valid = false;
    }
  }

  if (step === 2) {
    [
      "proposerName",
      "proposerMobile",
      "proposerEmail",
      "proposerOccupation",
      "proposerAddress",
      "bankName",
      "bankAccountNumber",
      "bankAccountType"
    ].forEach((fieldId) => {
      clearError(fieldId);
      if (!getField(fieldId).value.trim()) {
        showError(fieldId, "This field is required.");
        valid = false;
      }
    });

    collectTravellers().forEach((traveller) => {
      if (!traveller.fullName || !traveller.idNumber || !traveller.dateOfBirth || !traveller.gender || !traveller.nationality || !traveller.relationship) {
        valid = false;
      }
    });
  }

  if (step === 3) {
    ["nomineeName", "nomineeRelationship", "nomineeId", "nomineeContact", "nomineeShare"].forEach((fieldId) => {
      clearError(fieldId);
      if (!String(getField(fieldId).value).trim()) {
        showError(fieldId, "This field is required.");
        valid = false;
      }
    });

    const share = Number(getField("nomineeShare").value || 0);
    if (share < 1 || share > 100) {
      showError("nomineeShare", "Nominee share must be between 1 and 100.");
      valid = false;
    }
  }

  if (step === 4) {
    clearError("paymentSlip");
    clearError("consent");
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const slip = getField("paymentSlip").files[0];
    if (["duitnow", "tng", "bank"].includes(paymentMethod) && !slip) {
      showError("paymentSlip", "Upload the payment slip for this method.");
      valid = false;
    }
    if (!getField("consent").checked) {
      showError("consent", "Consent is required before submit.");
      valid = false;
    }
  }

  return valid;
}

function goToStep(step) {
  state.step = step;
  document.querySelectorAll(".form-step").forEach((panel) => {
    panel.classList.toggle("is-active", Number(panel.dataset.stepPanel) === step);
  });
  document.querySelectorAll(".stepper .step").forEach((item) => {
    const itemStep = Number(item.dataset.step);
    item.classList.toggle("is-active", itemStep === step);
    item.classList.toggle("is-complete", itemStep < step);
  });
  window.scrollTo({ top: document.querySelector("#application").offsetTop - 30, behavior: "smooth" });
}

async function submitForm(event) {
  event.preventDefault();
  if (!validateStep(4)) return;

  const button = getField("submitButton");
  button.disabled = true;
  button.textContent = "Submitting...";

  const insuranceType = getField("insuranceType").value;
  const departureDate = getField("departureDate").value;
  const finalReturnDate = insuranceType === "annual"
    ? toInputDate(addDays(parseDate(departureDate), 365))
    : getField("returnDate").value;

  const payload = {
    quote: state.quote,
    product: {
      insuranceType,
      coverageScope: getField("coverageScope").value,
      coverageArea: getSelectedArea(),
      policyType: state.policyType,
      selectedPlan: state.selectedPlan,
      departureDate,
      returnDate: finalReturnDate,
      destination: getField("destination").value.trim(),
      travelPurpose: getField("travelPurpose").value
    },
    counts: getTravellerCounts(),
    proposer: {
      name: getField("proposerName").value.trim(),
      mobile: getField("proposerMobile").value.trim(),
      email: getField("proposerEmail").value.trim(),
      occupation: getField("proposerOccupation").value.trim(),
      address: getField("proposerAddress").value.trim(),
      bankName: getField("bankName").value.trim(),
      bankAccountNumber: getField("bankAccountNumber").value.trim(),
      bankAccountType: getField("bankAccountType").value
    },
    insuredTravellers: collectTravellers(),
    segments: collectSegments(),
    nominee: {
      name: getField("nomineeName").value.trim(),
      relationship: getField("nomineeRelationship").value,
      idNumber: getField("nomineeId").value.trim(),
      contact: getField("nomineeContact").value.trim(),
      share: Number(getField("nomineeShare").value)
    },
    notes: getField("clientNotes").value.trim(),
    paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value
  };

  const body = new FormData();
  body.append("submission", JSON.stringify(payload));

  const slip = getField("paymentSlip").files[0];
  if (slip) body.append("paymentSlip", slip);

  try {
    const response = await fetch("/api/submit", {
      method: "POST",
      body
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Submission failed.");

    form.hidden = true;
    document.querySelector("#successCard").hidden = false;
  } catch (error) {
    showError("consent", error.message);
  } finally {
    button.disabled = false;
    button.textContent = "Submit application";
  }
}

function resetForm() {
  form.reset();
  state.selectedPlan = "basic";
  state.policyType = "individual";
  state.travellerSignature = "";
  form.hidden = false;
  document.querySelector("#successCard").hidden = true;
  getField("under70Count").value = 1;
  getField("seniorCount").value = 0;
  renderPolicyChoices();
  renderPlanChoices();
  renderSegments(1);
  refreshVisibility();
  refreshQuote();
  goToStep(1);
}

function refreshVisibility() {
  const isDomestic = getField("coverageScope").value === "domestic";
  const isAnnual = getField("insuranceType").value === "annual";
  getField("areaField").hidden = isDomestic;
  getField("destinationField").hidden = isDomestic;
  getField("returnField").hidden = isAnnual;
  getField("departureLabel").textContent = isAnnual ? "Policy start date" : "Departure date";

  if (isAnnual && getField("departureDate").value) {
    getField("returnDate").value = toInputDate(addDays(parseDate(getField("departureDate").value), 365));
  }

  renderPlanChoices();
  renderPolicyChoices();
  setPaymentContent();
}

function initMinDates() {
  const today = toInputDate(new Date());
  getField("departureDate").min = today;
  getField("returnDate").min = today;
  getField("departureDate").addEventListener("change", () => {
    getField("returnDate").min = getField("departureDate").value || today;
    if (getField("insuranceType").value === "annual" && getField("departureDate").value) {
      getField("returnDate").value = toInputDate(addDays(parseDate(getField("departureDate").value), 365));
    }
    refreshQuote();
  });
}

document.querySelectorAll("[data-counter]").forEach((button) => {
  button.addEventListener("click", () => {
    const field = button.dataset.counter === "under70" ? getField("under70Count") : getField("seniorCount");
    const next = Math.max(0, Math.min(20, Number(field.value || 0) + Number(button.dataset.delta)));
    field.value = String(next);
    renderPolicyChoices();
    refreshQuote();
  });
});

["under70Count", "seniorCount"].forEach((id) => {
  getField(id).addEventListener("change", () => {
    renderPolicyChoices();
    refreshQuote();
  });
});

["insuranceType", "coverageScope", "travelPurpose"].forEach((id) => {
  getField(id).addEventListener("change", () => {
    refreshVisibility();
    refreshQuote();
  });
});

document.querySelectorAll('input[name="coverageArea"]').forEach((input) => {
  input.addEventListener("change", refreshQuote);
});

document.querySelectorAll('input[name="paymentMethod"]').forEach((input) => {
  input.addEventListener("change", setPaymentContent);
});

document.querySelectorAll("[data-next-step]").forEach((button) => {
  button.addEventListener("click", () => {
    const current = Number(button.dataset.nextStep) - 1;
    if (!validateStep(current)) return;
    populateSummary();
    goToStep(Number(button.dataset.nextStep));
  });
});

document.querySelectorAll("[data-prev-step]").forEach((button) => {
  button.addEventListener("click", () => goToStep(Number(button.dataset.prevStep)));
});

getField("addSegmentButton").addEventListener("click", () => {
  const values = getSegmentDrafts();
  values.push({ carrier: "", number: "", from: "", to: "", date: "" });
  renderSegments(values.length, values);
});

getField("startNewButton").addEventListener("click", resetForm);
form.addEventListener("submit", submitForm);

renderPolicyChoices();
renderPlanChoices();
renderSegments(1);
setPaymentContent();
initMinDates();
refreshVisibility();
refreshQuote();
