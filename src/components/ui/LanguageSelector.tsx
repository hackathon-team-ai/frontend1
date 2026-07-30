import React, { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, LANGUAGES, Language } from '../../context/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        title={t('select_language')}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-darkbg-700/60 border border-white/10 hover:border-agri-500/40 text-slate-300 hover:text-white transition-all text-xs font-medium"
      >
        <Globe className="w-3.5 h-3.5 text-agri-400" />
        <span className="hidden sm:inline">{current.nativeLabel}</span>
        <span className="sm:hidden">{current.flag}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-darkbg-800 border border-white/10 shadow-2xl shadow-black/50 z-50 overflow-hidden">
          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-white/5">
            {t('select_language')}
          </p>
          <div className="max-h-72 overflow-y-auto">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs hover:bg-white/5 transition-colors text-left ${
                  language === lang.code ? 'text-agri-400 font-bold bg-agri-500/10' : 'text-slate-300'
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span className="flex-1">{lang.nativeLabel}</span>
                <span className="text-slate-500">{lang.label}</span>
                {language === lang.code && (
                  <span className="w-1.5 h-1.5 rounded-full bg-agri-400 ml-1" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
