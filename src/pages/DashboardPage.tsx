import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import {
  CloudSun,
  Bot,
  ScanSearch,
  FileText,
  Calendar,
  ArrowUpRight,
  Sparkles,
  ShieldAlert,
  Sprout
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        setData(res.data);
      } catch (e) {
        console.error("Dashboard load failed", e);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-agri-900/90 via-agri-800/80 to-emerald-900/60 border border-agri-500/30 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-agri-400 font-bold text-xs uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Smart Farming Intelligence Hub</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              Welcome back, {data?.user_name || 'Farmer'}! 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Your farm in <strong className="text-agri-300">{data?.district || 'Pune'}, {data?.state || 'Maharashtra'}</strong> is currently experiencing optimal growing conditions. Check today's AI advice below.
            </p>
          </div>

          <Link
            to="/chat"
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-agri-500 to-emerald-500 hover:from-agri-400 hover:to-emerald-400 text-white font-bold shadow-lg shadow-agri-500/30 transition-all hover:scale-105"
          >
            <Bot className="w-5 h-5" />
            <span>Ask KrishiMitra AI</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <GlassCard className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Crop Health Score</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{data?.stats?.health_score || '94% Healthy'}</h3>
            <span className="text-[11px] text-agri-400 font-medium">Optimal soil moisture</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-agri-500/10 border border-agri-500/20 flex items-center justify-center text-agri-400">
            <Sprout className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Scans Run</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{data?.stats?.disease_scans || 4} Leaf Scans</h3>
            <span className="text-[11px] text-slate-400">0 Critical outbreaks</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <ScanSearch className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Documents Indexed</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{data?.stats?.documents_indexed || 3} PDF/DOCX</h3>
            <span className="text-[11px] text-agri-400">RAG Vector DB Ready</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <FileText className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Tasks</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{data?.stats?.pending_calendar_tasks || 2} Due Today</h3>
            <span className="text-[11px] text-amber-400 font-medium">Wheat CRI Irrigation</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Calendar className="w-6 h-6" />
          </div>
        </GlassCard>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Intelligence Widget (2 cols) */}
        <GlassCard className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center space-x-3">
              <CloudSun className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Hyper-Local Weather Insights</h3>
                <p className="text-xs text-slate-400">{data?.district || 'Pune'}, {data?.state || 'Maharashtra'}</p>
              </div>
            </div>
            <Link to="/weather" className="text-xs font-bold text-agri-400 hover:text-agri-300 flex items-center">
              Detailed Forecast <ArrowUpRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-darkbg-900/60 p-4 rounded-2xl border border-white/5">
            <div>
              <p className="text-xs text-slate-400">Temperature</p>
              <p className="text-xl font-bold text-white mt-0.5">{data?.weather_widget?.temp || 29}°C</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Condition</p>
              <p className="text-sm font-semibold text-agri-300 mt-0.5">{data?.weather_widget?.condition || 'Sunny & Clear'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Humidity</p>
              <p className="text-xl font-bold text-white mt-0.5">{data?.weather_widget?.humidity || 62}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Rain Prob.</p>
              <p className="text-xl font-bold text-blue-400 mt-0.5">{data?.weather_widget?.rain_prob || 15}%</p>
            </div>
          </div>

          {/* AI Weather Tip Box */}
          <div className="p-4 rounded-2xl bg-agri-500/10 border border-agri-500/20 flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-agri-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-agri-300 uppercase tracking-wide">Agronomist Recommendation</h4>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                {data?.weather_widget?.tip || "☀️ Low rain forecast: Ideal window for applying foliar fertilizer and bio-pesticides."}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Quick Actions & Recent Chats (1 col) */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white">Recent AI Discussions</h3>
            <Link to="/chat" className="text-xs font-bold text-agri-400 hover:text-agri-300">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {(data?.recent_chats || [
              { id: 'c1', title: 'Best fertilizer dose for Wheat', category: 'Fertilizers', time: '2 hours ago' },
              { id: 'c2', title: 'Yellow spots on Tomato leaf', category: 'Diseases', time: 'Yesterday' }
            ]).map((chat: any) => (
              <div key={chat.id} className="p-3 rounded-xl bg-darkbg-900/60 border border-white/5 hover:border-agri-500/30 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="green">{chat.category}</Badge>
                  <span className="text-[10px] text-slate-500">{chat.time}</span>
                </div>
                <p className="text-xs font-medium text-slate-200 line-clamp-1">{chat.title}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Scans</h4>
            <Link
              to="/disease"
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-darkbg-700 border border-white/10 hover:border-agri-500/40 text-xs font-bold text-slate-200 transition-colors"
            >
              <ScanSearch className="w-4 h-4 text-agri-400" />
              <span>Scan Leaf Image for Disease</span>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
