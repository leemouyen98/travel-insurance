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

const AREA_GUIDANCE = {
  area1: {
    title: "Area 1",
    summary: "Best for Asia-Pacific trips.",
    detail: "Australia, Bangladesh, Brunei, Cambodia, China, Hong Kong, India, Indonesia, Japan, Korea, Laos, Macau, Maldives, Myanmar, New Zealand, Pakistan, Philippines, Singapore, Sri Lanka, Taiwan, Thailand and Vietnam."
  },
  area2: {
    title: "Area 2",
    summary: "Worldwide cover excluding a few higher-risk destinations.",
    detail: "Worldwide excluding Malaysia, USA, Canada, Nepal and Tibet."
  },
  area3: {
    title: "Area 3",
    summary: "Worldwide cover including USA and Canada.",
    detail: "Worldwide excluding Malaysia."
  },
  domestic: {
    title: "Domestic",
    summary: "For travel within Malaysia.",
    detail: "Within Malaysia."
  }
};

const PLAN_GUIDANCE = {
  basic: {
    title: "Basic Plan",
    summary: "A lower-premium option for travellers who want core Explorer protection.",
    bullets: ["Lower starting premium", "Core medical and travel inconvenience benefits", "No lounge access or CFAR"]
  },
  essential: {
    title: "Essential Plan",
    summary: "The easiest recommendation for most clients because it balances price and protection well.",
    bullets: ["Most popular option", "Includes lounge access on qualifying delays", "Higher limits than Basic"]
  },
  deluxe: {
    title: "Deluxe Plan",
    summary: "Best for clients who want the strongest cover and the most flexibility before departure.",
    bullets: ["Highest protection level", "Includes lounge access", "Includes CFAR, subject to policy wording"]
  },
  domestic: {
    title: "Domestic",
    summary: "For Malaysia-only trips with domestic cover logic and pricing.",
    bullets: ["For travel within Malaysia", "Domestic rating applies", "Medical illness cover does not apply like international plans"]
  }
};

const PLAN_COMPARE = {
  basic: {
    title: "Basic Plan",
    price: "From RM47",
    suffix: "/ pax",
    tag: "",
    rows: [
      ["Accidental Death", "RM350k"],
      ["Medical Expenses", "RM750k"],
      ["Emergency Evacuation", "RM1M"],
      ["Travel Inconvenience", "RM5k"],
      ["Personal Liability", "RM1M"],
      ["Lounge Access", "x"],
      ["CFAR", "x"]
    ]
  },
  essential: {
    title: "Essential Plan",
    price: "From RM58",
    suffix: "/ pax",
    tag: "Popular",
    rows: [
      ["Accidental Death", "RM550k"],
      ["Medical Expenses", "RM1M"],
      ["Emergency Evacuation", "Unlimited"],
      ["Travel Inconvenience", "RM10k"],
      ["Personal Liability", "RM1.5M"],
      ["Lounge Access", "Yes"],
      ["CFAR", "x"]
    ]
  },
  deluxe: {
    title: "Deluxe Plan",
    price: "From RM86",
    suffix: "/ pax",
    tag: "",
    rows: [
      ["Accidental Death", "RM550k"],
      ["Medical Expenses", "RM1M"],
      ["Emergency Evacuation", "Unlimited"],
      ["Travel Inconvenience", "RM10k"],
      ["Personal Liability", "RM1.5M"],
      ["Lounge Access", "Yes"],
      ["CFAR (up to RM5k)", "Yes"]
    ]
  },
  domestic: {
    title: "Domestic",
    price: "Malaysia Only",
    suffix: "",
    tag: "",
    rows: [
      ["Coverage Scope", "Domestic Travel"],
      ["Accident Cover", "Included"],
      ["Medical Illness Cover", "Not Included"],
      ["Travel Inconvenience", "Included"],
      ["Personal Liability", "Included"],
      ["Lounge Access", "x"],
      ["CFAR", "x"]
    ]
  }
};

const PAYMENT_CONTENT = {
  duitnow: '<strong>DuitNow QR</strong><p>Scan Henry\'s QR and upload the payment screenshot before submit. Henry can verify and follow up faster when the slip is included.</p><img src="/duitnow-qr.png" alt="DuitNow QR">',
  tng: "<strong>Touch 'n Go</strong><p>Transfer to <b>LEE MOU YEN</b> at <b>012 612 3540</b>. Upload the payment screenshot once done.</p>",
  bank: "<strong>RHB Bank Transfer</strong><p>Account name <b>LEE MOU YEN</b><br>Account number <b>1040 2700 307120</b><br>Include the payment slip to speed up follow-up.</p>",
  billplz: "<strong>Billplz card request</strong><p>Henry will send the payment link after submission. A 1.8% card processing fee applies and no payment slip is needed at this stage.</p>"
};

