/* =========================================================
   i18n.js — Bilingual support (EN / 中文) for Henry Lee's
   Tokio Marine Explorer intake form.
   Malaysian Simplified Chinese throughout.
   ========================================================= */
(function () {
  'use strict';

  /* ----------------------------------------------------------
     Toggle button styles (injected so app.css is untouched)
  ---------------------------------------------------------- */
  const style = document.createElement('style');
  style.textContent = `
    .lang-toggle {
      position: fixed;
      bottom: 1.5rem;
      left: 1.5rem;
      z-index: 100;
      background: rgba(255, 255, 255, 0.88);
      border: 1px solid rgba(16, 18, 20, 0.08);
      backdrop-filter: blur(20px);
      border-radius: 999px;
      padding: 0.88rem 1.2rem;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.95rem;
      font-weight: 800;
      color: #101214;
      letter-spacing: 0.03em;
      display: flex;
      align-items: center;
      gap: 5px;
      box-shadow: 0 24px 80px rgba(15, 23, 42, 0.08);
      transition: transform 160ms ease, background 160ms ease, color 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
    }
    .lang-toggle:hover {
      transform: translateY(-1px);
      box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
    }
    .lang-toggle .lang-active { font-weight: 800; }
    .lang-toggle .lang-sep { opacity: 0.35; }
  `;
  document.head.appendChild(style);

  /* ----------------------------------------------------------
     Translation strings
  ---------------------------------------------------------- */
  const STRINGS = {

    /* ======================================================
       ENGLISH
    ====================================================== */
    en: {
      /* Navigation */
      'nav.brand.title': 'Travel Insurance Form',
      'nav.brand.subtitle': 'By Henry Lee',
      'nav.startQuote': 'Start Quote',

      /* Hero */
      'hero.headline': 'Travel With Confidence, Wherever You Go',
      'hero.subtext': 'Check the premium, pick a plan, and send your details in one go.',
      'hero.step1': '1. Enter Trip Details',
      'hero.step2': '2. Pick a Plan',
      'hero.step3': '3. Review and Submit',
      'hero.startApplication': 'Start Application',
      'hero.comparePlans': 'Compare Plans',

      /* Hero panel */
      'hero.allNew': 'All-New',
      'hero.cfar': 'Deluxe now includes CFAR',
      'hero.cfarDesc': 'Cancellation for Any Reason cover before departure',
      'hero.cashless': 'Cashless Overseas Hospital Admission',
      'hero.mastercard': 'Complimentary Mastercard®\u202fFlight Delay Pass',
      'hero.groupDiscount': '5% group discount',
      'hero.covid': 'COVID-19 cover at no extra cost',

      /* Coverage section */
      'coverage.eyebrow': 'Coverage Summary',
      'coverage.h2': "What's Covered?",
      'coverage.sectionCopy': "Pick a plan here and it'll carry into the form below.",
      'coverage.introCopy': "If you're not sure where to start, Essential is the middle-ground pick. Basic keeps the premium lower, while Deluxe gives you stronger cover and CFAR.",
      'coverage.currentlySelected': 'Currently selected',
      'coverage.continueWithPlan': 'Continue With This Plan',

      /* Plan tags / labels */
      'plan.tag.popular': 'Popular',
      'plan.tag.best': 'Best',
      'plan.suffix': '/ pax',

      /* Coverage benefits */
      'benefit.accidentalDeath': 'Accidental Death',
      'benefit.medicalExpenses': 'Medical Expenses',
      'benefit.emergencyEvacuation': 'Emergency Evacuation',
      'benefit.travelInconvenience': 'Travel Inconvenience',
      'benefit.personalLiability': 'Personal Liability',
      'benefit.loungeAccess': 'Lounge Access',
      'benefit.unlimited': 'Unlimited',

      /* Application section */
      'app.eyebrow': 'Apply Online',
      'app.h2': 'Apply in a Few Minutes',
      'app.sectionCopy': "Three short steps. We'll work out the premium as you go.",

      /* Quote bar */
      'quoteBar.label': 'Current Quote',
      'quoteBar.selectedPlan': 'Selected Plan',
      'quoteBar.travellers': function (n) { return n + ' traveller' + (n === 1 ? '' : 's'); },

      /* Stepper */
      'step1.label': '1. Travel Details',
      'step2.label': '2. Choose Plan',
      'step3.label': '3. Confirm & Pay',
      'topBack': 'Back',

      /* Step 1 form */
      's1.h3': 'Travel Details',
      's1.desc': 'Start with the trip dates, destination, and number of travellers. You can review everything before sending it in.',
      'insuranceType.label': 'Insurance Type *',
      'insuranceType.single': 'Single Trip',
      'insuranceType.annual': 'Annual',
      'area.label': 'Travel Area *',
      'area.area1.title': 'Area 1',
      'area.area1.desc': 'Asia-Pacific favourites like Japan, China, Singapore, Thailand, Australia, and New Zealand',
      'area.area2.title': 'Area 2',
      'area.area2.desc': 'Worldwide excluding Malaysia, USA, Canada, Nepal, and Tibet',
      'area.area3.title': 'Area 3',
      'area.area3.desc': 'Worldwide excluding Malaysia, including USA and Canada',
      'area.domestic.title': 'Domestic',
      'area.domestic.desc': 'Travel within Malaysia only',
      'travelDates.label': 'Travel Dates *',
      'travelDates.labelAnnual': 'Policy Start Date *',
      'travelDates.placeholder': 'DD/MM/YYYY to DD/MM/YYYY',
      'travelDates.placeholderAnnual': 'DD/MM/YYYY',
      'destination.label': 'Destination Country / City',
      'destination.placeholder': 'e.g. Japan, Tokyo',

      'travellers.h4': 'How many travellers?',
      'adult.label': 'Adult',
      'senior.label': 'Senior (>70)',
      'policyType.label': 'Policy Type *',

      'eligibility.summary': 'Eligibility & Family Rules',
      'eligibility.ageTitle': 'Age eligibility',
      'eligibility.ageIndividual': 'Individual: From 30 days to 70 years old',
      'eligibility.ageSenior': 'Senior: From 71 to 85 years old',
      'eligibility.ageFamily': 'Family: From 18 to 70 years old (for Parent/Legal Guardian) & from 30 days to 23 years old (for Children)',
      'eligibility.familyTitle': 'Family plan',
      'eligibility.familyDesc': 'Applicable to legal spouse (limited to 1 legal spouse), legal child(ren), and legally adopted children.',
      'eligibility.maxBenefitTitle': 'Maximum benefit',
      'eligibility.maxBenefitDesc': 'For Family plans, the maximum benefit amount per family is 3 times of the individual limits stated in the Table of Coverages.',

      'quote.label': 'Estimated Premium',
      'quote.metaDefault': 'Your total updates automatically when you change the trip, plan, or payment method.',
      'quote.metaTaxStamp': 'The payable amount already includes any applicable stamp duty and payment fee shown below.',
      'quote.metaTaxOnly': 'The payable amount already includes the applicable taxes shown below.',
      'continue': 'Continue',

      /* Step 2 */
      's2.h3': 'Choose Plan',
      's2.desc': 'Pick the plan that fits, then fill in the traveller details.',
      'planSelect.label': 'Plan selection *',
      'planSelect.hint': "We start with Essential selected because it's the most common choice.",
      'buyingForSomeoneElse': 'Buying for Someone Else?',

      'proposer.h4': 'Proposer Details',
      'proposer.name': 'Full Name',
      'proposer.mobile': 'Mobile Number',
      'proposer.email': 'Email Address',
      'proposer.occupation': 'Occupation',
      'proposer.address': 'Home Address',

      'insured.h4': 'Insured details',
      'insured.nricHint': 'NRIC auto-fills date of birth and gender when the IC number is entered.',
      'insured.travellersToComplete': function (n) { return n + ' traveller' + (n === 1 ? '' : 's') + ' to complete.'; },

      /* Traveller card */
      'travellerCard.alsoProposer': ' (also proposer)',
      'travellerCard.senior': 'Age 71-85',
      'travellerCard.adult': 'Aged up to 70 years old',
      'travellerCard.hide': 'Hide',
      'travellerCard.edit': 'Edit',
      'travellerCard.name': 'Full Name (Follow NRIC/ Passport) *',
      'travellerCard.nationality': 'Nationality *',
      'travellerCard.nric': 'NRIC/Passport *',
      'travellerCard.dob': 'Date of Birth *',
      'travellerCard.gender': 'Gender *',
      'travellerCard.genderSelect': 'Select gender',
      'travellerCard.male': 'Male',
      'travellerCard.female': 'Female',
      'travellerCard.mobile': 'Mobile Number *',
      'travellerCard.email': 'Email Address *',
      'travellerCard.occupation': 'Occupation *',
      'travellerCard.address': 'Home Address *',
      'travellerCard.familyRole': 'Family role *',
      'travellerCard.selectRole': 'Select role',
      'travellerCard.husband': 'Husband',
      'travellerCard.wife': 'Wife',
      'travellerCard.child': 'Child',

      /* Bank */
      'bank.cardTitle': function (name) { return name + "'s Bank"; },
      'bank.multiCardTitle': function (n, name) { return '#' + n + ' ' + name + "'s Bank"; },
      'bank.singleTitle': 'Bank Details',
      'bank.name': 'Bank Name (For Claim Purpose)',
      'bank.selectBank': 'Select bank',
      'bank.accountNumber': 'Account Number',
      'bank.accountType': 'Account Type',
      'bank.savings': 'Savings',
      'bank.current': 'Current',

      /* Flights */
      'flight.title': 'Flight Details',
      'flight.add': 'Add flight',
      'flight.header': function (n) { return 'Flight ' + n; },
      'flight.depFlightNo': 'Departure Flight No',
      'flight.depDate': 'Departure Date',
      'flight.retFlightNo': 'Return Flight No',
      'flight.retDate': 'Return Date',
      'flight.remove': 'Remove',

      /* Nominees */
      'nominee.title': 'Nominee Details',
      'nominee.add': 'Add nominee',
      'nominee.header': function (n) { return 'Nominee ' + n; },
      'nominee.traveller': 'Traveller *',
      'nominee.name': "Nominee's Full Name *",
      'nominee.relationship': 'Relationship *',
      'nominee.selectRelationship': 'Select relationship',
      'nominee.nric': 'NRIC/Passport *',
      'nominee.contact': 'Contact Number *',
      'nominee.share': 'Allocation (%) *',
      'nominee.remove': 'Remove',

      'optional.add': 'Add',
      'optional.hide': 'Hide',
      'back': 'Back',

      /* Step 3 */
      's3.h3': 'Confirm & Pay',
      's3.desc': "Check the premium, choose how you'd like to pay, and submit when ready. It usually takes about 2 minutes.",
      'review.h4': 'Review Your Details',
      'review.desc': 'Give the trip and contact details one last look before payment. Nominee and bank details are left out here.',
      'review.editDetails': 'Edit details',
      'payment.h4': 'Choose Payment Method',
      'duitnow.small': 'Scan the QR shared by Henry',
      'tng.small': '012 612 3540',
      'bank.transfer.small': 'RHB 1040 2700 307120',
      'billplz.small': 'Henry sends the payment link',

      'payInstructions.label': 'Payment Instructions',
      'payInstructions.tng': "Touch 'n Go: 012 612 3540",
      'payInstructions.rhb': 'RHB Bank: 1040 2700 307120',
      'payInstructions.sendSlip': 'Send the payment slip once done.',

      'assurance.label': 'Before You Submit',
      'assurance.item1': 'You will see the final payable amount before submission.',
      'assurance.item2': 'Payment is checked before policy follow-up.',
      'assurance.item3': 'Henry reviews your details if anything looks incomplete.',

      'uploadSlip.label': 'Upload Payment Slip',
      'uploadSlip.hint': "Required for DuitNow, Touch 'n Go and bank transfer.",
      'consent.text': 'I confirm the information provided is accurate and understand policy issuance is subject to Tokio Marine acceptance and payment clearance.',

      'totalPayable': 'Total payable',
      'submit': 'Submit application',
      'submitting': 'Submitting...',

      /* Success screen */
      'success.eyebrow': 'Submission sent',
      'success.h3': 'Submission received.',
      'success.desc': "Your details have been sent to Henry. He'll review them and follow up.",
      'success.nextSteps': 'What Happens Next',
      'success.step1': 'Henry checks the trip details and premium',
      'success.step2': "If you uploaded payment proof, he'll verify it before the next step",
      'success.step3': 'If anything needs fixing, you can message Henry on WhatsApp',
      'success.startNew': 'Start Another Submission',
      'success.whatsapp': 'WhatsApp Henry',

      /* Footer */
      'footer.title': 'Travel Insurance Form',
      'footer.desc': "This form is managed by Henry Lee. It is not Tokio Marine's official policy portal.",

      /* Dynamic — plan choices */
      'plan.basic.label': 'Basic',
      'plan.essential.label': 'Essential',
      'plan.deluxe.label': 'Deluxe',
      'plan.domestic.label': 'Domestic',
      'plan.basic.note': 'Basic Explorer cover.',
      'plan.essential.note': 'Best balance of cover and price.',
      'plan.deluxe.note': 'Highest cover with CFAR.',
      'plan.domestic.note': 'For trips within Malaysia only.',

      /* Dynamic — policy options */
      'policy.individual.label': 'Individual',
      'policy.individual.note': 'Exactly one traveller.',
      'policy.family.label': 'Family',
      'policy.family.note': 'Husband + wife + unlimited children.',
      'policy.group.label': 'Group',
      'policy.group.note.senior': 'Required when any traveller is aged 71 to 85.',
      'policy.group.note': 'Minimum 2 travellers with 5% discount.',

      /* Dynamic — area guidance */
      'area.area1.summary': 'Best for Asia-Pacific trips.',
      'area.area1.detail': 'Australia, Bangladesh, Brunei, Cambodia, China, Hong Kong, India, Indonesia, Japan, Korea, Laos, Macau, Maldives, Myanmar, New Zealand, Pakistan, Philippines, Singapore, Sri Lanka, Taiwan, Thailand and Vietnam.',
      'area.area2.summary': 'Worldwide cover excluding a few higher-risk destinations.',
      'area.area2.detail': 'Worldwide excluding Malaysia, USA, Canada, Nepal and Tibet.',
      'area.area3.summary': 'Worldwide cover including USA and Canada.',
      'area.area3.detail': 'Worldwide excluding Malaysia.',
      'area.domestic.summary': 'For travel within Malaysia.',
      'area.domestic.detail': 'Within Malaysia.',

      /* Dynamic — plan guidance */
      'plan.basic.summary': 'A lower-cost option if you mainly want the core cover.',
      'plan.basic.bullet1': 'Lower starting premium',
      'plan.basic.bullet2': 'Core medical and travel inconvenience benefits',
      'plan.basic.bullet3': 'No lounge access or CFAR',
      'plan.essential.summary': 'A solid middle-ground plan for most trips.',
      'plan.essential.bullet1': 'Most popular option',
      'plan.essential.bullet2': 'Includes lounge access on qualifying delays',
      'plan.essential.bullet3': 'Higher limits than Basic',
      'plan.deluxe.summary': 'Best if you want fuller cover and CFAR before departure.',
      'plan.deluxe.bullet1': 'Highest protection level',
      'plan.deluxe.bullet2': 'Includes lounge access',
      'plan.deluxe.bullet3': 'Includes CFAR, subject to policy wording',
      'plan.domestic.summary': 'For trips within Malaysia only.',
      'plan.domestic.bullet1': 'For travel within Malaysia',
      'plan.domestic.bullet2': 'Domestic rating applies',
      'plan.domestic.bullet3': 'Medical illness cover does not apply like international plans',

      /* Dynamic — quote breakdown labels */
      'quote.domesticFamilyPremium': 'Domestic family premium',
      'quote.domesticGroupBase': 'Domestic group base',
      'quote.groupDiscount': 'Group discount (5%)',
      'quote.domesticSeniorPremium': 'Domestic senior premium',
      'quote.domesticIndividualPremium': 'Domestic individual premium',
      'quote.groupBase': 'Group base premium',
      'quote.serviceTax': 'Service tax (8%)',
      'quote.stampDuty': 'Stamp duty',
      'quote.cardFee': 'Card convenience fee',
      'quote.familyPremium': function (plan) { return plan + ' family premium'; },
      'quote.seniorPremium': function (plan) { return plan + ' senior premium'; },
      'quote.individualPremium': function (plan) { return plan + ' individual premium'; },
      'quote.days': function (n) { return n + ' day' + (n > 1 ? 's' : ''); },
      'quote.noteFormat': function (days, area, policyType) { return days + ' \u2022 ' + area + ' \u2022 ' + policyType; },

      /* Payment method pay label */
      'pay': 'Pay',

      /* Dynamic — summary section titles */
      'summary.tripCover': 'Trip & Cover',
      'summary.contactDetails': 'Contact Details',
      'summary.travellerDetails': 'Traveller Details',
      'summary.flightDetails': 'Flight Details',
      'summary.emptyTraveller': 'Traveller details will appear here once completed.',
      'summary.noDetails': 'No details added.',

      /* Dynamic — summary field labels */
      'summary.insuranceType': 'Insurance Type',
      'summary.area': 'Area',
      'summary.destination': 'Destination',
      'summary.policyType': 'Policy Type',
      'summary.plan': 'Plan Selected',
      'summary.numTravellers': 'No. of Travellers',
      'summary.travelPeriod': 'Travel Period',
      'summary.name': 'Name',
      'summary.mobile': 'Mobile',
      'summary.email': 'Email',
      'summary.address': 'Address',
      'summary.icPassport': 'IC / Passport',
      'summary.role': 'Role',
      'summary.depFlight': 'Departure Flight',
      'summary.depDate': 'Departure Date',
      'summary.arrFlight': 'Arrival Flight',
      'summary.arrDate': 'Arrival Date',
      'summary.flight': function (n) { return 'Flight ' + n; },

      /* Insurance type display values */
      'insuranceType.annualLabel': 'Annual',
      'insuranceType.singleLabel': 'Single Trip',

      /* Policy type pill */
      'policyType.pill': function (type) {
        return 'Policy Type: ' + type[0].toUpperCase() + type.slice(1);
      },

      /* Traveller summary text */
      'travellerSummary': function (n) { return n + ' traveller' + (n === 1 ? '' : 's') + ' to complete.'; },

      /* Validation errors */
      'error.selectDates': 'Select your travel dates or policy start date.',
      'error.backdate': 'Backdating is not allowed.',
      'error.tooFarAhead': 'Inception date cannot be more than 24 months from today.',
      'error.annualTooFar': 'Annual plan cannot be issued more than 6 months in advance.',
      'error.singleTripDates': 'Select both departure and return dates in the same calendar.',
      'error.maxDays': 'Single trip maximum cover is 180 days.',
      'error.travellerCount': 'Traveller count must be between 1 and 20.',
      'error.quoteCalc': 'Quote could not be calculated.',
      'error.travelDetails': 'Please complete the travel details correctly before continuing.',
      'error.travellerIncomplete': 'Complete all required traveller details before continuing.',
      'error.familyRoles': 'Family must contain exactly one Husband, one Wife and any number of Children.',
      'error.requiredField': 'This field is required.',
      'error.flightComplete': 'Complete all flight fields for each added flight.',
      'error.flightDates': 'Use valid flight dates in DD/MM/YYYY format.',
      'error.nomineeComplete': 'Complete all nominee fields for each nominee card.',
      'error.nomineeTotal': "Each traveller's nominee allocation must total exactly 100%.",
      'error.detailsIncomplete': 'Some required details still need attention before you can continue.',
      'error.consent': 'Consent is required before submit.',
      'error.confirmIssues': 'Please resolve the highlighted confirmation issues before submitting.',

      /* Payment content HTML */
      'paymentContent.duitnow': "<strong>DuitNow QR</strong><p>Scan Henry's QR and upload the payment screenshot before you submit. It helps him verify the payment faster.</p><img src=\"/duitnow-qr.png\" alt=\"DuitNow QR\">",
      'paymentContent.tng': "<strong>Touch 'n Go</strong><p>Transfer to <b>LEE MOU YEN</b> at <b>012 612 3540</b>. Upload the payment screenshot after payment.</p>",
      'paymentContent.bank': "<strong>RHB Bank Transfer</strong><p>Account name <b>LEE MOU YEN</b><br>Account number <b>1040 2700 307120</b><br>Please include the payment slip so Henry can follow up faster.</p>",
      'paymentContent.billplz': "<strong>Billplz card request</strong><p>Henry will send you the payment link after you submit. A 2% card fee applies, and no payment slip is needed at this stage.</p>",
    },

    /* ======================================================
       MALAYSIAN SIMPLIFIED CHINESE (大马华语)
    ====================================================== */
    zh: {
      /* Navigation */
      'nav.brand.title': '旅游保险表格',
      'nav.brand.subtitle': 'Henry Lee 专属',
      'nav.startQuote': '立即报价',

      /* Hero */
      'hero.headline': '先把旅游保险办好，再安心出发',
      'hero.subtext': '先看保费，再选方案，然后一次过提交资料。',
      'hero.step1': '1. 填写行程资料',
      'hero.step2': '2. 选择方案',
      'hero.step3': '3. 核对后提交',
      'hero.startApplication': '开始投保',
      'hero.comparePlans': '比较方案',

      /* Hero panel */
      'hero.allNew': '全新',
      'hero.cfar': 'Deluxe 现已包含 CFAR',
      'hero.cfarDesc': '出发前可享 CFAR 取消保障',
      'hero.cashless': '海外住院免付现金',
      'hero.mastercard': '免费 Mastercard® 航班延误贵宾室通行证',
      'hero.groupDiscount': '团体旅客享 5% 折扣',
      'hero.covid': 'COVID-19 保障无需额外付费',

      /* Coverage section */
      'coverage.eyebrow': '保障摘要',
      'coverage.h2': '保障内容',
      'coverage.sectionCopy': '先在这里选方案，下面表格会自动带入。',
      'coverage.introCopy': '如果您还没决定，Essential 通常最均衡。Basic 保费较低，Deluxe 则有更高保障和 CFAR。',
      'coverage.currentlySelected': '已选方案',
      'coverage.continueWithPlan': '以此方案继续',

      /* Plan tags / labels */
      'plan.tag.popular': '热门',
      'plan.tag.best': '最佳',
      'plan.suffix': '/ 人',

      /* Coverage benefits */
      'benefit.accidentalDeath': '意外身故',
      'benefit.medicalExpenses': '医疗费用',
      'benefit.emergencyEvacuation': '紧急撤离',
      'benefit.travelInconvenience': '旅行不便',
      'benefit.personalLiability': '个人法律责任',
      'benefit.loungeAccess': '贵宾室使用权',
      'benefit.unlimited': '无限额',

      /* Application section */
      'app.eyebrow': '网上投保',
      'app.h2': '几分钟内完成投保',
      'app.sectionCopy': '全程只有三步，保费也会边填边更新。',

      /* Quote bar */
      'quoteBar.label': '当前报价',
      'quoteBar.selectedPlan': '已选方案',
      'quoteBar.travellers': function (n) { return n + ' 位旅行者'; },

      /* Stepper */
      'step1.label': '1. 行程资料',
      'step2.label': '2. 选择方案',
      'step3.label': '3. 确认与付款',
      'topBack': '返回',

      /* Step 1 form */
      's1.h3': '行程资料',
      's1.desc': '先填写日期、目的地和旅行人数，提交前还可以再检查一次。',
      'insuranceType.label': '保险类型 *',
      'insuranceType.single': '单次行程',
      'insuranceType.annual': '全年计划',
      'area.label': '旅行地区 *',
      'area.area1.title': '地区一',
      'area.area1.desc': '日本、中国、新加坡、泰国、澳大利亚、新西兰等亚太热门地区',
      'area.area2.title': '地区二',
      'area.area2.desc': '全球，不含马来西亚、美国、加拿大、尼泊尔及西藏',
      'area.area3.title': '地区三',
      'area.area3.desc': '全球，不含马来西亚（含美国及加拿大）',
      'area.domestic.title': '国内',
      'area.domestic.desc': '仅限马来西亚境内旅行',
      'travelDates.label': '旅行日期 *',
      'travelDates.labelAnnual': '保单开始日期 *',
      'travelDates.placeholder': 'DD/MM/YYYY 至 DD/MM/YYYY',
      'travelDates.placeholderAnnual': 'DD/MM/YYYY',
      'destination.label': '目的地国家/城市',
      'destination.placeholder': '例如：日本、东京',

      'travellers.h4': '旅行人数',
      'adult.label': '成人',
      'senior.label': '长者（>70岁）',
      'policyType.label': '保单类型 *',

      'eligibility.summary': '资格与家庭计划说明',
      'eligibility.ageTitle': '年龄资格',
      'eligibility.ageIndividual': '个人：30天至70岁',
      'eligibility.ageSenior': '长者：71至85岁',
      'eligibility.ageFamily': '家庭：父母/监护人18至70岁，子女30天至23岁',
      'eligibility.familyTitle': '家庭计划',
      'eligibility.familyDesc': '适用于合法配偶（限1位）、合法子女及合法领养子女。',
      'eligibility.maxBenefitTitle': '最高保障金额',
      'eligibility.maxBenefitDesc': '家庭计划的每个家庭最高保障金额为个人限额的3倍。',

      'quote.label': '预估保费',
      'quote.metaDefault': '行程、方案或付款方式一改，金额会自动更新。',
      'quote.metaTaxStamp': '应付金额已包含适用的印花税及付款手续费。',
      'quote.metaTaxOnly': '应付金额已包含适用税项。',
      'continue': '继续',

      /* Step 2 */
      's2.h3': '选择方案',
      's2.desc': '先选合适方案，再填写旅行者资料。',
      'planSelect.label': '方案选择 *',
      'planSelect.hint': '预设为 Essential，因为这是最多人选择的方案。',
      'buyingForSomeoneElse': '代他人投保？',

      'proposer.h4': '投保人资料',
      'proposer.name': '全名',
      'proposer.mobile': '手机号码',
      'proposer.email': '电子邮件',
      'proposer.occupation': '职业',
      'proposer.address': '住家地址',

      'insured.h4': '受保人资料',
      'insured.nricHint': '输入身份证号码后，出生日期与性别将自动填入。',
      'insured.travellersToComplete': function (n) { return n + ' 位旅行者待填写资料。'; },

      /* Traveller card */
      'travellerCard.alsoProposer': '（同为投保人）',
      'travellerCard.senior': '71-85岁',
      'travellerCard.adult': '70岁及以下',
      'travellerCard.hide': '收起',
      'travellerCard.edit': '编辑',
      'travellerCard.name': '全名（依据身份证/护照）*',
      'travellerCard.nationality': '国籍 *',
      'travellerCard.nric': '身份证/护照号码 *',
      'travellerCard.dob': '出生日期 *',
      'travellerCard.gender': '性别 *',
      'travellerCard.genderSelect': '请选择性别',
      'travellerCard.male': '男',
      'travellerCard.female': '女',
      'travellerCard.mobile': '手机号码 *',
      'travellerCard.email': '电子邮件 *',
      'travellerCard.occupation': '职业 *',
      'travellerCard.address': '住家地址 *',
      'travellerCard.familyRole': '家庭身份 *',
      'travellerCard.selectRole': '请选择身份',
      'travellerCard.husband': '丈夫',
      'travellerCard.wife': '妻子',
      'travellerCard.child': '子女',

      /* Bank */
      'bank.cardTitle': function (name) { return name + ' 的银行资料'; },
      'bank.multiCardTitle': function (n, name) { return '#' + n + ' ' + name + ' 的银行资料'; },
      'bank.singleTitle': '银行资料',
      'bank.name': '银行名称（理赔用途）',
      'bank.selectBank': '请选择银行',
      'bank.accountNumber': '账户号码',
      'bank.accountType': '账户类型',
      'bank.savings': '储蓄账户',
      'bank.current': '往来账户',

      /* Flights */
      'flight.title': '航班资料',
      'flight.add': '添加航班',
      'flight.header': function (n) { return '航班 ' + n; },
      'flight.depFlightNo': '去程航班号',
      'flight.depDate': '去程日期',
      'flight.retFlightNo': '回程航班号',
      'flight.retDate': '回程日期',
      'flight.remove': '删除',

      /* Nominees */
      'nominee.title': '受益人资料',
      'nominee.add': '添加受益人',
      'nominee.header': function (n) { return '受益人 ' + n; },
      'nominee.traveller': '旅行者 *',
      'nominee.name': '受益人全名 *',
      'nominee.relationship': '关系 *',
      'nominee.selectRelationship': '请选择关系',
      'nominee.nric': '身份证/护照号码 *',
      'nominee.contact': '联系电话 *',
      'nominee.share': '分配比例 (%) *',
      'nominee.remove': '删除',

      'optional.add': '添加',
      'optional.hide': '隐藏',
      'back': '返回',

      /* Step 3 */
      's3.h3': '确认与付款',
      's3.desc': '确认保费、选择付款方式，准备好就能提交，通常约 2 分钟可完成。',
      'review.h4': '核对您的资料',
      'review.desc': '付款前再看一次行程和联系资料。这里不会显示受益人和银行资料。',
      'review.editDetails': '修改资料',
      'payment.h4': '选择付款方式',
      'duitnow.small': '扫描 Henry 分享的 QR 码',
      'tng.small': '012 612 3540',
      'bank.transfer.small': 'RHB 1040 2700 307120',
      'billplz.small': 'Henry 将发送付款链接',

      'payInstructions.label': '付款指示',
      'payInstructions.tng': "Touch 'n Go：012 612 3540",
      'payInstructions.rhb': 'RHB Bank：1040 2700 307120',
      'payInstructions.sendSlip': '完成后请发送付款收据。',

      'assurance.label': '提交前注意',
      'assurance.item1': '提交前您将看到最终应付金额。',
      'assurance.item2': '付款确认后方进行保单跟进。',
      'assurance.item3': '如资料有任何不完整，Henry 将与您联系。',

      'uploadSlip.label': '上传付款收据',
      'uploadSlip.hint': "DuitNow、Touch 'n Go 及银行转账须附上收据。",
      'consent.text': '本人确认所提供的资料正确无误，并明白保单的发出须视乎 Tokio Marine 的接受及付款的到账情况。',

      'totalPayable': '应付总额',
      'submit': '提交申请',
      'submitting': '提交中...',

      /* Success screen */
      'success.eyebrow': '提交成功',
      'success.h3': '申请已收到。',
      'success.desc': '资料已发送给 Henry，他会查看后再跟进。',
      'success.nextSteps': '接下来的步骤',
      'success.step1': 'Henry 会检查行程资料和保费',
      'success.step2': '如果您已上传付款收据，他会先核实再继续处理',
      'success.step3': '如果有资料要修改，可直接 WhatsApp Henry',
      'success.startNew': '重新提交',
      'success.whatsapp': 'WhatsApp Henry',

      /* Footer */
      'footer.title': '旅游保险表格',
      'footer.desc': '此表格由 Henry Lee 处理，并非 Tokio Marine 官方投保平台。',

      /* Dynamic — plan choices */
      'plan.basic.label': 'Basic',
      'plan.essential.label': 'Essential',
      'plan.deluxe.label': 'Deluxe',
      'plan.domestic.label': '国内',
      'plan.basic.note': '基础保障，保费较低。',
      'plan.essential.note': '保障和保费较平衡。',
      'plan.deluxe.note': '保障最高，并包含 CFAR。',
      'plan.domestic.note': '仅限马来西亚境内旅行。',

      /* Dynamic — policy options */
      'policy.individual.label': '个人',
      'policy.individual.note': '仅一名旅行者。',
      'policy.family.label': '家庭',
      'policy.family.note': '夫妻 + 无限子女。',
      'policy.group.label': '团体',
      'policy.group.note.senior': '含71至85岁旅行者时须选此项。',
      'policy.group.note': '最少2名旅行者，享5%折扣。',

      /* Dynamic — area guidance */
      'area.area1.summary': '最适合亚太地区旅行。',
      'area.area1.detail': '澳大利亚、孟加拉国、文莱、柬埔寨、中国、香港、印度、印度尼西亚、日本、韩国、老挝、澳门、马尔代夫、缅甸、新西兰、巴基斯坦、菲律宾、新加坡、斯里兰卡、台湾、泰国及越南。',
      'area.area2.summary': '全球承保，不含少数高风险目的地。',
      'area.area2.detail': '全球，不含马来西亚、美国、加拿大、尼泊尔及西藏。',
      'area.area3.summary': '全球承保，包含美国及加拿大。',
      'area.area3.detail': '全球，不含马来西亚。',
      'area.domestic.summary': '仅限马来西亚境内旅行。',
      'area.domestic.detail': '马来西亚境内。',

      /* Dynamic — plan guidance */
      'plan.basic.summary': '适合想先买好基本保障的旅客，保费也较低。',
      'plan.basic.bullet1': '较低起始保费',
      'plan.basic.bullet2': '涵盖基本医疗及旅行不便保障',
      'plan.basic.bullet3': '不含贵宾室使用权及 CFAR',
      'plan.essential.summary': '大多数旅客都会先看这个，保障和价格比较平衡。',
      'plan.essential.bullet1': '最受欢迎方案',
      'plan.essential.bullet2': '航班延误可享贵宾室',
      'plan.essential.bullet3': '保障额高于 Basic 方案',
      'plan.deluxe.summary': '适合想要更完整保障，以及出发前更大弹性的旅客。',
      'plan.deluxe.bullet1': '最高保障级别',
      'plan.deluxe.bullet2': '含贵宾室使用权',
      'plan.deluxe.bullet3': '含 CFAR，须符合保单条款',
      'plan.domestic.summary': '只适用于马来西亚境内旅行。',
      'plan.domestic.bullet1': '仅限马来西亚境内旅行',
      'plan.domestic.bullet2': '适用国内保费',
      'plan.domestic.bullet3': '不含国际计划的疾病医疗保障',

      /* Dynamic — quote breakdown labels */
      'quote.domesticFamilyPremium': '国内家庭保费',
      'quote.domesticGroupBase': '国内团体基本保费',
      'quote.groupDiscount': '团体折扣（5%）',
      'quote.domesticSeniorPremium': '国内长者保费',
      'quote.domesticIndividualPremium': '国内个人保费',
      'quote.groupBase': '团体基本保费',
      'quote.serviceTax': '服务税（8%）',
      'quote.stampDuty': '印花税',
      'quote.cardFee': '信用卡手续费',
      'quote.familyPremium': function (plan) { return plan + ' 家庭保费'; },
      'quote.seniorPremium': function (plan) { return plan + ' 长者保费'; },
      'quote.individualPremium': function (plan) { return plan + ' 个人保费'; },
      'quote.days': function (n) { return n + ' 天'; },
      'quote.noteFormat': function (days, area, policyType) { return days + ' · ' + area + ' · ' + policyType; },

      /* Payment method pay label */
      'pay': '付款',

      /* Dynamic — summary section titles */
      'summary.tripCover': '行程与保障',
      'summary.contactDetails': '联系资料',
      'summary.travellerDetails': '旅行者资料',
      'summary.flightDetails': '航班资料',
      'summary.emptyTraveller': '旅行者资料填写完毕后将显示于此。',
      'summary.noDetails': '未添加资料。',

      /* Dynamic — summary field labels */
      'summary.insuranceType': '保险类型',
      'summary.area': '地区',
      'summary.destination': '目的地',
      'summary.policyType': '保单类型',
      'summary.plan': '已选方案',
      'summary.numTravellers': '旅行人数',
      'summary.travelPeriod': '旅行期限',
      'summary.name': '姓名',
      'summary.mobile': '手机',
      'summary.email': '电邮',
      'summary.address': '地址',
      'summary.icPassport': '身份证/护照',
      'summary.role': '身份',
      'summary.depFlight': '去程航班',
      'summary.depDate': '去程日期',
      'summary.arrFlight': '回程航班',
      'summary.arrDate': '回程日期',
      'summary.flight': function (n) { return '航班 ' + n; },

      /* Insurance type display values */
      'insuranceType.annualLabel': '全年计划',
      'insuranceType.singleLabel': '单次行程',

      /* Policy type pill */
      'policyType.pill': function (type) {
        var labels = { individual: '个人', family: '家庭', group: '团体', domestic: '国内' };
        return '保单类型：' + (labels[type] || type);
      },

      /* Traveller summary text */
      'travellerSummary': function (n) { return n + ' 位旅行者待填写资料。'; },

      /* Validation errors */
      'error.selectDates': '请选择旅行日期或保单开始日期。',
      'error.backdate': '不允许回溯日期。',
      'error.tooFarAhead': '开始日期不可超过今天起24个月。',
      'error.annualTooFar': '全年计划不可提前超过6个月购买。',
      'error.singleTripDates': '请在同一日历中选择去程及回程日期。',
      'error.maxDays': '单次行程最多承保180天。',
      'error.travellerCount': '旅行人数须介于1至20人之间。',
      'error.quoteCalc': '无法计算保费报价。',
      'error.travelDetails': '请正确填写行程资料后再继续。',
      'error.travellerIncomplete': '请完成所有必填旅行者资料后再继续。',
      'error.familyRoles': '家庭计划须包含一位丈夫、一位妻子及任意数量的子女。',
      'error.requiredField': '此栏位为必填。',
      'error.flightComplete': '请完整填写每个已添加的航班资料。',
      'error.flightDates': '请使用有效的DD/MM/YYYY格式填写航班日期。',
      'error.nomineeComplete': '请完整填写每位受益人的资料。',
      'error.nomineeTotal': '每位旅行者的受益人分配比例总和须为100%。',
      'error.detailsIncomplete': '部分必填资料尚未完成，请检查后再继续。',
      'error.consent': '请勾选同意声明后再提交。',
      'error.confirmIssues': '请先解决标示的确认问题后再提交。',

      /* Payment content HTML */
      'paymentContent.duitnow': "<strong>DuitNow QR</strong><p>扫描 Henry 的 QR 码，并在提交前上传付款截图，方便他更快核实付款。</p><img src=\"/duitnow-qr.png\" alt=\"DuitNow QR\">",
      'paymentContent.tng': "<strong>Touch 'n Go</strong><p>转账至 <b>LEE MOU YEN</b>，号码 <b>012 612 3540</b>。付款后请上传截图。</p>",
      'paymentContent.bank': "<strong>RHB 银行转账</strong><p>账户名称 <b>LEE MOU YEN</b><br>账户号码 <b>1040 2700 307120</b><br>请附上付款收据，方便 Henry 更快跟进。</p>",
      'paymentContent.billplz': "<strong>Billplz 信用卡付款</strong><p>提交后 Henry 会发送付款链接。信用卡手续费为 2%，此阶段无需上传付款收据。</p>",
    }
  };

  /* ----------------------------------------------------------
     Core state
  ---------------------------------------------------------- */
  var currentLang = 'en';

  function detectLang() {
    try {
      var stored = localStorage.getItem('hl-lang');
      if (stored === 'en' || stored === 'zh') return stored;
    } catch (e) {}
    var browser = ((navigator.language || navigator.userLanguage) || 'en').toLowerCase();
    return browser.startsWith('zh') ? 'zh' : 'en';
  }

  /* ----------------------------------------------------------
     t() — translate a key, optionally calling a function value
  ---------------------------------------------------------- */
  function t(key) {
    var args = Array.prototype.slice.call(arguments, 1);
    var strings = STRINGS[currentLang] || STRINGS.en;
    var val = (strings[key] !== undefined) ? strings[key] : (STRINGS.en[key] !== undefined ? STRINGS.en[key] : key);
    return (typeof val === 'function') ? val.apply(null, args) : val;
  }

  /* ----------------------------------------------------------
     applyLanguage() — sweep DOM + dispatch event for app.js
  ---------------------------------------------------------- */
  function applyLanguage() {
    var strings = STRINGS[currentLang] || STRINGS.en;
    document.documentElement.lang = (currentLang === 'zh') ? 'zh-Hans' : 'en';

    /* Static text nodes */
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = (strings[key] !== undefined) ? strings[key] : STRINGS.en[key];
      if (val !== undefined && typeof val !== 'function') {
        el.textContent = val;
      }
    });

    /* Placeholder attributes */
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var val = (strings[key] !== undefined) ? strings[key] : STRINGS.en[key];
      if (val && typeof val === 'string') el.placeholder = val;
    });

    /* Toggle button active state */
    var toggle = document.getElementById('langToggle');
    if (toggle) {
      toggle.querySelector('.lang-en').classList.toggle('lang-active', currentLang === 'en');
      toggle.querySelector('.lang-zh').classList.toggle('lang-active', currentLang === 'zh');
    }

    /* Tell app.js to re-render all dynamic sections */
    document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: currentLang } }));
  }

  /* ----------------------------------------------------------
     setLanguage() — public API
  ---------------------------------------------------------- */
  function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'zh') return;
    currentLang = lang;
    try { localStorage.setItem('hl-lang', lang); } catch (e) {}
    applyLanguage();
  }

  /* ----------------------------------------------------------
     Expose globally
  ---------------------------------------------------------- */
  window.t = t;
  window.setLanguage = setLanguage;
  window.getCurrentLang = function () { return currentLang; };

  /* ----------------------------------------------------------
     Bootstrap — detect language, inject toggle, apply on ready
  ---------------------------------------------------------- */
  currentLang = detectLang();

  function injectToggle() {
    if (document.getElementById('langToggle')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'langToggle';
    btn.className = 'lang-toggle';
    btn.setAttribute('aria-label', 'Switch language / 切换语言');
    btn.innerHTML = '<span class="lang-en' + (currentLang === 'en' ? ' lang-active' : '') + '">EN</span>' +
                    '<span class="lang-sep">|</span>' +
                    '<span class="lang-zh' + (currentLang === 'zh' ? ' lang-active' : '') + '">中</span>';
    btn.addEventListener('click', function () {
      setLanguage(currentLang === 'en' ? 'zh' : 'en');
    });
    document.body.appendChild(btn);
  }

  function init() {
    injectToggle();
    applyLanguage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
