import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../ui/LanguageSelector';
import { Sprout, Bell, LogOut, Search, CloudSun } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 h-16 bg-darkbg-800/80 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between">
      {/* Brand & Mobile Title */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-agri-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-agri-500/20">
          <Sprout className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-agri-400 bg-clip-text text-transparent">
            KrishiMitra AI
          </span>
          <span className="hidden md:inline-block ml-2 text-xs font-semibold px-2 py-0.5 bg-agri-500/20 text-agri-300 rounded-md border border-agri-500/30">
            {t('app_subtitle')}
          </span>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center w-72 glass-input rounded-xl px-3 py-1.5 space-x-2">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder={t('ask_search_placeholder')}
          className="bg-transparent border-none text-sm text-slate-200 focus:outline-none w-full placeholder-slate-500"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Language Switcher */}
        <LanguageSelector />

        <div className="hidden sm:flex items-center space-x-2 bg-slate-800/50 px-3 py-1 rounded-xl border border-white/5">
          <CloudSun className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-medium text-slate-300">Pune: 29°C</span>
        </div>

        <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-agri-500 rounded-full animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-agri-500 rounded-full" />
        </button>

        {/* User Pill */}
        <div className="flex items-center space-x-3 pl-3 border-l border-white/10">
          <div className="w-9 h-9 rounded-full bg-agri-700/50 border border-agri-400/40 flex items-center justify-center text-agri-300 font-bold">
            {user?.full_name?.charAt(0) || 'F'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-200">{user?.full_name || 'Farmer User'}</p>
            <p className="text-[10px] text-agri-400 capitalize">{user?.role || 'Farmer'}</p>
          </div>
          <button
            onClick={logout}
            title={t('logout')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
