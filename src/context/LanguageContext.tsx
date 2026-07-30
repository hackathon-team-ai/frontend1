import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'kn' | 'gu' | 'pa' | 'bn' | 'or';

export const LANGUAGES: { code: Language; label: string; nativeLabel: string; flag: string }[] = [
  { code: 'en', label: 'English',    nativeLabel: 'English',    flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi',      nativeLabel: 'हिंदी',      flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi',    nativeLabel: 'मराठी',      flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil',      nativeLabel: 'தமிழ்',      flag: '🇮🇳' },
  { code: 'te', label: 'Telugu',     nativeLabel: 'తెలుగు',     flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada',    nativeLabel: 'ಕನ್ನಡ',    flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati',   nativeLabel: 'ગુજરાતી',   flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi',    nativeLabel: 'ਪੰਜਾਬੀ',    flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali',    nativeLabel: 'বাংলা',      flag: '🇮🇳' },
  { code: 'or', label: 'Odia',       nativeLabel: 'ଓଡ଼ିଆ',      flag: '🇮🇳' },
];

type T = Record<Language, string>;

interface Translations { [key: string]: T }

export const translations: Translations = {
  // ── Navigation ─────────────────────────────────────────────────────────────
  dashboard: {
    en: 'Dashboard', hi: 'डैशबोर्ड', mr: 'डॅशबोर्ड',
    ta: 'டாஷ்போர்டு', te: 'డాష్‌బోర్డ్', kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    gu: 'ડેશબોર્ડ', pa: 'ਡੈਸ਼ਬੋਰਡ', bn: 'ড্যাশবোর্ড', or: 'ଡ୍ୟାଶବୋର୍ଡ',
  },
  ai_advisor: {
    en: 'AI Advisor', hi: 'एआई सलाहकार', mr: 'एआय सल्लागार',
    ta: 'AI ஆலோசகர்', te: 'AI సలహాదారు', kn: 'AI ಸಲಹೆಗಾರ',
    gu: 'AI સલાહકાર', pa: 'AI ਸਲਾਹਕਾਰ', bn: 'AI উপদেষ্টা', or: 'AI ପରାମର୍ଶଦାତା',
  },
  disease_scan: {
    en: 'Disease Scan', hi: 'फसल रोग जांच', mr: 'पिक रोग तपासणी',
    ta: 'நோய் கண்டறிதல்', te: 'వ్యాధి స్కాన్', kn: 'ರೋಗ ಸ್ಕ್ಯಾನ್',
    gu: 'રોગ સ્કેન', pa: 'ਬਿਮਾਰੀ ਸਕੈਨ', bn: 'রোগ স্ক্যান', or: 'ରୋଗ ସ୍କ୍ୟାନ',
  },
  weather: {
    en: 'Weather Forecast', hi: 'मौसम पूर्वानुमान', mr: 'हवामान अंदाज',
    ta: 'வானிலை முன்னறிவிப்பு', te: 'వాతావరణ అంచనా', kn: 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ',
    gu: 'હવામાન અંદાજ', pa: 'ਮੌਸਮ ਭਵਿੱਖਬਾਣੀ', bn: 'আবহাওয়ার পূর্বাভাস', or: 'ପାଣିପାଗ ପୂର୍ବାନୁମାନ',
  },
  crop_advisor: {
    en: 'Crop Advisor', hi: 'फसल सलाह', mr: 'पिक सल्लागार',
    ta: 'பயிர் ஆலோசகர்', te: 'పంట సలహాదారు', kn: 'ಬೆಳೆ ಸಲಹೆಗಾರ',
    gu: 'પાક સલાહકાર', pa: 'ਫਸਲ ਸਲਾਹਕਾਰ', bn: 'ফসল উপদেষ্টা', or: 'ଫସଲ ପରାମର୍ଶଦାତା',
  },
  schemes: {
    en: 'Govt Schemes', hi: 'सरकारी योजनाएं', mr: 'शासकीय योजना',
    ta: 'அரசு திட்டங்கள்', te: 'ప్రభుత్వ పథకాలు', kn: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
    gu: 'સરકારી યોજનાઓ', pa: 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ', bn: 'সরকারি প্রকল্প', or: 'ସରକାରୀ ଯୋଜନା',
  },
  calendar: {
    en: 'Farming Calendar', hi: 'कृषि कैलेंडर', mr: 'शेती कॅलेंडर',
    ta: 'விவசாய நாட்காட்டி', te: 'వ్యవసాయ క్యాలెండర్', kn: 'ಕೃಷಿ ಕ್ಯಾಲೆಂಡರ್',
    gu: 'ખેતી કેલેન્ડર', pa: 'ਖੇਤੀ ਕੈਲੰਡਰ', bn: 'চাষের ক্যালেন্ডার', or: 'ଚାଷ କ୍ୟାଲେଣ୍ଡର',
  },
  knowledge_base: {
    en: 'Knowledge Base', hi: 'ज्ञान केंद्र', mr: 'माहिती केंद्र',
    ta: 'அறிவு மையம்', te: 'జ్ఞాన కేంద్రం', kn: 'ಜ್ಞಾನ ಕೇಂದ್ರ',
    gu: 'જ્ઞાન કેન્દ્ર', pa: 'ਗਿਆਨ ਕੇਂਦਰ', bn: 'জ্ঞান কেন্দ্র', or: 'ଜ୍ଞାନ କେନ୍ଦ୍ର',
  },
  admin_panel: {
    en: 'Admin Panel', hi: 'एडमिन पैनल', mr: 'अ‍ॅडमिन पॅनेल',
    ta: 'நிர்வாக பலகை', te: 'అడ్మిన్ ప్యానెల్', kn: 'ಅಡ್ಮಿನ್ ಪ್ಯಾನಲ್',
    gu: 'એડ્મિન પેનલ', pa: 'ਐਡਮਿਨ ਪੈਨਲ', bn: 'অ্যাডমিন প্যানেল', or: 'ଆଡ୍ମିନ ପ୍ୟାନେଲ',
  },
  // ── General UI ──────────────────────────────────────────────────────────────
  app_subtitle: {
    en: 'Smart Agriculture AI', hi: 'स्मार्ट कृषि एआई', mr: 'स्मार्ट शेती एआय',
    ta: 'ஸ்மார்ட் விவசாய AI', te: 'స్మార్ట్ వ్యవసాయ AI', kn: 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ AI',
    gu: 'સ્માર્ટ કૃષિ AI', pa: 'ਸਮਾਰਟ ਖੇਤੀ AI', bn: 'স্মার্ট কৃষি AI', or: 'ସ୍ମାର୍ଟ କୃଷି AI',
  },
  select_language: {
    en: 'Select Language', hi: 'भाषा चुनें', mr: 'भाषा निवडा',
    ta: 'மொழி தேர்ந்தெடுக்கவும்', te: 'భాష ఎంచుకోండి', kn: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
    gu: 'ભાષા પસંદ કરો', pa: 'ਭਾਸ਼ਾ ਚੁਣੋ', bn: 'ভাষা নির্বাচন করুন', or: 'ଭାଷା ଚୟନ କରନ୍ତୁ',
  },
  logout: {
    en: 'Logout', hi: 'लॉगआउट', mr: 'लॉगआउट',
    ta: 'வெளியேறு', te: 'లాగ్అవుట్', kn: 'ಲಾಗ್ಔಟ್',
    gu: 'લૉગ આઉટ', pa: 'ਲੌਗ ਆਉਟ', bn: 'লগআউট', or: 'ଲଗଆଉଟ',
  },
  ask_search_placeholder: {
    en: 'Ask a farming question...', hi: 'कृषि प्रश्न पूछें...', mr: 'शेतीविषयक प्रश्न विचारा...',
    ta: 'விவசாய கேள்வி கேளுங்கள்...', te: 'వ్యవసాయ ప్రశ్న అడగండి...', kn: 'ಕೃಷಿ ಪ್ರಶ್ನೆ ಕೇಳಿ...',
    gu: 'ખેતી પ્રશ્ન પૂછો...', pa: 'ਖੇਤੀ ਸਵਾਲ ਪੁੱਛੋ...', bn: 'কৃষি প্রশ্ন জিজ্ঞাসা করুন...', or: 'କୃଷି ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ...',
  },
  core_navigation: {
    en: 'Core Navigation', hi: 'मुख्य नेविगेशन', mr: 'मुख्य नेव्हिगेशन',
    ta: 'முக்கிய வழிசெலுத்தல்', te: 'ప్రధాన నావిగేషన్', kn: 'ಮುಖ್ಯ ನ್ಯಾವಿಗೇಶನ್',
    gu: 'મુખ્ય નેવિગેશન', pa: 'ਮੁੱਖ ਨੈਵੀਗੇਸ਼ਨ', bn: 'মূল নেভিগেশন', or: 'ମୂଳ ନ୍ୟାଭିଗେସନ',
  },
  // ── Chatbot ──────────────────────────────────────────────────────────────────
  chatbot_title: {
    en: 'KrishiMitra AI Assistant', hi: 'कृषि मित्र एआई सहायक', mr: 'कृषीमित्र एआय सहाय्यक',
    ta: 'KrishiMitra AI உதவியாளர்', te: 'KrishiMitra AI సహాయకుడు', kn: 'KrishiMitra AI ಸಹಾಯಕ',
    gu: 'KrishiMitra AI સહાયક', pa: 'KrishiMitra AI ਸਹਾਇਕ', bn: 'KrishiMitra AI সহকারী', or: 'KrishiMitra AI ସହାୟକ',
  },
  chatbot_subtitle: {
    en: 'Ask farming questions in simple words', hi: 'सरल शब्दों में अपने कृषि प्रश्न पूछें', mr: 'सोप्या शब्दात तुमचे शेतीचे प्रश्न विचारा',
    ta: 'எளிய வார்த்தைகளில் விவசாய கேள்விகள் கேளுங்கள்', te: 'సాధారణ మాటలలో వ్యవసాయ ప్రశ్నలు అడగండి', kn: 'ಸರಳ ಮಾತುಗಳಲ್ಲಿ ಕೃಷಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ',
    gu: 'સરળ શબ્દોમાં ખેતી પ્રશ્નો પૂછો', pa: 'ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ ਖੇਤੀ ਪ੍ਰਸ਼ਨ ਪੁੱਛੋ', bn: 'সহজ কথায় চাষের প্রশ্ন জিজ্ঞেস করুন', or: 'ସରଳ ଶବ୍ଦରେ ଚାଷ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ',
  },
  type_message_placeholder: {
    en: 'Type your farming question here...', hi: 'अपना कृषि प्रश्न यहाँ लिखें...', mr: 'तुमचा शेतीचा प्रश्न येथे लिहा...',
    ta: 'உங்கள் விவசாய கேள்வியை இங்கே தட்டச்சு செய்யுங்கள்...', te: 'మీ వ్యవసాయ ప్రశ్నను ఇక్కడ టైప్ చేయండి...', kn: 'ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...',
    gu: 'તમારો ખેતી પ્રશ્ન અહીં ટાઇપ કરો...', pa: 'ਆਪਣਾ ਖੇਤੀ ਸਵਾਲ ਇੱਥੇ ਟਾਈਪ ਕਰੋ...', bn: 'আপনার চাষের প্রশ্ন এখানে টাইপ করুন...', or: 'ଆପଣଙ୍କ ଚାଷ ପ୍ରଶ୍ନ ଏଠାରେ ଟାଇପ୍ କରନ୍ତୁ...',
  },
  send: {
    en: 'Send', hi: 'भेजें', mr: 'पाठवा',
    ta: 'அனுப்பு', te: 'పంపు', kn: 'ಕಳುಹಿಸು',
    gu: 'મોકલો', pa: 'ਭੇਜੋ', bn: 'পাঠান', or: 'ପଠାନ୍ତୁ',
  },
  clear_chat: {
    en: 'Clear Chat', hi: 'चैट साफ़ करें', mr: 'चॅट साफ करा',
    ta: 'அரட்டையை அழி', te: 'చాట్ క్లియర్ చేయండి', kn: 'ಚಾಟ್ ತೆರವುಗೊಳಿಸಿ',
    gu: 'ચેટ સાફ કરો', pa: 'ਚੈਟ ਸਾਫ਼ ਕਰੋ', bn: 'চ্যাট পরিষ্কার করুন', or: 'ଚ୍ୟାଟ ସଫା କରନ୍ତୁ',
  },
  record_voice: {
    en: 'Voice Input', hi: 'आवाज से पूछें', mr: 'आवाजाने विचारा',
    ta: 'குரல் உள்ளீடு', te: 'వాయిస్ ఇన్‌పుట్', kn: 'ಧ್ವನಿ ಇನ್‌ಪುಟ್',
    gu: 'અવાજ ઇનપુટ', pa: 'ਆਵਾਜ਼ ਇਨਪੁਟ', bn: 'ভয়েস ইনপুট', or: 'ଭଏସ ଇନପୁଟ',
  },
  listening: {
    en: 'Listening...', hi: 'सुन रहा है...', mr: 'ऐकत आहे...',
    ta: 'கேட்கிறது...', te: 'వింటోంది...', kn: 'ಆಲಿಸುತ್ತಿದೆ...',
    gu: 'સાંભળી રહ્યું છે...', pa: 'ਸੁਣ ਰਿਹਾ ਹੈ...', bn: 'শুনছে...', or: 'ଶୁଣୁଛି...',
  },
  suggested_questions: {
    en: 'Suggested Questions:', hi: 'सुझाए गए प्रश्न:', mr: 'सुचवलेले प्रश्न:',
    ta: 'பரிந்துரைக்கப்பட்ட கேள்விகள்:', te: 'సూచించిన ప్రశ్నలు:', kn: 'ಸೂಚಿತ ಪ್ರಶ್ನೆಗಳು:',
    gu: 'સૂચિત પ્રશ્નો:', pa: 'ਸੁਝਾਏ ਗਏ ਸਵਾਲ:', bn: 'পরামর্শকৃত প্রশ্ন:', or: 'ପ୍ରସ୍ତାବିତ ପ୍ରଶ୍ନ:',
  },
};

// ── Context plumbing ──────────────────────────────────────────────────────────
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('krishi_language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('krishi_language', language);
    // Set lang attribute so browsers apply correct font rendering
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => setLanguageState(lang);

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
};
