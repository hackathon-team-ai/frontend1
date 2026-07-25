import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { SystemAnalytics } from '../types';
import { ShieldCheck, Users, Bot, ScanSearch, FileText, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#14b8a6'];

export const AdminPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<SystemAnalytics | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resAnal, resUsers] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users')
      ]);
      setAnalytics(resAnal.data);
      setUsers(resUsers.data);
    } catch (e) {
      console.error("Admin load error", e);
    }
  };

  const pieData = analytics?.chat_category_breakdown
    ? Object.entries(analytics.chat_category_breakdown).map(([name, value]) => ({ name, value }))
    : [
        { name: 'Fertilizers', value: 340 },
        { name: 'Diseases', value: 280 },
        { name: 'Crop Selection', value: 220 },
        { name: 'Weather', value: 190 }
      ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-agri-400" />
          Admin Control & Analytics Center
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Monitor system metrics, user roles, Gemini API invocation trends, and leaf disease outbreaks across regions.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Registered Users</p>
            <h3 className="text-2xl font-extrabold text-white">{analytics?.total_users || 142}</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-agri-500/10 border border-agri-500/20 flex items-center justify-center text-agri-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Total AI Chats</p>
            <h3 className="text-2xl font-extrabold text-white">{analytics?.total_chats || 1240}</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ScanSearch className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Leaf Scans Run</p>
            <h3 className="text-2xl font-extrabold text-white">{analytics?.disease_scans || 312}</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Docs Indexed (RAG)</p>
            <h3 className="text-2xl font-extrabold text-white">{analytics?.documents_indexed || 85}</h3>
          </div>
        </GlassCard>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-white">Chat Category Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#121e17', borderColor: '#22c55e', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-white">Disease Detection Monthly Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.disease_detection_trends || [
                { month: 'Jan', 'Early Blight': 45, 'Yellow Rust': 20 },
                { month: 'Feb', 'Early Blight': 55, 'Yellow Rust': 35 },
                { month: 'Mar', 'Early Blight': 70, 'Yellow Rust': 50 }
              ]}>
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#121e17', borderColor: '#22c55e', borderRadius: '12px' }} />
                <Bar dataKey="Early Blight" fill="#ef4444" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Yellow Rust" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* User Management Table */}
      <GlassCard className="space-y-4">
        <h3 className="text-base font-bold text-white">User Accounts Directory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{u.full_name}</td>
                  <td className="py-3 px-4 text-slate-300">{u.email}</td>
                  <td className="py-3 px-4">
                    <Badge variant={u.role === 'admin' ? 'purple' : 'green'}>{u.role}</Badge>
                  </td>
                  <td className="py-3 px-4">{u.district}, {u.state}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
