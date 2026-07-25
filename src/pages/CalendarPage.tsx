import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { CalendarTask } from '../types';
import { CalendarCheck, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    crop_name: 'Wheat (HD-2967)',
    stage: 'Irrigation',
    title: '',
    description: '',
    due_date: new Date().toISOString().split('T')[0],
    priority: 'Medium'
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/calendar');
      setTasks(res.data);
    } catch (e) {
      console.error("Task fetch error", e);
    }
  };

  const handleToggle = async (taskId: string) => {
    try {
      const res = await api.patch(`/calendar/${taskId}/toggle`);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
    } catch (e) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
      );
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/calendar', form);
      setTasks((prev) => [...prev, res.data]);
      setShowModal(false);
      setForm({ ...form, title: '', description: '' });
    } catch (e) {
      console.error("Create task error", e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
            <CalendarCheck className="w-8 h-8 text-amber-400" />
            Smart Farming Seasonal Calendar
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Automated schedule recommendations for crop stages: Sowing, Crown Root Irrigation, Fertilizer Top-Dressing, and Harvest.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-agri-500 hover:bg-agri-400 text-white font-bold text-xs shadow-lg shadow-agri-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Task List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <GlassCard
            key={task.id}
            className={`flex items-start justify-between space-x-4 border transition-all ${
              task.completed ? 'opacity-60 border-white/5' : 'border-agri-500/30'
            }`}
          >
            <div className="flex items-start space-x-3">
              <button
                onClick={() => handleToggle(task.id)}
                className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                  task.completed
                    ? 'bg-agri-500 border-agri-400 text-white'
                    : 'border-white/30 hover:border-agri-400 text-transparent'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Badge variant={task.priority === 'High' ? 'red' : 'yellow'}>{task.stage}</Badge>
                  <span className="text-xs font-bold text-agri-300">{task.crop_name}</span>
                </div>
                <h3 className={`text-sm font-bold text-white ${task.completed ? 'line-through text-slate-400' : ''}`}>
                  {task.title}
                </h3>
                {task.description && <p className="text-xs text-slate-400 leading-relaxed">{task.description}</p>}
                <div className="flex items-center space-x-2 text-[10px] text-slate-500 pt-1">
                  <Clock className="w-3 h-3" />
                  <span>Due: {task.due_date}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <GlassCard className="max-w-md w-full space-y-4 !p-6 border-agri-500/30">
            <h3 className="text-lg font-bold text-white">Create Farming Task</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Crop Name</label>
                <input
                  type="text"
                  value={form.crop_name}
                  onChange={(e) => setForm({ ...form, crop_name: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Stage</label>
                <select
                  value={form.stage}
                  onChange={(e) => setForm({ ...form, stage: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5 bg-darkbg-900 text-white"
                >
                  <option value="Sowing">Sowing</option>
                  <option value="Irrigation">Irrigation</option>
                  <option value="Fertilizer">Fertilizer</option>
                  <option value="Pest Control">Pest Control</option>
                  <option value="Harvesting">Harvesting</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5"
                  placeholder="e.g. Apply 2nd Split Urea"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5 h-20"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-darkbg-700 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-agri-500 hover:bg-agri-400 text-white font-bold text-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
