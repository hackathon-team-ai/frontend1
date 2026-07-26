import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'mr';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    mr: string;
  };
}

export const translations: Translations = {
  // Navigation
  dashboard: { en: "Dashboard", hi: "डैशबोर्ड", mr: "डॅशबोर्ड" },
  ai_advisor: { en: "AI Advisor", hi: "एआई सलाहकार", mr: "एआय सल्लागार" },
  disease_scan: { en: "Disease Scan", hi: "फसल रोग जांच", mr: "पिक रोग तपासणी" },
  weather: { en: "Weather Forecast", hi: "मौसम पूर्वानुमान", mr: "हवामान अंदाज" },
  crop_advisor: { en: "Crop Advisor", hi: "फसल सलाह", mr: "पिक सल्लागार" },
  schemes: { en: "Govt Schemes", hi: "सरकारी योजनाएं", mr: "शासकीय योजना" },
  calendar: { en: "Farming Calendar", hi: "कृषि कैलेंडर", mr: "शेती कॅलेंडर" },
  knowledge_base: { en: "Knowledge Base", hi: "ज्ञान केंद्र", mr: "माहिती केंद्र" },
  admin_panel: { en: "Admin Panel", hi: "एडमिन पैनल", mr: "अ‍ॅडमिन पॅनेल" },

  // General Header & Controls
  app_subtitle: { en: "Simple Agriculture AI", hi: "सरल कृषि एआई", mr: "सोपे शेती एआय" },
  ask_search_placeholder: { en: "Ask simple farming question...", hi: "कृषि प्रश्न पूछें...", mr: "शेतीविषयक प्रश्न विचारा..." },
  select_language: { en: "Select Language", hi: "भाषा चुनें", mr: "भाषा निवडा" },
  logout: { en: "Logout", hi: "लॉगआउट", mr: "लॉगआउट" },

  // Chatbot Page
  chatbot_title: { en: "KrishiMitra AI Assistant", hi: "कृषि मित्र एआई सहायक", mr: "कृषीमित्र एआय सहाय्यक" },
  chatbot_subtitle: { en: "Ask farming questions in simple words", hi: "सरल शब्दों में अपने कृषि प्रश्न पूछें", mr: "सोप्या शब्दात तुमचे शेतीचे प्रश्न विचारा" },
  type_message_placeholder: { en: "Type your farming question here...", hi: "अपना कृषि प्रश्न यहाँ लिखें...", mr: "तुमचा शेतीचा प्रश्न येथे लिहा..." },
  send: { en: "Send", hi: "भेजें", mr: "पाठवा" },
  clear_chat: { en: "Clear Chat", hi: "चैट साफ़ करें", mr: "चॅट साफ करा" },
  listening: { en: "Listening...", hi: "सुन रहा है...", mr: "ऐकत आहे..." },
  record_voice: { en: "Voice Input", hi: "आवाज से पूछें", mr: "आवाजाने विचारा" },
  suggested_questions: { en: "Suggested Questions:", hi: "सुझाए गए प्रश्न:", mr: "सुचवलेले प्रश्न:" },

  // Quick categories
  cat_general: { en: "General Farming", hi: "सामान्य खेती", mr: "सामान्य शेती" },
  cat_fertilizer: { en: "Fertilizer & Soil", hi: "खाद और मिट्टी", mr: "खत आणि माती" },
  cat_diseases: { en: "Crop Diseases", hi: "फसल की बीमारियां", mr: "पिकांवरील रोग" },
  cat_irrigation: { en: "Water & Irrigation", hi: "सिंचाई और पानी", mr: "सिंचन आणि पाणी" },
  cat_pests: { en: "Pest Control", hi: "कीट नियंत्रण", mr: "कीटक नियंत्रण" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const language: Language = 'en';

  const setLanguage = () => {};

  const t = (key: string): string => {
    if (translations[key] && translations[key]['en']) {
      return translations[key]['en'];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
