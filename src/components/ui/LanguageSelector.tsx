import React from 'react';
import { useLanguage, Language } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const options: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'Simple English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी', flag: '🚩' },
  ];

  return (
    <div className="relative flex items-center bg-slate-800/80 border border-agri-500/30 rounded-xl px-2.5 py-1 space-x-1.5 shadow-sm">
      <Globe className="w-4 h-4 text-agri-400" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-transparent text-xs font-semibold text-slate-100 cursor-pointer focus:outline-none focus:ring-0 pr-1 py-1"
      >
        {options.map((opt) => (
          <option key={opt.code} value={opt.code} className="bg-slate-900 text-slate-200">
            {opt.flag} {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