const BILLPLZ_CARD_FEE_RATE = 0.018;

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
const flightList = document.querySelector("#flightList");
const nomineeList = document.querySelector("#nomineeList");
const summaryList = document.querySelector("#summaryList");
const paymentDetailBox = document.querySelector("#paymentDetailBox");
const marketingPlanCards = document.querySelector("#marketingPlanCards");
const coverageSelectedTitle = document.querySelector("#coverageSelectedTitle");
const coverageSelectedText = document.querySelector("#coverageSelectedText");
const logicAlert = document.querySelector("#logicAlert");

function getField(id) {
  return document.getElementById(id);
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR", minimumFractionDigits: 2 }).format(value);
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function getBillplzCardFee(baseTotal) {
  return roundMoney(baseTotal * BILLPLZ_CARD_FEE_RATE);
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

function syncTravelDateInput() {
  const input = getField("travelDates");
  if (!input) return;
  const departureDate = getField("departureDate").value;
  const returnDate = getField("returnDate").value;
  if (getField("insuranceType").value === "annual") {
    input.value = departureDate;
    return;
  }
  if (departureDate && returnDate) {
    input.value = `${departureDate} to ${returnDate}`;
    return;
  }
  if (departureDate) {
    input.value = `${departureDate} to `;
    return;
  }
  input.value = "";
}

function setTravelDates(departureDate = "", returnDate = "") {
  getField("departureDate").value = departureDate;
  getField("returnDate").value = returnDate;
  syncTravelDateInput();
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
  return document.querySelector('input[name="travelArea"]:checked')?.value || "area1";
}

function getTripDays() {
  const start = parseDate(getField("departureDate").value);
  if (!start) return null;
  if (getField("insuranceType").value === "annual") return 365;
  const end = parseDate(getField("returnDate").value);
  if (!end) return null;
  return Math.round((end - start) / 86400000);
}

function bankOptionsMarkup(selected = "") {
  return `<option value="">Select bank</option>${MALAYSIAN_BANKS.map((name) => `<option value="${name}" ${name === selected ? "selected" : ""}>${name}</option>`).join("")}`;
}

function getTravellerDisplayNames() {
  return Array.from(insuredList.querySelectorAll("[data-traveller-card]")).map((_, index) => {
    const name = form.elements[`insuredName_${index}`]?.value.trim();
    return name || `Traveller ${index + 1}`;
  });
}

function getBankTargetCount(currentCount = 0) {
  const travellerTotal = getTotalTravellers();
  if (travellerTotal > 1) return Math.max(travellerTotal, currentCount, 1);
  return Math.max(currentCount, 1);
}

function buildBankDraftList(existingDrafts = []) {
  const targetCount = getBankTargetCount(existingDrafts.length);
  return Array.from({ length: targetCount }, (_, index) => existingDrafts[index] || {
    bankName: "",
    bankAccountNumber: "",
    bankAccountType: "Savings"
  });
}

function buildBankCard(index) {
  const travellerNames = getTravellerDisplayNames();
  const multipleTravellers = travellerNames.length > 1;
  const cardTitle = multipleTravellers
    ? `#${index + 1} ${travellerNames[index] || `Traveller ${index + 1}`}'s Bank`
    : "Bank Details";
  return `
    <article class="traveller-card" data-bank-card="${index}">
      <div class="card-header">
        <h5>${cardTitle}</h5>
      </div>
      <div class="field-grid three">
        <label class="field">
          <span>Bank Name (For Claim Purpose)</span>
          <select name="bankName_${index}">${bankOptionsMarkup()}</select>
        </label>
        <label class="field">
          <span>Account Number</span>
          <input type="text" name="bankAccountNumber_${index}">
        </label>
        <label class="field">
          <span>Account Type</span>
          <select name="bankAccountType_${index}">
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
          </select>
        </label>
      </div>
    </article>
  `;
}

function collectBankDetails() {
  return Array.from(getField("bankList").querySelectorAll("[data-bank-card]")).map((_, index) => ({
    travellerName: getTravellerDisplayNames()[index] || `Traveller ${index + 1}`,
    bankName: form.elements[`bankName_${index}`]?.value || "",
    bankAccountNumber: form.elements[`bankAccountNumber_${index}`]?.value.trim() || "",
    bankAccountType: form.elements[`bankAccountType_${index}`]?.value || "Savings"
  }));
}

function getBankDrafts() {
  return Array.from(getField("bankList").querySelectorAll("[data-bank-card]")).map((_, index) => ({
    bankName: form.elements[`bankName_${index}`]?.value || "",
    bankAccountNumber: form.elements[`bankAccountNumber_${index}`]?.value || "",
    bankAccountType: form.elements[`bankAccountType_${index}`]?.value || "Savings"
  }));
}

function bindBankActions() {
  getField("bankList").querySelectorAll("input, select").forEach((field) => {
    field.addEventListener("input", populateSummary);
    field.addEventListener("change", populateSummary);
  });
}

function renderBankDetails(drafts = [{ bankName: "", bankAccountNumber: "", bankAccountType: "Savings" }]) {
  const nextDrafts = buildBankDraftList(drafts);
  getField("bankList").innerHTML = nextDrafts.map((_, index) => buildBankCard(index)).join("");
  nextDrafts.forEach((draft, index) => {
    if (form.elements[`bankName_${index}`]) {
      form.elements[`bankName_${index}`].value = draft.bankName || "";
      form.elements[`bankAccountNumber_${index}`].value = draft.bankAccountNumber || "";
      form.elements[`bankAccountType_${index}`].value = draft.bankAccountType || "Savings";
    }
  });
  bindBankActions();
}

function getNomineeTargetCount(currentCount = 0) {
  return Math.max(currentCount, 1);
}

function buildNomineeDraftList(existingDrafts = []) {
  const targetCount = getNomineeTargetCount(existingDrafts.length);
  return Array.from({ length: targetCount }, (_, index) => existingDrafts[index] || {
    travellerIndex: "0",
    name: "",
    relationship: "",
    idNumber: "",
    contact: "",
    share: ""
  });
}

function renderAreaGuidance() {
  const data = AREA_GUIDANCE[getSelectedArea()];
  const node = getField("areaGuidance");
  if (!data || !node) return;
  node.innerHTML = `
    <strong>${data.title}</strong>
    <p>${data.summary}</p>
    <small>${data.detail}</small>
  `;
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
      getField("policyTypePill").textContent = `Policy Type: ${input.value[0].toUpperCase()}${input.value.slice(1)}`;
      syncTravellerCards();
      refreshQuote();
    });
  });

  getField("policyTypePill").textContent = `Policy Type: ${state.policyType[0].toUpperCase()}${state.policyType.slice(1)}`;
}

