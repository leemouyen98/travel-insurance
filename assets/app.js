const PREMIUMS = {
  international: {
    area1: {
      under70: { basic: [47, 68, 110, 144, 34, 365], essential: [58, 84, 135, 179, 44, 455], deluxe: [86, 130, 187, 238, 58, 627] },
      senior: { basic: [128, 192, 300, 395, 95, 1031], essential: [161, 237, 368, 483, 115, 1264], deluxe: [185, 277, 412, 531, 127, 1408] },
      family: { basic: [120, 173, 278, 365, 85, 924], essential: [149, 216, 343, 455, 111, 1114], deluxe: [219, 331, 476, 605, 148, 1550] }
    },
    area2: {
      under70: { basic: [71, 102, 164, 216, 50, 506], essential: [83, 123, 198, 265, 66, 650], deluxe: [121, 176, 260, 334, 83, 851] },
      senior: { basic: [192, 287, 449, 592, 143, 1432], essential: [237, 353, 548, 721, 173, 1747], deluxe: [271, 401, 601, 779, 187, 1920] },
      family: { basic: [178, 258, 415, 546, 128, 1281], essential: [213, 314, 505, 673, 166, 1525], deluxe: [308, 449, 660, 847, 209, 2033] }
    },
    area3: {
      under70: { basic: [175, 253, 408, 538, 126, 1137], essential: [215, 310, 496, 705, 164, 1438], deluxe: [324, 466, 671, 899, 212, 2006] },
      senior: { basic: [478, 716, 1121, 1478, 357, 3218], essential: [583, 871, 1360, 1792, 432, 3907], deluxe: [688, 1021, 1525, 1972, 477, 4447] },
      family: { basic: [441, 641, 1033, 1362, 319, 2875], essential: [502, 754, 1231, 1651, 415, 3358], deluxe: [779, 1149, 1674, 2140, 536, 4796] }
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
  duitnow: '<strong>DuitNow QR</strong><p>Scan Henry\'s QR and upload the payment screenshot before submit.</p><img src="/duitnow-qr.png" alt="DuitNow QR">',
  tng: "<strong>Touch 'n Go</strong><p>Transfer to <b>LEE MOU YEN</b> at <b>012 612 3540</b>.</p>",
  bank: "<strong>RHB Bank Transfer</strong><p>Account name <b>LEE MOU YEN</b><br>Account number <b>1040 2700 307120</b></p>",
  billplz: "<strong>Billplz card request</strong><p>Henry will send the payment link after submission. RM1 convenience fee applies.</p>"
};

const MALAYSIAN_BANKS = [
  "Affin Bank", "Agrobank", "Alliance Bank", "AmBank", "Bank Islam", "Bank Muamalat",
  "Bank Rakyat", "BSN", "CIMB Bank", "Hong Leong Bank", "HSBC", "Kuwait Finance House",
  "Maybank", "OCBC Bank", "Public Bank", "RHB Bank", "Standard Chartered", "UOB"
];

const NATIONALITIES = [
  "Afghan","Albanian","Algerian","American","Andorran","Angolan","Argentine","Armenian","Australian","Austrian",
  "Azerbaijani","Bahamian","Bahraini","Bangladeshi","Barbadian","Belarusian","Belgian","Belizean","Beninese","Bhutanese",
  "Bolivian","Bosnian","Botswanan","Brazilian","British","Bruneian","Bulgarian","Burkinabe","Burmese","Burundian",
  "Cambodian","Cameroonian","Canadian","Cape Verdean","Central African","Chadian","Chilean","Chinese","Colombian","Comorian",
  "Congolese","Costa Rican","Croatian","Cuban","Cypriot","Czech","Danish","Djiboutian","Dominican","Dutch",
  "East Timorese","Ecuadorean","Egyptian","Emirati","English","Equatorial Guinean","Eritrean","Estonian","Ethiopian","Fijian",
  "Filipino","Finnish","French","Gabonese","Gambian","Georgian","German","Ghanaian","Greek","Grenadian",
  "Guatemalan","Guinean","Guyanese","Haitian","Honduran","Hungarian","Icelandic","Indian","Indonesian","Iranian",
  "Iraqi","Irish","Israeli","Italian","Ivorian","Jamaican","Japanese","Jordanian","Kazakh","Kenyan",
  "Korean","Kuwaiti","Kyrgyz","Laotian","Latvian","Lebanese","Liberian","Libyan","Lithuanian","Luxembourger",
  "Macedonian","Malagasy","Malawian","Malaysian","Maldivian","Malian","Maltese","Mauritanian","Mauritian","Mexican",
  "Moldovan","Mongolian","Montenegrin","Moroccan","Mozambican","Namibian","Nepalese","New Zealander","Nicaraguan","Nigerian",
  "Norwegian","Omani","Pakistani","Palestinian","Panamanian","Papua New Guinean","Paraguayan","Peruvian","Polish","Portuguese",
  "Qatari","Romanian","Russian","Rwandan","Saudi","Scottish","Senegalese","Serbian","Sierra Leonean","Singaporean",
  "Slovak","Slovenian","Somali","South African","Spanish","Sri Lankan","Sudanese","Swedish","Swiss","Syrian",
  "Taiwanese","Tajik","Tanzanian","Thai","Togolese","Trinidadian","Tunisian","Turkish","Ugandan","Ukrainian",
  "Uruguayan","Uzbek","Venezuelan","Vietnamese","Welsh","Yemeni","Zambian","Zimbabwean"
].sort((a, b) => a.localeCompare(b));

const state = {
  step: 1,
  selectedPlan: "essential",
  policyType: "individual",
  quote: null,
  travellerSignature: ""
};

const form = document.querySelector("#applicationForm");
const insuredList = document.querySelector("#insuredList");
const nomineeList = document.querySelector("#nomineeList");
const summaryList = document.querySelector("#summaryList");
const paymentDetailBox = document.querySelector("#paymentDetailBox");

function getField(id) {
  return document.getElementById(id);
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR", minimumFractionDigits: 2 }).format(value);
}

function parseDate(value) {
  if (!value) return null;
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  let match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
  }
  match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = 2000 + Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
}

function attachDatePicker(element, options = {}) {
  if (!element || typeof window.flatpickr !== "function") return;
  if (element._flatpickr) {
    element._flatpickr.destroy();
  }
  window.flatpickr(element, {
    dateFormat: "d/m/Y",
    allowInput: true,
    disableMobile: true,
    ...options
  });
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getTravellerCounts() {
  return {
    under70: Number(getField("under70Count").value || 0),
    senior: Number(getField("seniorCount").value || 0)
  };
}

function getTotalTravellers() {
  const counts = getTravellerCounts();
  return counts.under70 + counts.senior;
}

function getSelectedArea() {
  return getField("coverageScope").value === "domestic" ? "domestic" : document.querySelector('input[name="coverageArea"]:checked').value;
}

function getTripDays() {
  const start = parseDate(getField("departureDate").value);
  if (!start) return null;
  if (getField("insuranceType").value === "annual") return 365;
  const end = parseDate(getField("returnDate").value);
  if (!end) return null;
  return Math.round((end - start) / 86400000);
}

function renderBankOptions() {
  const bank = getField("bankName");
  bank.innerHTML = `<option value="">Select bank</option>${MALAYSIAN_BANKS.map((name) => `<option value="${name}">${name}</option>`).join("")}`;
}

function nationalityOptions(selected = "Malaysian") {
  return NATIONALITIES.map((name) => `<option value="${name}" ${name === selected ? "selected" : ""}>${name}</option>`).join("");
}

function getPolicyOptions() {
  const { under70, senior } = getTravellerCounts();
  const total = under70 + senior;
  if (total <= 1) {
    return [{ value: "individual", label: "Individual", note: "Exactly one traveller." }];
  }
  if (senior > 0) {
    return [{ value: "group", label: "Group", note: "Required when any traveller is aged 71 to 85." }];
  }
  return [
    { value: "family", label: "Family", note: "Husband + wife + unlimited children." },
    { value: "group", label: "Group", note: "Minimum 2 travellers with 5% discount." }
  ];
}

function renderPolicyChoices() {
  const container = getField("policyTypeChoices");
  const options = getPolicyOptions();
  if (!options.some((option) => option.value === state.policyType)) state.policyType = options[0].value;

  container.innerHTML = options.map((option) => `
    <label class="choice">
      <input type="radio" name="policyType" value="${option.value}" ${option.value === state.policyType ? "checked" : ""}>
      <span><strong>${option.label}</strong><small>${option.note}</small></span>
    </label>
  `).join("");

  container.querySelectorAll('input[name="policyType"]').forEach((input) => {
    input.addEventListener("change", () => {
      state.policyType = input.value;
      getField("policyTypePill").textContent = `Policy type: ${input.value[0].toUpperCase()}${input.value.slice(1)}`;
      syncTravellerCards();
      refreshQuote();
    });
  });

  getField("policyTypePill").textContent = `Policy type: ${state.policyType[0].toUpperCase()}${state.policyType.slice(1)}`;
}

function renderPlanChoices() {
  const container = getField("planChoices");
  const isDomestic = getField("coverageScope").value === "domestic";
  const plans = isDomestic
    ? [{ value: "domestic", label: "Domestic", note: "Malaysia only accidents-only cover.", tag: "" }]
    : [
        { value: "basic", label: "Basic", note: "Entry tier Explorer cover.", tag: "" },
        { value: "essential", label: "Essential", note: "Recommended balance of cover.", tag: "Popular" },
        { value: "deluxe", label: "Deluxe", note: "Highest benefits and CFAR.", tag: "Best" }
      ];
  if (!plans.some((plan) => plan.value === state.selectedPlan)) state.selectedPlan = plans[0].value;
  container.innerHTML = plans.map((plan) => `
    <label class="choice">
      <input type="radio" name="selectedPlan" value="${plan.value}" ${plan.value === state.selectedPlan ? "checked" : ""}>
      <span><strong>${plan.label}</strong>${plan.tag ? `<small>${plan.tag}</small>` : `<small>${plan.note}</small>`}</span>
    </label>
  `).join("");
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
  return table[3] + Math.ceil((days - 31) / 7) * table[4];
}

function calculateQuote() {
  const days = getTripDays();
  const counts = getTravellerCounts();
  const total = counts.under70 + counts.senior;
  if (!days || total === 0) return null;

  const annual = getField("insuranceType").value === "annual";
  const scope = getField("coverageScope").value;
  const area = getSelectedArea();
  let base = 0;
  let discount = 0;
  const items = [];

  if (scope === "domestic") {
    if (state.policyType === "family") {
      base = getBracketValue(PREMIUMS.domestic.family, days, annual);
      items.push({ label: "Domestic family premium", value: base });
    } else if (state.policyType === "group") {
      base = getBracketValue(PREMIUMS.domestic.under70, days, annual) * counts.under70
        + getBracketValue(PREMIUMS.domestic.senior, days, annual) * counts.senior;
      discount = base * 0.05;
      items.push({ label: "Domestic group base", value: base });
      items.push({ label: "Group discount (5%)", value: -discount });
    } else {
      const bucket = counts.senior > 0 ? "senior" : "under70";
      base = getBracketValue(PREMIUMS.domestic[bucket], days, annual);
      items.push({ label: `Domestic ${bucket === "senior" ? "senior" : "individual"} premium`, value: base });
    }
    const premium = base - discount;
    const serviceTax = premium * 0.08;
    const taxableTotal = premium + serviceTax;
    const stampDuty = taxableTotal >= 150 ? 10 : 0;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || "duitnow";
    const cardFee = paymentMethod === "billplz" ? 1 : 0;
    return {
      area,
      days,
      total: taxableTotal + stampDuty + cardFee,
      premiumSubtotal: taxableTotal,
      stampDuty,
      cardFee,
      items: [
        ...items,
        { label: "Service tax (8%)", value: serviceTax },
        ...(stampDuty ? [{ label: "Stamp duty", value: stampDuty }] : []),
        ...(cardFee ? [{ label: "Card convenience fee", value: cardFee }] : [])
      ]
    };
  }

  const areaTable = PREMIUMS.international[area];
  if (state.policyType === "family") {
    base = getBracketValue(areaTable.family[state.selectedPlan], days, annual);
    items.push({ label: `${state.selectedPlan} family premium`, value: base });
  } else if (state.policyType === "group") {
    base = getBracketValue(areaTable.under70[state.selectedPlan], days, annual) * counts.under70
      + getBracketValue(areaTable.senior[state.selectedPlan], days, annual) * counts.senior;
    discount = base * 0.05;
    items.push({ label: "Group base premium", value: base });
    items.push({ label: "Group discount (5%)", value: -discount });
  } else {
    const bucket = counts.senior > 0 ? "senior" : "under70";
    base = getBracketValue(areaTable[bucket][state.selectedPlan], days, annual);
    items.push({ label: `${state.selectedPlan} ${bucket === "senior" ? "senior" : "individual"} premium`, value: base });
  }
  const premiumSubtotal = base - discount;
  const stampDuty = premiumSubtotal >= 150 ? 10 : 0;
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || "duitnow";
  const cardFee = paymentMethod === "billplz" ? 1 : 0;
  return {
    area,
    days,
    total: premiumSubtotal + stampDuty + cardFee,
    premiumSubtotal,
    stampDuty,
    cardFee,
    items: [
      ...items,
      ...(stampDuty ? [{ label: "Stamp duty", value: stampDuty }] : []),
      ...(cardFee ? [{ label: "Card convenience fee", value: cardFee }] : [])
    ]
  };
}

function getPaymentMethodLabel(value) {
  return {
    duitnow: "DuitNow QR",
    tng: "Touch 'n Go",
    bank: "Bank transfer",
    billplz: "Card via Billplz"
  }[value] || "-";
}

function updateStickyQuoteBar() {
  getField("stickyQuotePlan").textContent = `${state.selectedPlan[0].toUpperCase()}${state.selectedPlan.slice(1)} plan`;
  getField("stickyQuoteTravellers").textContent = `${getTotalTravellers()} traveller${getTotalTravellers() === 1 ? "" : "s"}`;
  getField("stickyQuoteTotal").textContent = formatMoney(state.quote?.total || 0);
}

function updatePaymentMethodTotals() {
  const methods = ["duitnow", "tng", "bank", "billplz"];
  const baseTotal = state.quote ? state.quote.total - (state.quote.cardFee || 0) : 0;
  methods.forEach((method) => {
    const totalNode = document.querySelector(`[data-payment-total="${method}"]`);
    if (!totalNode) return;
    if (!state.quote) {
      totalNode.textContent = "";
      return;
    }
    const total = method === "billplz" ? baseTotal + 1 : baseTotal;
    totalNode.textContent = `Pay ${formatMoney(total)}`;
  });
}

function buildTravellerCard(index, category) {
  const extraRole = state.policyType === "family" ? `
    <label class="field">
      <span>Family role</span>
      <select name="insuredRole_${index}" required>
        <option value="">Select role</option>
        <option value="Husband">Husband</option>
        <option value="Wife">Wife</option>
        <option value="Child">Child</option>
      </select>
    </label>
  ` : "";

  return `
    <article class="traveller-card ${index === 0 ? "" : "is-collapsed"}" data-traveller-card="${index}">
      <div class="card-header">
        <h5>Traveller ${index + 1}${index === 0 && !getField("buyingForSomeoneElse").checked ? " (also proposer)" : ""}</h5>
        <div class="card-header-meta">
          <span class="badge">${category === "senior" ? "Age 71-85" : "Age 30 days-70"}</span>
          <button type="button" class="toggle-card" data-toggle-traveller="${index}">${index === 0 ? "Hide" : "Edit"}</button>
        </div>
      </div>
      <div class="traveller-card-body">
      <div class="field-grid two">
        <label class="field">
          <span>Full name</span>
          <input type="text" name="insuredName_${index}" required>
        </label>
        <label class="field">
          <span>Nationality</span>
          <select name="insuredNationality_${index}" required>${nationalityOptions()}</select>
        </label>
      </div>
      <div class="field-grid two">
        <label class="field">
          <span>NRIC/Passport (Same as IC/Passport)</span>
          <input type="text" name="insuredId_${index}" data-nric-input="${index}" required>
          <small class="hint">For Malaysian NRIC, DOB and gender are filled automatically.</small>
        </label>
        <label class="field">
          <span>Date of birth</span>
          <input type="text" name="insuredDob_${index}" placeholder="DD/MM/YYYY" inputmode="numeric" required>
        </label>
      </div>
      <div class="field-grid three">
        <label class="field">
          <span>Gender</span>
          <select name="insuredGender_${index}" required>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <label class="field">
          <span>Mobile number</span>
          <input type="tel" name="insuredMobile_${index}" required>
        </label>
        <label class="field">
          <span>Email address</span>
          <input type="email" name="insuredEmail_${index}" required>
        </label>
      </div>
      <div class="field-grid ${state.policyType === "family" ? "three" : "two"}">
        <label class="field">
          <span>Occupation</span>
          <input type="text" name="insuredOccupation_${index}" required>
        </label>
        <label class="field">
          <span>Home address</span>
          <input type="text" name="insuredAddress_${index}" required>
        </label>
        ${extraRole}
      </div>
      </div>
    </article>
  `;
}

function bindTravellerCardToggles() {
  insuredList.querySelectorAll("[data-toggle-traveller]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = insuredList.querySelector(`[data-traveller-card="${button.dataset.toggleTraveller}"]`);
      if (!card) return;
      card.classList.toggle("is-collapsed");
      button.textContent = card.classList.contains("is-collapsed") ? "Edit" : "Hide";
    });
  });
}

