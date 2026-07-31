import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Bot, FileText, ScanSearch,
  CloudSun, Sprout, Landmark, CalendarCheck,
  ShieldCheck, UserCheck, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface SidebarProps {
  onNavClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavClick }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { name: t('dashboard'),      path: '/',            icon: LayoutDashboard },
    { name: t('ai_advisor'),     path: '/chat',         icon: Bot },
    { name: t('disease_scan'),   path: '/disease',      icon: ScanSearch },
    { name: t('crop_advisor'),   path: '/crop-advisor', icon: Sprout },
    { name: t('weather'),        path: '/weather',      icon: CloudSun },
    { name: t('schemes'),        path: '/schemes',      icon: Landmark },
    { name: t('calendar'),       path: '/calendar',     icon: CalendarCheck },
    { name: t('knowledge_base'), path: '/rag',          icon: FileText },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: t('admin_panel'), path: '/admin', icon: ShieldCheck });
  }

  return (
    <aside className="w-64 h-full bg-darkbg-800/95 border-r border-white/10 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      {/* Close button — mobile only */}
      <div>
        <div className="flex items-center justify-between mb-3 md:hidden">
          <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
            Menu
          </p>
          <button onClick={onNavClick} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="hidden md:block px-3 text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-3">
          {t('core_navigation')}
        </p>

        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onNavClick}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-agri-600 to-agri-500 text-white shadow-lg shadow-agri-600/20 font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-br from-agri-950/80 to-darkbg-900 border border-agri-500/20">
        <div className="flex items-center space-x-2 text-agri-400 font-bold text-xs mb-1">
          <UserCheck className="w-4 h-4" />
          <span>Multimodal AI Active</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          Gemini Vision · ChromaDB · 10 Languages
        </p>
      </div>
    </aside>
  );
};