function renderPlanChoices() {
  const container = getField("planChoices");
  const isDomestic = getSelectedArea() === "domestic";
  const plans = isDomestic
    ? [{ value: "domestic", label: "Domestic", note: "Malaysia only accidents-only cover.", tag: "" }]
    : [
        { value: "basic", label: "Basic", note: "Entry tier Explorer cover.", tag: "" },
        { value: "essential", label: "Essential", note: "Recommended balance of cover.", tag: "Popular" },
        { value: "deluxe", label: "Deluxe", note: "Highest benefits and CFAR.", tag: "Best" }
      ];
  if (!plans.some((plan) => plan.value === state.selectedPlan)) {
    state.selectedPlan = isDomestic ? "domestic" : "essential";
  }
  container.innerHTML = plans.map((plan) => `
    <label class="choice">
      <input type="radio" name="selectedPlan" value="${plan.value}" ${plan.value === state.selectedPlan ? "checked" : ""}>
      <span><strong>${plan.label}</strong>${plan.tag ? `<small>${plan.tag}</small>` : `<small>${plan.note}</small>`}</span>
    </label>
  `).join("");
  container.querySelectorAll('input[name="selectedPlan"]').forEach((input) => {
    input.addEventListener("change", () => {
      state.selectedPlan = input.value;
      renderPlanGuidance();
      renderMarketingPlanCards();
      refreshQuote();
    });
  });
  renderPlanGuidance();
}

function renderPlanGuidance() {
  const data = PLAN_GUIDANCE[state.selectedPlan];
  const node = getField("planGuidance");
  if (!data || !node) return;
  node.innerHTML = `
    <strong>${data.title}</strong>
    <p>${data.summary}</p>
    <ul>
      ${data.bullets.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  `;
}