function attachTravellerEnhancements() {
  insuredList.querySelectorAll("[data-nric-input]").forEach((input) => {
    input.addEventListener("input", () => {
      const index = input.dataset.nricInput;
      const digits = input.value.replace(/\D/g, "");
      const dobField = form.elements[`insuredDob_${index}`];
      const genderField = form.elements[`insuredGender_${index}`];
      if (digits.length >= 6) {
        const yy = Number(digits.slice(0, 2));
        const mm = Number(digits.slice(2, 4));
        const dd = Number(digits.slice(4, 6));
        const currentYear = new Date().getFullYear() % 100;
        const fullYear = yy > currentYear ? 1900 + yy : 2000 + yy;
        const date = new Date(fullYear, mm - 1, dd);
        if (date.getFullYear() === fullYear && date.getMonth() === mm - 1 && date.getDate() === dd) {
          if (dobField?._flatpickr) {
            dobField._flatpickr.setDate(date, true, "d/m/Y");
          } else {
            dobField.value = formatDate(date);
          }
        }
      }
      if (digits.length >= 1) {
        const last = Number(digits.slice(-1));
        if (!Number.isNaN(last)) genderField.value = last % 2 === 0 ? "Female" : "Male";
      }
    });
  });

  insuredList.querySelectorAll('input[name^="insuredDob_"]').forEach((input) => {
    attachDatePicker(input, {
      dateFormat: "d/m/Y"
    });
  });
}

