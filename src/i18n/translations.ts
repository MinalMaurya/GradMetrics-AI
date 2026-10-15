export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'ta' | 'te';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  provenancePilotBadge: string;
  provenanceCustomBadge: string;
  provenancePopoverTitle: string;
  provenancePopoverDesc: string;

  // Header Nav
  ingestDataBtn: string;
  districtCompareBtn: string;
  policySimulatorBtn: string;
  exportReportBtn: string;
  apiDocsBtn: string;
  methodologyBtn: string;

  // KPIs
  kpiLabourDemand: string;
  kpiTrainedSupply: string;
  kpiNetGap: string;
  kpiCriticalShortages: string;
  kpiSevereOversupply: string;
  kpiDeficitRatio: string;

  // Filters
  filterState: string;
  filterDistrict: string;
  filterSector: string;
  filterOccupation: string;
  filterHorizon: string;
  allIndia: string;
  allDistricts: string;
  allSectors: string;
  allOccupations: string;
  resetFilters: string;
  oneClickDemo: string;

  // Early Warning
  earlyWarningTitle: string;
  earlyWarningSubtitle: string;
  criticalShortageTab: string;
  oversupplyTab: string;
  configureThresholdsBtn: string;
  filterToTradeBtn: string;
  viewDetailsBtn: string;
  whyAlertFired: string;
  planningDisclaimer: string;

  // Forecasting
  forecastTitle: string;
  forecastSubtitle: string;
  modelComparisonToggle: string;
  baselineModel: string;
  holtLinearModel: string;
  chronologicalSplitBadge: string;
  maeMetric: string;
  rmseMetric: string;
  mapeMetric: string;
  improvementMetric: string;

  // Ingestion Modal
  ingestionModalTitle: string;
  ingestionModalSubtitle: string;
  dropCsvHere: string;
  selectCsvFile: string;
  orPasteCsv: string;
  validRows: string;
  errorRows: string;
  applyDatasetBtn: string;
  resetPilotBtn: string;
  sampleVacancyCsv: string;
  sampleCapacityCsv: string;
  sampleIntegratedCsv: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'Labour Market Intelligence Engine',
    appSubtitle: 'State, District & Sectoral Skill Demand-Supply Forecasting System',
    provenancePilotBadge: 'Pilot Research Benchmark (Calibrated)',
    provenanceCustomBadge: 'Custom Ingested Data (Verified)',
    provenancePopoverTitle: 'Data Provenance & Assurance',
    provenancePopoverDesc: 'All figures derive from underlying micro-records. Pilot data calibrated against official state benchmarks (FY 2022-2026). No unverified live government APIs claimed.',
    ingestDataBtn: 'Ingest CSV Data',
    districtCompareBtn: 'District Compare',
    policySimulatorBtn: 'Simulate Policy',
    exportReportBtn: 'Export Dossier',
    apiDocsBtn: 'API Gateway',
    methodologyBtn: 'Methodology & Data',
    kpiLabourDemand: 'Projected Job Demand',
    kpiTrainedSupply: 'Estimated Trained Supply',
    kpiNetGap: 'Net Skill Gap (Deficit)',
    kpiCriticalShortages: 'Critical Shortages',
    kpiSevereOversupply: 'Potential Oversupply',
    kpiDeficitRatio: 'Deficit Ratio',
    filterState: 'Jurisdiction / State',
    filterDistrict: 'District',
    filterSector: 'Industry Sector',
    filterOccupation: 'Trade / Occupation',
    filterHorizon: 'Forecast Horizon',
    allIndia: 'All India',
    allDistricts: 'All Districts',
    allSectors: 'All Sectors',
    allOccupations: 'All Trades',
    resetFilters: 'Reset Filters',
    oneClickDemo: 'Load Demo Scenario',
    earlyWarningTitle: 'EARLY WARNING SIGNALS',
    earlyWarningSubtitle: 'Automated anomaly detection across trades and districts',
    criticalShortageTab: 'Shortage Alert',
    oversupplyTab: 'Oversupply Alert',
    configureThresholdsBtn: 'Tune Thresholds',
    filterToTradeBtn: 'Filter to this trade',
    viewDetailsBtn: 'View Details',
    whyAlertFired: 'Causal Explanation (Why Alert Triggered)',
    planningDisclaimer: 'Planning advisory only. Capacity recommendations are for institutional intake adjustments and do not guarantee individual employment outcomes.',
    forecastTitle: 'Longitudinal Demand & Supply Forecasting',
    forecastSubtitle: 'Chronological time-series model with holdout validation and prediction intervals',
    modelComparisonToggle: 'Model Comparison',
    baselineModel: 'Trailing Moving Average (Baseline)',
    holtLinearModel: "Holt's Linear Smoothing",
    chronologicalSplitBadge: 'Holdout Validated (FY 2025)',
    maeMetric: 'Mean Absolute Error (MAE)',
    rmseMetric: 'Root Mean Squared Error (RMSE)',
    mapeMetric: 'Mean Absolute % Error (MAPE)',
    improvementMetric: 'Gain over Baseline',
    ingestionModalTitle: 'Data Ingestion & Schema Normalisation',
    ingestionModalSubtitle: 'Upload job vacancy, training capacity, or candidate supply CSVs with automatic NCO-2015 mapping',
    dropCsvHere: 'Drop CSV file here or click to browse',
    selectCsvFile: 'Select CSV File',
    orPasteCsv: 'Or paste raw CSV text',
    validRows: 'Valid Records',
    errorRows: 'Schema Errors',
    applyDatasetBtn: 'Apply Dataset to Live Dashboard',
    resetPilotBtn: 'Restore Pilot Benchmark Dataset',
    sampleVacancyCsv: 'Sample Vacancy CSV',
    sampleCapacityCsv: 'Sample Capacity CSV',
    sampleIntegratedCsv: 'Sample Integrated LMI CSV'
  },
  hi: {
    appName: 'श्रम बाज़ार आसूचना एवं कौशल पूर्वानुमान इंजन',
    appSubtitle: 'राज्य, ज़िला एवं क्षेत्रवार कौशल मांग-आपूर्ति पूर्वानुमान प्रणाली',
    provenancePilotBadge: 'पायलट अनुसंधान बेंचमार्क (अंशांकित)',
    provenanceCustomBadge: 'कस्टम आयातित डेटा (सत्यापित)',
    provenancePopoverTitle: 'डेटा स्रोत और प्रामाणिकता',
    provenancePopoverDesc: 'सभी आंकड़े अंतर्निहित रिकॉर्ड्स से प्राप्त होते हैं। पायलट डेटा आधिकारिक बेंचमार्क (FY 2022-2026) के आधार पर कैलिब्रेटेड है।',
    ingestDataBtn: 'CSV डेटा आयात करें',
    districtCompareBtn: 'ज़िला तुलना',
    policySimulatorBtn: 'नीति सिमुलेशन',
    exportReportBtn: 'रिपोर्ट निर्यात करें',
    apiDocsBtn: 'API गेटवे',
    methodologyBtn: 'कार्यप्रणाली एवं डेटा',
    kpiLabourDemand: 'अनुमानित श्रम मांग',
    kpiTrainedSupply: 'प्रशिक्षित कार्यबल आपूर्ति',
    kpiNetGap: 'शुद्ध कौशल अंतराल (कमी)',
    kpiCriticalShortages: 'गंभीर कौशल कमी',
    kpiSevereOversupply: 'संभावित अतिरिक्त आपूर्ति',
    kpiDeficitRatio: 'घाटा अनुपात',
    filterState: 'राज्य / कार्यक्षेत्र',
    filterDistrict: 'ज़िला',
    filterSector: 'उद्योग क्षेत्र',
    filterOccupation: 'व्यवसाय / ट्रेड',
    filterHorizon: 'पूर्वानुमान अवधि',
    allIndia: 'संपूर्ण भारत',
    allDistricts: 'सभी ज़िले',
    allSectors: 'सभी क्षेत्र',
    allOccupations: 'सभी व्यवसाय',
    resetFilters: 'फ़िल्टर रीसेट करें',
    oneClickDemo: 'डेमो परिदृश्य लोड करें',
    earlyWarningTitle: 'पूर्व चेतावनी संकेत',
    earlyWarningSubtitle: 'व्यवसायों और ज़िलों में स्वचालित विसंगति पहचान',
    criticalShortageTab: 'कमी चेतावनी',
    oversupplyTab: 'अधिशेष चेतावनी',
    configureThresholdsBtn: 'सीमाएं समायोजित करें',
    filterToTradeBtn: 'इस व्यवसाय को फ़िल्टर करें',
    viewDetailsBtn: 'विवरण देखें',
    whyAlertFired: 'कारण व्याख्या (चेतावनी का कारण)',
    planningDisclaimer: 'केवल संस्थागत क्षमता योजना हेतु परामर्श। यह व्यक्तिगत रोजगार की गारंटी नहीं देता।',
    forecastTitle: 'दीर्घकालिक मांग एवं आपूर्ति पूर्वानुमान',
    forecastSubtitle: 'कालानुक्रमिक सत्यापन और अनिश्चितता अंतराल के साथ समय-श्रृंखला मॉडल',
    modelComparisonToggle: 'मॉडल तुलना',
    baselineModel: 'मूविंग एवरेज (बेसलाइन)',
    holtLinearModel: "होल्ट का रैखिक मॉडल",
    chronologicalSplitBadge: 'सत्यापित होल्डआउट (FY 2025)',
    maeMetric: 'माध्य निरपेक्ष त्रुटि (MAE)',
    rmseMetric: 'रूट मीन स्क्वेर्ड एरर (RMSE)',
    mapeMetric: 'माध्य निरपेक्ष प्रतिशत त्रुटि (MAPE)',
    improvementMetric: 'बेसलाइन से सुधार',
    ingestionModalTitle: 'डेटा आयात एवं स्कीमा मानकीकरण',
    ingestionModalSubtitle: 'स्वचालित NCO-2015 मैपिंग के साथ रिक्ति, प्रशिक्षण क्षमता या आपूर्ति CSV अपलोड करें',
    dropCsvHere: 'यहाँ CSV फ़ाइल छोड़ें या ब्राउज़ करें',
    selectCsvFile: 'CSV फ़ाइल चुनें',
    orPasteCsv: 'या कच्चा CSV टेक्स्ट पेस्ट करें',
    validRows: 'वैध रिकॉर्ड्स',
    errorRows: 'स्कीमा त्रुटियां',
    applyDatasetBtn: 'डैशबोर्ड पर डेटा लागू करें',
    resetPilotBtn: 'पायलट डेटा पुनर्स्थापित करें',
    sampleVacancyCsv: 'नमूना रिक्ति CSV',
    sampleCapacityCsv: 'नमूना क्षमता CSV',
    sampleIntegratedCsv: 'एकीकृत LMI नमूना CSV'
  },
  mr: {
    appName: 'कामगार बाजार बुद्धिमत्ता व कौशल्य अंदाज प्रणाली',
    appSubtitle: 'राज्य, जिल्हा आणि क्षेत्रनिहाय कौशल्य मागणी-पुरवठा अंदाज यंत्रणा',
    provenancePilotBadge: 'पायलट संशोधन बेंचमार्क (प्रमाणित)',
    provenanceCustomBadge: 'सानुकूल डेटा (पडताळणीकृत)',
    provenancePopoverTitle: 'डेटा उगम आणि विश्वसनीयता',
    provenancePopoverDesc: 'सर्व आकडे अंतर्निहित नोंदींवरून काढलेले आहेत. पायलट डेटा अधिकृत मानकांवर अंशांकित आहे.',
    ingestDataBtn: 'CSV डेटा आयात करा',
    districtCompareBtn: 'जिल्हा तुलना',
    policySimulatorBtn: 'धोरण सिम्युलेशन',
    exportReportBtn: 'अहवाल निर्यात करा',
    apiDocsBtn: 'API प्रवेशद्वार',
    methodologyBtn: 'पद्धती व डेटा',
    kpiLabourDemand: 'अपेक्षित रोजगार मागणी',
    kpiTrainedSupply: 'प्रशिक्षित कामगार पुरवठा',
    kpiNetGap: 'निव्वळ कौशल्य तूट',
    kpiCriticalShortages: 'गंभीर कौशल्य टंचाई',
    kpiSevereOversupply: 'अतिरिक्त पुरवठा धोका',
    kpiDeficitRatio: 'तूट प्रमाण',
    filterState: 'राज्य / अधिकारक्षेत्र',
    filterDistrict: 'जिल्हा',
    filterSector: 'उद्योग क्षेत्र',
    filterOccupation: 'व्यवसाय / ट्रेड',
    filterHorizon: 'अंदाज कालावधी',
    allIndia: 'संपूर्ण भारत',
    allDistricts: 'सर्व जिल्हे',
    allSectors: 'सर्व क्षेत्रे',
    allOccupations: 'सर्व व्यवसाय',
    resetFilters: 'फिल्टर रीसेट करा',
    oneClickDemo: 'डेमो परिस्थिती लोड करा',
    earlyWarningTitle: 'पूर्वसूचना चेतावणी संकेत',
    earlyWarningSubtitle: 'व्यवसाय व जिल्ह्यांमध्ये स्वयंचलित विसंगती शोध',
    criticalShortageTab: 'टंचाई इशारा',
    oversupplyTab: 'अधिशेष इशारा',
    configureThresholdsBtn: 'मर्यादा निश्चित करा',
    filterToTradeBtn: 'या व्यवसायानुसार फिल्टर करा',
    viewDetailsBtn: 'तपशील पहा',
    whyAlertFired: 'कारणात्मक स्पष्टीकरण (इशारा का आला)',
    planningDisclaimer: 'केवळ संस्थात्मक क्षमता नियोजनासाठी सल्लागार सूचना. वैयक्तिक रोजगाराची हमी नाही.',
    forecastTitle: 'मागणी व पुरवठा दीर्घकालीन अंदाज',
    forecastSubtitle: 'कालक्रमानुसार प्रमाणित टाइम-सीरिज मॉडेल',
    modelComparisonToggle: 'मॉडेल तुलना',
    baselineModel: 'मूव्हिंग सरासरी (मूळ मॉडेल)',
    holtLinearModel: 'होल्टचे लिनिअर मॉडेल',
    chronologicalSplitBadge: 'प्रमाणित होल्डआउट (FY 2025)',
    maeMetric: 'सरासरी निरपेक्ष त्रुटी (MAE)',
    rmseMetric: 'रूट मीन स्क्वेर्ड त्रुटी (RMSE)',
    mapeMetric: 'सरासरी टक्केवारी त्रुटी (MAPE)',
    improvementMetric: 'मूळ मॉडेलपेक्षा सुधारणा',
    ingestionModalTitle: 'डेटा अंतर्ग्रहण व NCO मानकीकरण',
    ingestionModalSubtitle: 'NCO-2015 मॅपिंगसह रिक्त पदे व प्रशिक्षण क्षमता CSV अपलोड करा',
    dropCsvHere: 'येथे CSV फाइल टाका किंवा निवडा',
    selectCsvFile: 'CSV फाइल निवडा',
    orPasteCsv: 'किंवा CSV मजकूर पेस्ट करा',
    validRows: 'वैध नोंदी',
    errorRows: 'त्रुटी नोंदी',
    applyDatasetBtn: 'डॅशबोर्डवर डेटा लागू करा',
    resetPilotBtn: 'पायलट डेटा पूर्ववत करा',
    sampleVacancyCsv: 'नमुना रिक्त पदे CSV',
    sampleCapacityCsv: 'नमुना क्षमता CSV',
    sampleIntegratedCsv: 'एकात्मिक LMI नमुना CSV'
  },
  ta: {
    appName: 'தொழிலாளர் சந்தை நுண்ணறிவு மற்றும் திறன் முன்கணிப்பு இயந்திரம்',
    appSubtitle: 'மாநில, மாவட்ட மற்றும் துறைசார் திறன் தேவை-வழங்கல் முன்கணிப்பு அமைப்பு',
    provenancePilotBadge: 'பைலட் ஆராய்ச்சி அளவுகோல் (அளவீடு செய்யப்பட்டது)',
    provenanceCustomBadge: 'பதிவேற்றப்பட்ட தரவு (சரிபார்க்கப்பட்டது)',
    provenancePopoverTitle: 'தரவு ஆதாரம் மற்றும் உறுதிப்படுத்தல்',
    provenancePopoverDesc: 'அனைத்து புள்ளிவிவரங்களும் உண்மையான பதிவுகளிலிருந்து கணக்கிடப்படுகின்றன.',
    ingestDataBtn: 'CSV தரவைப் பதிவேற்றவும்',
    districtCompareBtn: 'மாவட்ட ஒப்பீடு',
    policySimulatorBtn: 'கொள்கை உருவகப்படுத்துதல்',
    exportReportBtn: 'அறிக்கையை ஏற்றுமதி செய்',
    apiDocsBtn: 'API நுழைவாயில்',
    methodologyBtn: 'முறை மற்றும் தரவு',
    kpiLabourDemand: 'எதிர்பார்க்கப்படும் வேலை தேவை',
    kpiTrainedSupply: 'பயிற்சி பெற்ற பணியாளர் வழங்கல்',
    kpiNetGap: 'நிகர திறன் இடைவெளி (பற்றாக்குறை)',
    kpiCriticalShortages: 'கடுமையான பற்றாக்குறை',
    kpiSevereOversupply: 'சாத்தியமான அதிகப்படியான வழங்கல்',
    kpiDeficitRatio: 'பற்றாக்குறை விகிதம்',
    filterState: 'மாநிலம் / எல்லை',
    filterDistrict: 'மாவட்டம்',
    filterSector: 'தொழில் துறை',
    filterOccupation: 'தொழில் / வர்த்தகம்',
    filterHorizon: 'முன்கணிப்பு காலம்',
    allIndia: 'இந்தியா முழுவதும்',
    allDistricts: 'அனைத்து மாவட்டங்கள்',
    allSectors: 'அனைத்து துறைகள்',
    allOccupations: 'அனைத்து தொழில்கள்',
    resetFilters: 'வடிப்பான்களை மீட்டமைக்கவும்',
    oneClickDemo: 'மாதிரி காட்சியை ஏற்றவும்',
    earlyWarningTitle: 'முன் எச்சரிக்கை சமிக்ஞைகள்',
    earlyWarningSubtitle: 'தானியங்கி முரண்பாடுகளைக் கண்டறிதல்',
    criticalShortageTab: 'பற்றாக்குறை எச்சரிக்கை',
    oversupplyTab: 'மிகை வழங்கல் எச்சரிக்கை',
    configureThresholdsBtn: 'வரம்புகளை மாற்றவும்',
    filterToTradeBtn: 'இந்த தொழிலை வடிகட்டவும்',
    viewDetailsBtn: 'விவரங்களைக் காண்க',
    whyAlertFired: 'காரண விளக்கம் (எச்சரிக்கை தூண்டப்பட்டதற்கான காரணம்)',
    planningDisclaimer: 'நிறுவன திறன் திட்டமிடலுக்கான ஆலோசனை மட்டுமே. தனிப்பட்ட வேலை உத்தரவாதம் இல்லை.',
    forecastTitle: 'நீண்ட கால தேவை மற்றும் வழங்கல் முன்கணிப்பு',
    forecastSubtitle: 'காலவரிசை சரிபார்ப்புடன் கூடிய மாதிரி',
    modelComparisonToggle: 'மாதிரி ஒப்பீடு',
    baselineModel: 'நகரும் சராசரி (அடிப்படை)',
    holtLinearModel: 'ஹோல்ட்டின் நேரியல் மாதிரி',
    chronologicalSplitBadge: 'சரிபார்க்கப்பட்டது (FY 2025)',
    maeMetric: 'சராசரி பிழை (MAE)',
    rmseMetric: 'வர்க்க மூல பிழை (RMSE)',
    mapeMetric: 'சராசரி சதவீத பிழை (MAPE)',
    improvementMetric: 'அடிப்படைக்கு மேல் முன்னேற்றம்',
    ingestionModalTitle: 'தரவு உட்செலுத்துதல் மற்றும் இயல்பாக்கம்',
    ingestionModalSubtitle: 'தானியங்கி NCO-2015 வரைபடத்துடன் கூடிய CSV கோப்புகளைப் பதிவேற்றவும்',
    dropCsvHere: 'CSV கோப்பை இங்கே விடவும் அல்லது கிளிக் செய்யவும்',
    selectCsvFile: 'CSV கோப்பைத் தேர்ந்தெடுக்கவும்',
    orPasteCsv: 'அல்லது CSV உரையை ஒட்டவும்',
    validRows: 'சரியான பதிவுகள்',
    errorRows: 'பிழை பதிவுகள்',
    applyDatasetBtn: 'டாஷ்போர்டில் தரவைப் பயன்படுத்துங்கள்',
    resetPilotBtn: 'பைலட் தரவை மீட்டமைக்கவும்',
    sampleVacancyCsv: 'மாதிரி காலிப்பணியிட CSV',
    sampleCapacityCsv: 'மாதிரி திறன் CSV',
    sampleIntegratedCsv: 'ஒருங்கிணைந்த LMI மாதிரி CSV'
  },
  te: {
    appName: 'లేబర్ మార్కెట్ ఇంటెలిజెన్స్ మరియు స్కిల్ ఫోర్‌కాస్టింగ్ ఇంజిన్',
    appSubtitle: 'రాష్ట్ర, జిల్లా మరియు రంగాలవారీ నైపుణ్య డిమాండ్-సరఫరా అంచనా వ్యవస్థ',
    provenancePilotBadge: 'పైలట్ రీసెర్చ్ బెంచ్‌మార్క్ (కాలిబ్రేట్ చేయబడింది)',
    provenanceCustomBadge: 'అప్‌లోడ్ చేసిన డేటా (ధృవీకరించబడింది)',
    provenancePopoverTitle: 'డేటా ప్రామాణికత మరియు ఆధారం',
    provenancePopoverDesc: 'అన్ని గణాంకాలు ప్రాథమిక రికార్డుల నుండి మాత్రమే తీసుకోబడ్డాయి.',
    ingestDataBtn: 'CSV డేటాను అప్‌లోడ్ చేయండి',
    districtCompareBtn: 'జిల్లాల పోలిక',
    policySimulatorBtn: 'విధాన అనుకరణ',
    exportReportBtn: 'నివేదికను డౌన్‌లోడ్ చేయండి',
    apiDocsBtn: 'API గేట్‌వే',
    methodologyBtn: 'విధానం మరియు డేటా',
    kpiLabourDemand: 'అంచనా వేసిన ఉద్యోగ డిమాండ్',
    kpiTrainedSupply: 'శిక్షణ పొందిన కార్మికుల సరఫరా',
    kpiNetGap: 'నికర నైపుణ్య లోటు',
    kpiCriticalShortages: 'తీవ్రమైన కొరత',
    kpiSevereOversupply: 'అధిక సరఫరా ముప్పు',
    kpiDeficitRatio: 'లోటు నిష్పత్తి',
    filterState: 'రాష్ట్రం / పరిధి',
    filterDistrict: 'జిల్లా',
    filterSector: 'పరిశ్రమ రంగం',
    filterOccupation: 'వృత్తి / ట్రేడ్',
    filterHorizon: 'అంచనా కాలం',
    allIndia: 'భారతదేశం మొత్తం',
    allDistricts: 'అన్ని జిల్లాలు',
    allSectors: 'అన్ని రంగాలు',
    allOccupations: 'అన్ని వృత్తులు',
    resetFilters: 'ఫిల్టర్లను రీసెట్ చేయండి',
    oneClickDemo: 'డెమో దృశ్యాన్ని లోడ్ చేయండి',
    earlyWarningTitle: 'ముందస్తు హెచ్చరిక సంకేతాలు',
    earlyWarningSubtitle: 'వృత్తులు మరియు జిల్లాలలో స్వయంచాలక విశ్లేషణ',
    criticalShortageTab: 'కొరత హెచ్చరిక',
    oversupplyTab: 'మిగులు హెచ్చరిక',
    configureThresholdsBtn: 'పరిమితులను సర్దుబాటు చేయండి',
    filterToTradeBtn: 'ఈ వృత్తికి ఫిల్టర్ చేయండి',
    viewDetailsBtn: 'వివరాలను వీక్షించండి',
    whyAlertFired: 'హెచ్చరికకు గల కారణం',
    planningDisclaimer: 'సంస్థాగత శిక్షణ ప్రణాళిక కోసం మాత్రమే సలహా. వ్యక్తిగత ఉద్యోగ హామీ కాదు.',
    forecastTitle: 'దీర్ఘకాలిక డిమాండ్ మరియు సరఫరా అంచనాలు',
    forecastSubtitle: 'సమయ-శ్రేణి మోడల్ మరియు అనిశ్చితి విరామాలు',
    modelComparisonToggle: 'మోడల్ పోలిక',
    baselineModel: 'మూవింగ్ యావరేజ్ (బేస్‌లైన్)',
    holtLinearModel: 'హోల్ట్స్ లీనియర్ మోడల్',
    chronologicalSplitBadge: 'ధృవీకరించబడిన హోల్డౌట్ (FY 2025)',
    maeMetric: 'సగటు సంపూర్ణ లోపం (MAE)',
    rmseMetric: 'రూట్ మీన్ స్క్వేర్డ్ లోపం (RMSE)',
    mapeMetric: 'సగటు శాతం లోపం (MAPE)',
    improvementMetric: 'బేస్‌లైన్ కంటే మెరుగుదల',
    ingestionModalTitle: 'డేటా ఇంజెషన్ మరియు NCO ప్రామాణీకరణ',
    ingestionModalSubtitle: 'NCO-2015 మ్యాపింగ్‌తో ఖాళీలు మరియు శిక్షణ సామర్థ్యం CSVలను అప్‌లోడ్ చేయండి',
    dropCsvHere: 'CSV ఫైల్‌ను ఇక్కడ వేయండి లేదా ఎంచుకోండి',
    selectCsvFile: 'CSV ఫైల్‌ను ఎంచుకోండి',
    orPasteCsv: 'లేదా ముడి CSV వచనాన్ని అతికించండి',
    validRows: 'చెల్లుబాటు అయ్యే రికార్డులు',
    errorRows: 'లోపం రికార్డులు',
    applyDatasetBtn: 'డాష్‌బోర్డ్‌లో డేటాను వర్తింపజేయండి',
    resetPilotBtn: 'పైలట్ డేటాను పునరుద్ధరించండి',
    sampleVacancyCsv: 'నమూనా ఖాళీల CSV',
    sampleCapacityCsv: 'నమూనా సామర్థ్యం CSV',
    sampleIntegratedCsv: 'సమగ్ర LMI నమూనా CSV'
  }
};

export function getTranslation(lang: SupportedLanguage = 'en'): TranslationDictionary {
  return translations[lang] || translations.en;
}