function renderMarketingPlanCards() {
  if (!marketingPlanCards) return;
  if (coverageSelectedTitle && coverageSelectedText) {
    const selectedPlan = PLAN_GUIDANCE[state.selectedPlan];
    coverageSelectedTitle.textContent = selectedPlan?.title || "Essential";
    coverageSelectedText.textContent = selectedPlan?.summary || "";
  }
  marketingPlanCards.querySelectorAll("[data-marketing-plan]").forEach((card) => {
    const selected = card.dataset.marketingPlan === state.selectedPlan;
    card.classList.toggle("is-selected", selected);
    card.setAttribute("aria-selected", selected ? "true" : "false");
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
  const area = getSelectedArea();
  let base = 0;
  let discount = 0;
  const items = [];

  if (area === "domestic") {
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
    const cardFee = paymentMethod === "billplz" ? getBillplzCardFee(taxableTotal + stampDuty) : 0;
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
  const cardFee = paymentMethod === "billplz" ? getBillplzCardFee(premiumSubtotal + stampDuty) : 0;
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

function openOptionalSection(sectionId) {
  const body = getField(sectionId);
  const toggle = document.querySelector(`[data-toggle-optional="${sectionId}"]`);
  if (!body || !toggle) return;
  body.hidden = false;
  toggle.setAttribute("aria-expanded", "true");
  toggle.querySelector("em").textContent = "Hide";
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
    const total = method === "billplz" ? baseTotal + getBillplzCardFee(baseTotal) : baseTotal;
    totalNode.textContent = `Pay ${formatMoney(total)}`;
  });
}

function buildTravellerCard(index, category) {
  const extraRole = state.policyType === "family" ? `
    <label class="field">
      <span>Family role *</span>
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
          <span>Full name *</span>
          <input type="text" name="insuredName_${index}" required>
        </label>
        <label class="field">
          <span>Nationality *</span>
          <select name="insuredNationality_${index}" required>${nationalityOptions()}</select>
        </label>
      </div>
      <div class="field-grid two">
        <label class="field">
          <span>NRIC/Passport (Same as IC/Passport) *</span>
          <input type="text" name="insuredId_${index}" data-nric-input="${index}" required>
          <small class="hint">For Malaysian NRIC, DOB and gender are filled automatically.</small>
        </label>
        <label class="field">
          <span>Date of birth *</span>
          <input type="text" name="insuredDob_${index}" placeholder="YY/MM/DD" inputmode="numeric" required>
        </label>
      </div>
      <div class="field-grid three">
        <label class="field">
          <span>Gender *</span>
          <select name="insuredGender_${index}" required>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <label class="field">
          <span>Mobile number *</span>
          <input type="tel" name="insuredMobile_${index}" required>
        </label>
        <label class="field">
          <span>Email address *</span>
          <input type="email" name="insuredEmail_${index}" required>
        </label>
      </div>
      <div class="field-grid ${state.policyType === "family" ? "three" : "two"}">
        <label class="field">
          <span>Occupation *</span>
          <input type="text" name="insuredOccupation_${index}" required>
        </label>
        <label class="field">
          <span>Home address *</span>
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
            dobField._flatpickr.setDate(date, true, "Y/m/d");
          } else {
            dobField.value = `${String(fullYear).slice(-2)}/${String(mm).padStart(2, "0")}/${String(dd).padStart(2, "0")}`;
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
      dateFormat: "Y/m/d"
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
    field.addEventListener("input", () => {
      renderBankDetails(getBankDrafts());
      renderNominees(getNomineeDrafts());
    });
    field.addEventListener("change", () => {
      renderBankDetails(getBankDrafts());
      renderNominees(getNomineeDrafts());
    });
  });
  renderBankDetails(getBankDrafts());
  renderNominees(getNomineeDrafts());
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
  const travellerNames = getTravellerDisplayNames();
  const cardTitle = `Nominee ${index + 1}`;
  return `
    <article class="traveller-card" data-nominee-card="${index}">
      <div class="card-header">
        <h5>${cardTitle}</h5>
        ${index === 0 ? "" : `<button type="button" class="button button-secondary" data-remove-nominee="${index}">Remove</button>`}
      </div>
      <div class="field-grid two">
        <label class="field">
          <span>Traveller *</span>
          <select name="nomineeTraveller_${index}" required>
            ${travellerNames.map((name, travellerIndex) => `<option value="${travellerIndex}">#${travellerIndex + 1} ${name}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>Nominee full name *</span>
          <input type="text" name="nomineeName_${index}" required>
        </label>
      </div>
      <div class="field-grid two">
        <label class="field">
          <span>Relationship *</span>
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
          <span>NRIC/Passport (Same as IC/Passport) *</span>
          <input type="text" name="nomineeId_${index}" required>
        </label>
        <label class="field">
          <span>Contact number *</span>
          <input type="tel" name="nomineeContact_${index}" required>
        </label>
        <label class="field">
          <span>Allocation (%) *</span>
          <input type="number" name="nomineeShare_${index}" min="1" max="100" value="" required>
        </label>
      </div>
    </article>
  `;
}

function buildFlightCard(index) {
  return `
    <article class="traveller-card" data-flight-card="${index}">
      <div class="card-header">
        <h5>Flight ${index + 1}</h5>
        ${index === 0 ? "" : `<button type="button" class="button button-secondary" data-remove-flight="${index}">Remove</button>`}
      </div>
      <div class="field-grid two">
        <label class="field">
          <span>Departure flight number</span>
          <input type="text" name="departureFlightNumber_${index}">
        </label>
        <label class="field">
          <span>Departure date</span>
          <input type="text" name="departureFlightDate_${index}" placeholder="DD/MM/YYYY" inputmode="numeric">
        </label>
      </div>
      <div class="field-grid two">
        <label class="field">
          <span>Arrival flight number</span>
          <input type="text" name="arrivalFlightNumber_${index}">
        </label>
        <label class="field">
          <span>Arrival date</span>
          <input type="text" name="arrivalFlightDate_${index}" placeholder="DD/MM/YYYY" inputmode="numeric">
        </label>
      </div>
    </article>
  `;
}

function collectFlights() {
  return Array.from(flightList.querySelectorAll("[data-flight-card]")).map((_, index) => ({
    departureFlightNumber: form.elements[`departureFlightNumber_${index}`]?.value.trim() || "",
    departureDate: form.elements[`departureFlightDate_${index}`]?.value || "",
    arrivalFlightNumber: form.elements[`arrivalFlightNumber_${index}`]?.value.trim() || "",
    arrivalDate: form.elements[`arrivalFlightDate_${index}`]?.value || ""
  }));
}

function getFlightDrafts() {
  return Array.from(flightList.querySelectorAll("[data-flight-card]")).map((_, index) => ({
    departureFlightNumber: form.elements[`departureFlightNumber_${index}`]?.value || "",
    departureDate: form.elements[`departureFlightDate_${index}`]?.value || "",
    arrivalFlightNumber: form.elements[`arrivalFlightNumber_${index}`]?.value || "",
    arrivalDate: form.elements[`arrivalFlightDate_${index}`]?.value || ""
  }));
}

function bindFlightActions() {
  flightList.querySelectorAll("[data-remove-flight]").forEach((button) => {
    button.addEventListener("click", () => {
      const drafts = getFlightDrafts();
      if (drafts.length <= 1) return;
      drafts.splice(Number(button.dataset.removeFlight), 1);
      renderFlights(drafts);
    });
  });
  flightList.querySelectorAll('input[name^="departureFlightDate_"], input[name^="arrivalFlightDate_"]').forEach((input) => {
    attachDatePicker(input);
  });
  flightList.querySelectorAll("input").forEach((field) => {
    field.addEventListener("input", populateSummary);
    field.addEventListener("change", populateSummary);
  });
}

function renderFlights(drafts = [{ departureFlightNumber: "", departureDate: "", arrivalFlightNumber: "", arrivalDate: "" }]) {
  flightList.innerHTML = drafts.map((_, index) => buildFlightCard(index)).join("");
  drafts.forEach((draft, index) => {
    if (form.elements[`departureFlightNumber_${index}`]) {
      form.elements[`departureFlightNumber_${index}`].value = draft.departureFlightNumber;
      form.elements[`departureFlightDate_${index}`].value = draft.departureDate;
      form.elements[`arrivalFlightNumber_${index}`].value = draft.arrivalFlightNumber;
      form.elements[`arrivalFlightDate_${index}`].value = draft.arrivalDate;
    }
  });
  bindFlightActions();
}

function collectNominees() {
  return Array.from(nomineeList.querySelectorAll("[data-nominee-card]")).map((_, index) => ({
    travellerIndex: Number(form.elements[`nomineeTraveller_${index}`]?.value || 0),
    travellerName: getTravellerDisplayNames()[Number(form.elements[`nomineeTraveller_${index}`]?.value || 0)] || `Traveller ${Number(form.elements[`nomineeTraveller_${index}`]?.value || 0) + 1}`,
    name: form.elements[`nomineeName_${index}`]?.value.trim() || "",
    relationship: form.elements[`nomineeRelationship_${index}`]?.value || "",
    idNumber: form.elements[`nomineeId_${index}`]?.value.trim() || "",
    contact: form.elements[`nomineeContact_${index}`]?.value.trim() || "",
    share: Number(form.elements[`nomineeShare_${index}`]?.value || 0)
  }));
}

function getNomineeDrafts() {
  return Array.from(nomineeList.querySelectorAll("[data-nominee-card]")).map((_, index) => ({
    travellerIndex: form.elements[`nomineeTraveller_${index}`]?.value || "0",
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

function renderNominees(drafts = [{ travellerIndex: "0", name: "", relationship: "", idNumber: "", contact: "", share: "" }]) {
  const nextDrafts = buildNomineeDraftList(drafts);
  nomineeList.innerHTML = nextDrafts.map((_, index) => buildNomineeCard(index)).join("");
  nextDrafts.forEach((draft, index) => {
    if (form.elements[`nomineeTraveller_${index}`]) {
      form.elements[`nomineeTraveller_${index}`].value = draft.travellerIndex ?? "0";
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
    getField("quoteNote").textContent = "";
    getField("quoteMeta").textContent = "Your total updates automatically when trip details, plan, or payment method changes.";
    breakdown.innerHTML = "";
    updateStickyQuoteBar();
    updatePaymentMethodTotals();
    return;
  }
  getField("quoteTotal").textContent = formatMoney(quote.total);
  getField("quoteNote").textContent = `${quote.days} day${quote.days > 1 ? "s" : ""} • ${AREA_LABELS[quote.area]} • ${state.policyType[0].toUpperCase()}${state.policyType.slice(1)}`;
  getField("quoteMeta").textContent = quote.items.some((item) => item.label.includes("Stamp duty") || item.label.includes("Card convenience fee"))
    ? "The payable amount already includes any applicable stamp duty and payment fee shown below."
    : "The payable amount already includes the applicable taxes shown below.";
  breakdown.innerHTML = quote.items.map((item) => `<div><dt>${item.label}</dt><dd>${item.value < 0 ? "-" : ""}${formatMoney(Math.abs(item.value))}</dd></div>`).join("");
  updateStickyQuoteBar();
  updatePaymentMethodTotals();
  populateSummary();
}

function populateSummary() {
  if (!state.quote) return;
  const returnDate = getField("insuranceType").value === "annual"
    ? formatDate(addDays(parseDate(getField("departureDate").value), 365))
    : getField("returnDate").value;

  summaryList.innerHTML = `
    <div><dt>Insurance Type</dt><dd>${getField("insuranceType").value === "annual" ? "Annual" : "Single Trip"}</dd></div>
    <div><dt>Travel Area</dt><dd>${AREA_LABELS[state.quote.area]}</dd></div>
    <div><dt>Policy Type</dt><dd>${state.policyType[0].toUpperCase()}${state.policyType.slice(1)}</dd></div>
    <div><dt>Plan</dt><dd>${state.selectedPlan[0].toUpperCase()}${state.selectedPlan.slice(1)}</dd></div>
    <div><dt>Travellers</dt><dd>${getTotalTravellers()}</dd></div>
    <div><dt>Travel Period</dt><dd>${getField("departureDate").value} to ${returnDate}</dd></div>
  `;
  getField("summaryTotal").textContent = formatMoney(state.quote.total);
  updateStickyQuoteBar();
}

function setPaymentContent() {
  paymentDetailBox.innerHTML = PAYMENT_CONTENT[document.querySelector('input[name="paymentMethod"]:checked').value];
  populateSummary();
}

function setLogicAlert(message = "") {
  if (!logicAlert) return;
  logicAlert.hidden = !message;
  logicAlert.textContent = message;
}

function showError(id, message) {
  const el = document.querySelector(`[data-error-for="${id}"]`);
  if (el) {
    el.textContent = message;
    const container = el.closest(".field, .subsection, .optional-subsection, .payment-card, .application-card");
    container?.classList.toggle("has-error", Boolean(message));
  }
}

function clearError(id) {
  showError(id, "");
}

function clearAllErrorHighlights() {
  document.querySelectorAll(".has-error").forEach((node) => node.classList.remove("has-error"));
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
  clearAllErrorHighlights();
  setLogicAlert("");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const departureDate = parseDate(getField("departureDate").value);
  const returnDate = parseDate(getField("returnDate").value);
  const total = getTotalTravellers();

  if (step === 1) {
    ["travelDates", "policyType", "selectedPlan"].forEach(clearError);
    if (!departureDate) {
      showError("travelDates", "Select your travel dates or policy start date.");
      valid = false;
    }
    if (departureDate && departureDate < today) {
      showError("travelDates", "Backdating is not allowed.");
      valid = false;
    }
    if (departureDate) {
      const twentyFourMonths = new Date(today);
      twentyFourMonths.setMonth(twentyFourMonths.getMonth() + 24);
      if (departureDate > twentyFourMonths) {
        showError("travelDates", "Inception date cannot be more than 24 months from today.");
        valid = false;
      }
      if (getField("insuranceType").value === "annual") {
        const sixMonths = new Date(today);
        sixMonths.setMonth(sixMonths.getMonth() + 6);
        if (departureDate > sixMonths) {
          showError("travelDates", "Annual plan cannot be issued more than 6 months in advance.");
          valid = false;
        }
      }
    }
    if (getField("insuranceType").value === "single") {
      const days = getTripDays();
      if (!returnDate || !departureDate || returnDate <= departureDate) {
        showError("travelDates", "Select both departure and return dates in the same calendar.");
        valid = false;
      } else if (days > 180) {
        showError("travelDates", "Single trip maximum cover is 180 days.");
        valid = false;
      }
    }
    if (total === 0 || total > 20) {
      showError("policyType", "Traveller count must be between 1 and 20.");
      valid = false;
    }
    if (!state.quote) {
      showError("selectedPlan", "Quote could not be calculated.");
      valid = false;
    }
    if (!valid) {
      setLogicAlert("Please complete the travel details correctly before continuing.");
    }
  }

  if (step === 2) {
    ["proposerName", "proposerMobile", "proposerEmail", "proposerOccupation", "proposerAddress", "bankDetails", "flights", "nominees", "selectedPlan", "insuredList"].forEach(clearError);
    const travellers = collectTravellers();
    let travellerIncomplete = false;
    travellers.forEach((traveller) => {
      if (!traveller.fullName || !traveller.nationality || !traveller.idNumber || !traveller.dateOfBirth || !traveller.gender || !traveller.mobile || !traveller.email || !traveller.occupation || !traveller.address) {
        travellerIncomplete = true;
        valid = false;
      }
      if (state.policyType === "family" && !traveller.category) {
        travellerIncomplete = true;
        valid = false;
      }
    });
    if (travellerIncomplete) {
      insuredList.closest(".subsection")?.classList.add("has-error");
      showError("insuredList", "Complete all required traveller details before continuing.");
    }
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
    const flights = collectFlights().filter((flight) =>
      flight.departureFlightNumber || flight.departureDate || flight.arrivalFlightNumber || flight.arrivalDate
    );
    flights.forEach((flight) => {
      if (!flight.departureFlightNumber || !flight.departureDate || !flight.arrivalFlightNumber || !flight.arrivalDate) {
        openOptionalSection("flightSectionBody");
        showError("flights", "Complete all flight fields for each added flight.");
        valid = false;
        return;
      }
      if (!parseDate(flight.departureDate) || !parseDate(flight.arrivalDate)) {
        openOptionalSection("flightSectionBody");
        showError("flights", "Use valid flight dates in DD/MM/YYYY format.");
        valid = false;
      }
    });
    const nominees = collectNominees().filter((nominee) =>
      nominee.name || nominee.relationship || nominee.idNumber || nominee.contact
    );
    nominees.forEach((nominee) => {
      if (!nominee.name || !nominee.relationship || !nominee.idNumber || !nominee.contact || !nominee.share) {
        openOptionalSection("nomineeSectionBody");
        showError("nominees", "Complete all nominee fields for each nominee card.");
        valid = false;
      }
    });
    const nomineeTotals = new Map();
    nominees.forEach((nominee) => {
      const key = nominee.travellerIndex;
      nomineeTotals.set(key, (nomineeTotals.get(key) || 0) + nominee.share);
    });
    nomineeTotals.forEach((totalShare) => {
      if (totalShare !== 100) {
        openOptionalSection("nomineeSectionBody");
        showError("nominees", "Each traveller's nominee allocation must total exactly 100%.");
        valid = false;
      }
    });
    if (!valid) {
      setLogicAlert("Some required details still need attention before you can continue.");
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
    if (!valid) {
      setLogicAlert("Please resolve the highlighted confirmation issues before submitting.");
    }
  }

  return valid;
}

function focusFirstError() {
  const firstError = Array.from(document.querySelectorAll(".error-text")).find((node) => node.textContent.trim());
  if (!firstError) return;
  const field = firstError.closest(".field, .subsection, .payment-card, .application-card")?.querySelector("input, select, textarea, button");
  if (field) field.focus({ preventScroll: true });
  firstError.scrollIntoView({ behavior: "smooth", block: "center" });
}

function goToStep(step) {
  state.step = step;
  document.querySelectorAll(".form-step").forEach((panel) => panel.classList.toggle("is-active", Number(panel.dataset.stepPanel) === step));
  document.querySelectorAll(".stepper .step").forEach((item) => {
    const itemStep = Number(item.dataset.step);
    item.classList.toggle("is-active", itemStep === step);
    item.classList.toggle("is-complete", itemStep < step);
  });
  getField("topBackButton").hidden = step === 1;
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
      coverageScope: getSelectedArea() === "domestic" ? "domestic" : "international",
      coverageArea: getSelectedArea(),
      policyType: state.policyType,
      selectedPlan: state.selectedPlan,
      departureDate,
      returnDate: finalReturnDate,
      destination: getField("destination").value.trim()
    },
    counts: getTravellerCounts(),
    flights: collectFlights().filter((flight) =>
      flight.departureFlightNumber || flight.departureDate || flight.arrivalFlightNumber || flight.arrivalDate
    ),
    proposer: {
      ...proposer,
      bankName: collectBankDetails()[0]?.bankName || "",
      bankAccountNumber: collectBankDetails()[0]?.bankAccountNumber || "",
      bankAccountType: collectBankDetails()[0]?.bankAccountType || ""
    },
    bankDetails: collectBankDetails().filter((bank) => bank.bankName || bank.bankAccountNumber),
    insuredTravellers: travellers,
    nominees: collectNominees().filter((nominee) =>
      nominee.name || nominee.relationship || nominee.idNumber || nominee.contact
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
  const isAnnual = getField("insuranceType").value === "annual";
  getField("travelDatesLabel").textContent = isAnnual ? "Policy Start Date *" : "Travel Dates *";
  getField("travelDates").placeholder = isAnnual ? "DD/MM/YYYY" : "DD/MM/YYYY to DD/MM/YYYY";
  getField("proposerSection").hidden = !getField("buyingForSomeoneElse").checked;
  if (isAnnual) {
    getField("returnDate").value = "";
  }
  initTravelDatePicker();
  renderAreaGuidance();
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
  getField("insuranceType").value = "single";
  const defaultArea = document.querySelector('input[name="travelArea"][value="area1"]');
  if (defaultArea) defaultArea.checked = true;
  getField("under70Count").value = 1;
  getField("seniorCount").value = 0;
  getField("successCard").hidden = true;
  form.hidden = false;
  renderFlights();
  renderNominees();
  renderBankDetails();
  setLogicAlert("");
  refreshVisibility();
  setPaymentContent();
  goToStep(1);
}

function bindOptionalSections() {
  document.querySelectorAll("[data-toggle-optional]").forEach((button) => {
    button.addEventListener("click", () => {
      const sectionId = button.dataset.toggleOptional;
      const body = getField(sectionId);
      const expanded = button.getAttribute("aria-expanded") === "true";
      body.hidden = expanded;
      button.setAttribute("aria-expanded", expanded ? "false" : "true");
      button.querySelector("em").textContent = expanded ? "Add" : "Hide";
    });
  });
}

function initTravelDatePicker() {
  const today = new Date();
  const isAnnual = getField("insuranceType").value === "annual";
  const departureDate = parseDate(getField("departureDate").value);
  const returnDate = parseDate(getField("returnDate").value);
  const defaultDate = isAnnual
    ? (departureDate || null)
    : [departureDate, returnDate].filter(Boolean);

  attachDatePicker(getField("travelDates"), {
    allowInput: false,
    minDate: today,
    mode: isAnnual ? "single" : "range",
    defaultDate,
    onChange: (selectedDates) => {
      if (isAnnual) {
        const [selectedDate] = selectedDates;
        setTravelDates(selectedDate ? formatDate(selectedDate) : "", "");
      } else {
        const [startDate, endDate] = selectedDates;
        setTravelDates(
          startDate ? formatDate(startDate) : "",
          endDate ? formatDate(endDate) : ""
        );
      }
      refreshQuote();
    }
  });

  syncTravelDateInput();
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

["insuranceType"].forEach((id) => {
  getField(id).addEventListener("change", refreshVisibility);
});

document.querySelectorAll('input[name="travelArea"]').forEach((input) => input.addEventListener("change", refreshVisibility));
document.querySelectorAll('input[name="paymentMethod"]').forEach((input) => input.addEventListener("change", setPaymentContent));
document.querySelectorAll('input[name="paymentMethod"]').forEach((input) => input.addEventListener("change", refreshQuote));
getField("destination").addEventListener("input", populateSummary);
marketingPlanCards?.querySelectorAll("[data-marketing-plan]").forEach((card) => {
  const selectMarketingPlan = () => {
    state.selectedPlan = card.dataset.marketingPlan;
    renderMarketingPlanCards();
    renderPlanChoices();
    card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };
  card.addEventListener("click", selectMarketingPlan);
  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    selectMarketingPlan();
  });
});
getField("buyingForSomeoneElse").addEventListener("change", () => {
  state.travellerSignature = "";
  refreshVisibility();
});
getField("addNomineeButton").addEventListener("click", () => {
  openOptionalSection("nomineeSectionBody");
  const drafts = getNomineeDrafts();
  drafts.push({ travellerIndex: "0", name: "", relationship: "", idNumber: "", contact: "", share: "" });
  renderNominees(drafts);
});
getField("addFlightButton").addEventListener("click", () => {
  openOptionalSection("flightSectionBody");
  const drafts = getFlightDrafts();
  drafts.push({ departureFlightNumber: "", departureDate: "", arrivalFlightNumber: "", arrivalDate: "" });
  renderFlights(drafts);
});

document.querySelectorAll("[data-next-step]").forEach((button) => {
  button.addEventListener("click", () => {
    const current = Number(button.dataset.nextStep) - 1;
    if (!validateStep(current)) {
      focusFirstError();
      return;
    }
    populateSummary();
    goToStep(Number(button.dataset.nextStep));
  });
});

document.querySelectorAll("[data-prev-step]").forEach((button) => {
  button.addEventListener("click", () => goToStep(Number(button.dataset.prevStep)));
});

document.querySelectorAll(".stepper .step").forEach((button) => {
  button.addEventListener("click", () => {
    const targetStep = Number(button.dataset.step);
    if (targetStep < state.step) goToStep(targetStep);
  });
});

getField("topBackButton").addEventListener("click", () => {
  if (state.step > 1) goToStep(state.step - 1);
});

getField("startNewButton").addEventListener("click", resetForm);
form.addEventListener("submit", submitForm);

refreshVisibility();
renderFlights();
renderBankDetails();
renderNominees();
setPaymentContent();
bindOptionalSections();
renderMarketingPlanCards();