function syncTravellerCards() {
  const counts = getTravellerCounts();
  const travellers = [...Array.from({ length: counts.under70 }, () => "under70"), ...Array.from({ length: counts.senior }, () => "senior")];
  const signature = `${travellers.join("|")}:${state.policyType}:${getField("buyingForSomeoneElse").checked}`;
  getField("travellerSummaryText").textContent = `${travellers.length} traveller${travellers.length === 1 ? "" : "s"} to complete.`;
  if (signature === state.travellerSignature) return;
  state.travellerSignature = signature;
  insuredList.innerHTML = travellers.map((type, index) => buildTravellerCard(index, type)).join("");
  attachTravellerEnhancements();
  bindTravellerCardToggles();
  insuredList.querySelectorAll("input, select").forEach((field) => {
    field.addEventListener("input", populateSummary);
    field.addEventListener("change", populateSummary);
  });
}

function collectTravellers() {
  return Array.from(insuredList.querySelectorAll("[data-traveller-card]")).map((_, index) => ({
    category: form.elements[`insuredRole_${index}`] ? (form.elements[`insuredRole_${index}`].value || "") : "",
    ageBand: document.querySelectorAll("[data-traveller-card] .badge")[index].textContent,
    fullName: form.elements[`insuredName_${index}`].value.trim(),
    nationality: form.elements[`insuredNationality_${index}`].value,
    idNumber: form.elements[`insuredId_${index}`].value.trim(),
    dateOfBirth: form.elements[`insuredDob_${index}`].value,
    gender: form.elements[`insuredGender_${index}`].value,
    mobile: form.elements[`insuredMobile_${index}`].value.trim(),
    email: form.elements[`insuredEmail_${index}`].value.trim(),
    occupation: form.elements[`insuredOccupation_${index}`].value.trim(),
    address: form.elements[`insuredAddress_${index}`].value.trim()
  }));
}

