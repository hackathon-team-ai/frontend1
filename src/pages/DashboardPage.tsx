import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  CloudSun, Bot, ScanSearch, FileText, Calendar,
  ArrowUpRight, Sparkles, Sprout, Landmark, BookOpen
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const { t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    api.get('/dashboard/summary')
      .then(r => setData(r.data))
      .catch(() => {/* use fallback values below */});
  }, []);

  const district = data?.district || user?.district || 'Your District';
  const state    = data?.state    || user?.state    || 'Your State';

  // Each stat card links to its feature page
  const statCards = [
    {
      label: t('crop_advisor'),
      value: data?.stats?.health_score || '94% Healthy',
      sub: 'Optimal soil moisture',
      icon: <Sprout className="w-6 h-6" />,
      color: 'agri',
      to: '/crop-advisor',
    },
    {
      label: t('disease_scan'),
      value: `${data?.stats?.disease_scans ?? 4} Scans`,
      sub: '0 Critical outbreaks',
      icon: <ScanSearch className="w-6 h-6" />,
      color: 'blue',
      to: '/disease',
    },
    {
      label: t('knowledge_base'),
      value: `${data?.stats?.documents_indexed ?? 3} PDF/DOCX`,
      sub: 'RAG Vector DB Ready',
      icon: <FileText className="w-6 h-6" />,
      color: 'purple',
      to: '/rag',
    },
    {
      label: t('calendar'),
      value: `${data?.stats?.pending_calendar_tasks ?? 2} Due Today`,
      sub: 'Tap to manage tasks',
      icon: <Calendar className="w-6 h-6" />,
      color: 'amber',
      to: '/calendar',
    },
  ];

  const colorMap: Record<string, string> = {
    agri:   'bg-agri-500/10 border-agri-500/20 text-agri-400',
    blue:   'bg-blue-500/10 border-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    amber:  'bg-amber-500/10 border-amber-500/20 text-amber-400',
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-agri-900/90 via-agri-800/80 to-emerald-900/60 border border-agri-500/30 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-agri-400 font-bold text-xs uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>{t('app_subtitle')}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              Welcome back, {data?.user_name || user?.full_name || 'Farmer'}! 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Your farm in <strong className="text-agri-300">{district}, {state}</strong> — check today's AI advice below.
            </p>
          </div>
          <Link
            to="/chat"
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-agri-500 to-emerald-500 hover:from-agri-400 hover:to-emerald-400 text-white font-bold shadow-lg shadow-agri-500/30 transition-all hover:scale-105"
          >
            <Bot className="w-5 h-5" />
            <span>{t('ai_advisor')}</span>
          </Link>
        </div>
      </div>

      {/* Stat Cards — each is a clickable Link */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map(card => (
          <Link key={card.to} to={card.to} className="block group">
            <GlassCard className="flex items-center justify-between h-full group-hover:border-white/20 transition-colors cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.label}</p>
                <h3 className="text-2xl font-extrabold text-white mt-1">{card.value}</h3>
                <span className="text-[11px] text-slate-400">{card.sub}</span>
              </div>
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0 ${colorMap[card.color]}`}>
                {card.icon}
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Widget */}
        <GlassCard className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center space-x-3">
              <CloudSun className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-lg font-bold text-white">{t('weather')}</h3>
                <p className="text-xs text-slate-400">{district}, {state}</p>
              </div>
            </div>
            <Link to="/weather" className="text-xs font-bold text-agri-400 hover:text-agri-300 flex items-center gap-1">
              Detailed Forecast <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-darkbg-900/60 p-4 rounded-2xl border border-white/5">
            {[
              { label: 'Temperature', value: `${data?.weather_widget?.temp ?? 29}°C` },
              { label: 'Condition',   value: data?.weather_widget?.condition ?? 'Sunny & Clear' },
              { label: 'Humidity',    value: `${data?.weather_widget?.humidity ?? 62}%` },
              { label: 'Rain Prob.',  value: `${data?.weather_widget?.rain_prob ?? 15}%` },
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="text-xl font-bold text-white mt-0.5 text-sm">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-agri-500/10 border border-agri-500/20 flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-agri-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-200 leading-relaxed">
              {data?.weather_widget?.tip ?? '☀️ Low rain forecast: Ideal window for applying foliar fertilizer and bio-pesticides.'}
            </p>
          </div>
        </GlassCard>

        {/* Quick Links + Recent Chats */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-base font-bold text-white">Recent AI Chats</h3>
            <Link to="/chat" className="text-xs font-bold text-agri-400 hover:text-agri-300">View All</Link>
          </div>

          <div className="space-y-2">
            {(data?.recent_chats ?? [
              { id: 'c1', title: 'Best fertilizer dose for Wheat', category: 'Fertilizers', time: '2h ago' },
              { id: 'c2', title: 'Yellow spots on Tomato leaf',    category: 'Diseases',    time: 'Yesterday' },
            ]).map((chat: any) => (
              <Link key={chat.id} to="/chat" className="block p-3 rounded-xl bg-darkbg-900/60 border border-white/5 hover:border-agri-500/30 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="green">{chat.category}</Badge>
                  <span className="text-[10px] text-slate-500">{chat.time}</span>
                </div>
                <p className="text-xs font-medium text-slate-200 line-clamp-1">{chat.title}</p>
              </Link>
            ))}
          </div>

          {/* Quick nav links */}
          <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2">
            {[
              { to: '/disease',     icon: <ScanSearch className="w-4 h-4" />, label: t('disease_scan') },
              { to: '/crop-advisor',icon: <Sprout className="w-4 h-4" />,    label: t('crop_advisor') },
              { to: '/schemes',     icon: <Landmark className="w-4 h-4" />,  label: t('schemes') },
              { to: '/rag',         icon: <BookOpen className="w-4 h-4" />,  label: t('knowledge_base') },
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-2 py-2 px-3 rounded-xl bg-darkbg-700 border border-white/10 hover:border-agri-500/40 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <span className="text-agri-400">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