function buildNomineeCard(index) {
  return `
    <article class="traveller-card" data-nominee-card="${index}">
      <div class="card-header">
        <h5>Nominee ${index + 1}</h5>
        ${index === 0 ? "" : `<button type="button" class="button button-secondary" data-remove-nominee="${index}">Remove</button>`}
      </div>
      <div class="field-grid two">
        <label class="field">
          <span>Nominee full name</span>
          <input type="text" name="nomineeName_${index}" required>
        </label>
        <label class="field">
          <span>Relationship</span>
          <select name="nomineeRelationship_${index}" required>
            <option value="">Select relationship</option>
            <option value="Child">Child</option>
            <option value="Parent">Parent</option>
            <option value="Sibling">Sibling</option>
            <option value="Spouse">Spouse</option>
          </select>
        </label>
      </div>
      <div class="field-grid three">
        <label class="field">
          <span>NRIC/Passport (Same as IC/Passport)</span>
          <input type="text" name="nomineeId_${index}" required>
        </label>
        <label class="field">
          <span>Contact number</span>
          <input type="tel" name="nomineeContact_${index}" required>
        </label>
        <label class="field">
          <span>Allocation (%)</span>
          <input type="number" name="nomineeShare_${index}" min="1" max="100" value="">
        </label>
      </div>
    </article>
  `;
}

function collectNominees() {
  return Array.from(nomineeList.querySelectorAll("[data-nominee-card]")).map((_, index) => ({
    name: form.elements[`nomineeName_${index}`]?.value.trim() || "",
    relationship: form.elements[`nomineeRelationship_${index}`]?.value || "",
    idNumber: form.elements[`nomineeId_${index}`]?.value.trim() || "",
    contact: form.elements[`nomineeContact_${index}`]?.value.trim() || "",
    share: Number(form.elements[`nomineeShare_${index}`]?.value || 0)
  }));
}

function getNomineeDrafts() {
  return Array.from(nomineeList.querySelectorAll("[data-nominee-card]")).map((_, index) => ({
    name: form.elements[`nomineeName_${index}`]?.value || "",
    relationship: form.elements[`nomineeRelationship_${index}`]?.value || "",
    idNumber: form.elements[`nomineeId_${index}`]?.value || "",
    contact: form.elements[`nomineeContact_${index}`]?.value || "",
    share: form.elements[`nomineeShare_${index}`]?.value || ""
  }));
}

function bindNomineeActions() {
  nomineeList.querySelectorAll("[data-remove-nominee]").forEach((button) => {
    button.addEventListener("click", () => {
      const drafts = getNomineeDrafts();
      if (drafts.length <= 1) return;
      drafts.splice(Number(button.dataset.removeNominee), 1);
      renderNominees(drafts);
    });
  });
  nomineeList.querySelectorAll("input, select").forEach((field) => {
    field.addEventListener("input", populateSummary);
    field.addEventListener("change", populateSummary);
  });
}

function renderNominees(drafts = [{ name: "", relationship: "", idNumber: "", contact: "", share: "" }]) {
  nomineeList.innerHTML = drafts.map((_, index) => buildNomineeCard(index)).join("");
  drafts.forEach((draft, index) => {
    if (form.elements[`nomineeName_${index}`]) {
      form.elements[`nomineeName_${index}`].value = draft.name;
      form.elements[`nomineeRelationship_${index}`].value = draft.relationship;
      form.elements[`nomineeId_${index}`].value = draft.idNumber;
      form.elements[`nomineeContact_${index}`].value = draft.contact;
      form.elements[`nomineeShare_${index}`].value = draft.share;
    }
  });
  bindNomineeActions();
}

function getProposerData(travellers) {
  if (!getField("buyingForSomeoneElse").checked) {
    const first = travellers[0] || {};
    return {
      name: first.fullName || "",
      mobile: first.mobile || "",
      email: first.email || "",
      occupation: first.occupation || "",
      address: first.address || "",
      sameAsFirstTraveller: true
    };
  }
  return {
    name: getField("proposerName").value.trim(),
    mobile: getField("proposerMobile").value.trim(),
    email: getField("proposerEmail").value.trim(),
    occupation: getField("proposerOccupation").value.trim(),
    address: getField("proposerAddress").value.trim(),
    sameAsFirstTraveller: false
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
    updateStickyQuoteBar();
    updatePaymentMethodTotals();
    return;
  }
  getField("quoteTotal").textContent = formatMoney(quote.total);
  getField("quoteNote").textContent = `${quote.days} day${quote.days > 1 ? "s" : ""} • ${AREA_LABELS[quote.area]} • ${state.policyType}`;
  breakdown.innerHTML = quote.items.map((item) => `<div><dt>${item.label}</dt><dd>${item.value < 0 ? "-" : ""}${formatMoney(Math.abs(item.value))}</dd></div>`).join("");
  updateStickyQuoteBar();
  updatePaymentMethodTotals();
  populateSummary();
}

function populateSummary() {
  if (!state.quote) return;
  const travellers = collectTravellers();
  const proposer = getProposerData(travellers);
  const returnDate = getField("insuranceType").value === "annual"
    ? formatDate(addDays(parseDate(getField("departureDate").value), 365))
    : getField("returnDate").value;

  summaryList.innerHTML = `
    <div><dt>Insurance type</dt><dd>${getField("insuranceType").value === "annual" ? "Annual" : "Single trip"}</dd></div>
    <div><dt>Coverage area</dt><dd>${AREA_LABELS[state.quote.area]}</dd></div>
    <div><dt>Policy type</dt><dd>${state.policyType}</dd></div>
    <div><dt>Plan</dt><dd>${state.selectedPlan}</dd></div>
    <div><dt>Travellers</dt><dd>${getTotalTravellers()}</dd></div>
    <div><dt>Travel dates</dt><dd>${getField("departureDate").value} to ${returnDate}</dd></div>
    <div><dt>Destination</dt><dd>${getField("coverageScope").value === "domestic" ? "Malaysia" : getField("destination").value.trim() || "-"}</dd></div>
    <div><dt>Proposer</dt><dd>${proposer.name || "-"}</dd></div>
    <div><dt>Nomination total</dt><dd>${collectNominees().reduce((sum, nominee) => sum + nominee.share, 0)}%</dd></div>
    <div><dt>Payment method</dt><dd>${getPaymentMethodLabel(document.querySelector('input[name="paymentMethod"]:checked')?.value || "")}</dd></div>
  `;
  getField("summaryTotal").textContent = formatMoney(state.quote.total);
  updateStickyQuoteBar();
}

function setPaymentContent() {
  paymentDetailBox.innerHTML = PAYMENT_CONTENT[document.querySelector('input[name="paymentMethod"]:checked').value];
  populateSummary();
}

function showError(id, message) {
  const el = document.querySelector(`[data-error-for="${id}"]`);
  if (el) el.textContent = message;
}

function clearError(id) {
  showError(id, "");
}

function validateFamilyRoles(travellers) {
  if (state.policyType !== "family") return true;
  const roles = travellers.map((traveller) => traveller.category);
  const husbands = roles.filter((role) => role === "Husband").length;
  const wives = roles.filter((role) => role === "Wife").length;
  const others = roles.filter((role) => !["Husband", "Wife", "Child"].includes(role)).length;
  return husbands === 1 && wives === 1 && others === 0;
}

function validateStep(step) {
  let valid = true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const departureDate = parseDate(getField("departureDate").value);
  const returnDate = parseDate(getField("returnDate").value);
  const total = getTotalTravellers();

  if (step === 1) {
    ["departureDate", "returnDate", "destination", "policyType", "selectedPlan"].forEach(clearError);
    if (!departureDate) {
      showError("departureDate", "Select a departure or policy start date.");
      valid = false;
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
      if (getField("insuranceType").value === "annual") {
        const sixMonths = new Date(today);
        sixMonths.setMonth(sixMonths.getMonth() + 6);
        if (departureDate > sixMonths) {
          showError("departureDate", "Annual plan cannot be issued more than 6 months in advance.");
          valid = false;
        }
      }
    }
    if (getField("insuranceType").value === "single") {
      const days = getTripDays();
      if (!returnDate || !departureDate || returnDate <= departureDate) {
        showError("returnDate", "Return date must be after departure date.");
        valid = false;
      } else if (days > 180) {
        showError("returnDate", "Single trip maximum cover is 180 days.");
        valid = false;
      }
    }
    if (getField("coverageScope").value !== "domestic" && !getField("destination").value.trim()) {
      showError("destination", "Destination is required.");
      valid = false;
    }
    if (total === 0 || total > 20) {
      showError("policyType", "Traveller count must be between 1 and 20.");
      valid = false;
    }
    if (!state.quote) {
      showError("selectedPlan", "Quote could not be calculated.");
      valid = false;
    }
  }

  if (step === 2) {
    ["proposerName", "proposerMobile", "proposerEmail", "proposerOccupation", "proposerAddress", "bankName", "bankAccountNumber", "bankAccountType", "nominees", "selectedPlan"].forEach(clearError);
    const travellers = collectTravellers();
    travellers.forEach((traveller) => {
      if (!traveller.fullName || !traveller.nationality || !traveller.idNumber || !traveller.dateOfBirth || !traveller.gender || !traveller.mobile || !traveller.email || !traveller.occupation || !traveller.address) valid = false;
      if (state.policyType === "family" && !traveller.category) valid = false;
    });
    if (!validateFamilyRoles(travellers)) {
      showError("selectedPlan", "Family must contain exactly one Husband, one Wife and any number of Children.");
      valid = false;
    }
    if (getField("buyingForSomeoneElse").checked) {
      ["proposerName", "proposerMobile", "proposerEmail", "proposerOccupation", "proposerAddress"].forEach((id) => {
        if (!getField(id).value.trim()) {
          showError(id, "This field is required.");
          valid = false;
        }
      });
    }
    const nominees = collectNominees().filter((nominee) =>
      nominee.name || nominee.relationship || nominee.idNumber || nominee.contact || nominee.share
    );
    const shareTotal = nominees.reduce((sum, nominee) => sum + nominee.share, 0);
    nominees.forEach((nominee) => {
      if (!nominee.name || !nominee.relationship || !nominee.idNumber || !nominee.contact || !nominee.share) valid = false;
    });
    if (nominees.length > 0 && shareTotal !== 100) {
      showError("nominees", "Nominee allocation must total exactly 100%.");
      valid = false;
    }
  }

  if (step === 3) {
    clearError("paymentSlip");
    clearError("consent");
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    if (!getField("consent").checked) {
      showError("consent", "Consent is required before submit.");
      valid = false;
    }
  }

  return valid;
}

function goToStep(step) {
  state.step = step;
  document.querySelectorAll(".form-step").forEach((panel) => panel.classList.toggle("is-active", Number(panel.dataset.stepPanel) === step));
  document.querySelectorAll(".stepper .step").forEach((item) => {
    const itemStep = Number(item.dataset.step);
    item.classList.toggle("is-active", itemStep === step);
    item.classList.toggle("is-complete", itemStep < step);
  });
  window.scrollTo({ top: document.querySelector("#application").offsetTop - 30, behavior: "smooth" });
}

async function submitForm(event) {
  event.preventDefault();
  if (!validateStep(3)) return;

  const submitButton = getField("submitButton");
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  const travellers = collectTravellers();
  const proposer = getProposerData(travellers);
  const departureDate = getField("departureDate").value;
  const finalReturnDate = getField("insuranceType").value === "annual"
    ? formatDate(addDays(parseDate(departureDate), 365))
    : getField("returnDate").value;

  const payload = {
    quote: state.quote,
    product: {
      insuranceType: getField("insuranceType").value,
      coverageScope: getField("coverageScope").value,
      coverageArea: getSelectedArea(),
      policyType: state.policyType,
      selectedPlan: state.selectedPlan,
      departureDate,
      returnDate: finalReturnDate,
      destination: getField("destination").value.trim()
    },
    counts: getTravellerCounts(),
    proposer: {
      ...proposer,
      bankName: getField("bankName").value,
      bankAccountNumber: getField("bankAccountNumber").value.trim(),
      bankAccountType: getField("bankAccountType").value
    },
    insuredTravellers: travellers,
    nominees: collectNominees().filter((nominee) =>
      nominee.name || nominee.relationship || nominee.idNumber || nominee.contact || nominee.share
    ),
    paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value
  };

  const body = new FormData();
  body.append("submission", JSON.stringify(payload));
  const slip = getField("paymentSlip").files[0];
  if (slip) body.append("paymentSlip", slip);

  try {
    const response = await fetch("/api/submit", { method: "POST", body });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Submission failed.");
    form.hidden = true;
    getField("successCard").hidden = false;
  } catch (error) {
    showError("consent", error.message);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit application";
  }
}

function refreshVisibility() {
  const isDomestic = getField("coverageScope").value === "domestic";
  const isAnnual = getField("insuranceType").value === "annual";
  getField("areaField").hidden = isDomestic;
  getField("destinationField").hidden = isDomestic;
  getField("returnField").hidden = isAnnual;
  getField("departureLabel").textContent = isAnnual ? "Policy start date" : "Departure date";
  getField("proposerSection").hidden = !getField("buyingForSomeoneElse").checked;
  renderPlanChoices();
  renderPolicyChoices();
  syncTravellerCards();
  refreshQuote();
}

function resetForm() {
  form.reset();
  state.selectedPlan = "essential";
  state.policyType = "individual";
  state.travellerSignature = "";
  getField("under70Count").value = 1;
  getField("seniorCount").value = 0;
  getField("successCard").hidden = true;
  form.hidden = false;
  renderBankOptions();
  renderNominees();
  refreshVisibility();
  setPaymentContent();
  goToStep(1);
}

function initMinDates() {
  const today = new Date();

  attachDatePicker(getField("departureDate"), {
    minDate: today,
    onChange: ([selectedDate]) => {
      const returnField = getField("returnDate");
      if (returnField?._flatpickr) {
        returnField._flatpickr.set("minDate", selectedDate || today);
      }
      if (getField("insuranceType").value === "annual" && selectedDate) {
        returnField.value = formatDate(addDays(selectedDate, 365));
      }
      refreshQuote();
    }
  });

  attachDatePicker(getField("returnDate"), {
    minDate: today,
    onChange: () => refreshQuote()
  });

  getField("departureDate").addEventListener("input", refreshQuote);
  getField("returnDate").addEventListener("input", refreshQuote);
}

document.querySelectorAll("[data-counter]").forEach((button) => {
  button.addEventListener("click", () => {
    const field = button.dataset.counter === "under70" ? getField("under70Count") : getField("seniorCount");
    const next = Math.max(0, Math.min(20, Number(field.value || 0) + Number(button.dataset.delta)));
    field.value = String(next);
    state.travellerSignature = "";
    refreshVisibility();
  });
});

["under70Count", "seniorCount"].forEach((id) => {
  getField(id).addEventListener("change", () => {
    state.travellerSignature = "";
    refreshVisibility();
  });
});

["insuranceType", "coverageScope"].forEach((id) => {
  getField(id).addEventListener("change", refreshVisibility);
});

document.querySelectorAll('input[name="coverageArea"]').forEach((input) => input.addEventListener("change", refreshQuote));
document.querySelectorAll('input[name="paymentMethod"]').forEach((input) => input.addEventListener("change", setPaymentContent));
document.querySelectorAll('input[name="paymentMethod"]').forEach((input) => input.addEventListener("change", refreshQuote));
getField("destination").addEventListener("input", populateSummary);
getField("buyingForSomeoneElse").addEventListener("change", () => {
  state.travellerSignature = "";
  refreshVisibility();
});
getField("addNomineeButton").addEventListener("click", () => {
  const drafts = getNomineeDrafts();
  drafts.push({ name: "", relationship: "", idNumber: "", contact: "", share: drafts.length === 0 ? 100 : "" });
  renderNominees(drafts);
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

getField("startNewButton").addEventListener("click", resetForm);
form.addEventListener("submit", submitForm);

renderBankOptions();
initMinDates();
refreshVisibility();
renderNominees();
setPaymentContent();
