import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { GovernmentScheme } from '../types';
import { Landmark, Search, ExternalLink, CheckCircle, FileCheck, Shield } from 'lucide-react';

export const SchemesPage: React.FC = () => {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [search, setSearch] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);

  useEffect(() => {
    fetchSchemes();
  }, [search]);

  const fetchSchemes = async () => {
    try {
      const res = await api.get(`/schemes?search=${encodeURIComponent(search)}`);
      setSchemes(res.data);
    } catch (e) {
      console.error("Schemes fetch error", e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
          <Landmark className="w-8 h-8 text-emerald-400" />
          Government Schemes & Subsidies Directory
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore direct income support, crop insurance, solar pumps, and machinery subsidies provided by the Ministry of Agriculture.
        </p>
      </div>

      {/* Search Input */}
      <div className="flex items-center space-x-3 glass-input p-3 rounded-2xl max-w-xl">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search schemes (e.g. PM-KISAN, Insurance, KCC loan)..."
          className="bg-transparent border-none text-sm text-white focus:outline-none w-full placeholder-slate-500"
        />
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map((scheme) => (
          <GlassCard key={scheme.id} className="flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="green">{scheme.category}</Badge>
                <span className="text-[10px] text-slate-400 font-semibold">{scheme.ministry}</span>
              </div>

              <h3 className="text-base font-extrabold text-white line-clamp-2">{scheme.title}</h3>
              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{scheme.description}</p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setSelectedScheme(scheme)}
                className="text-xs font-bold text-agri-400 hover:text-agri-300"
              >
                View Eligibility & Documents
              </button>
              <a
                href={scheme.application_link}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-agri-500/10 text-agri-300 hover:bg-agri-500/20"
                title="Open Official Portal"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Modal Detail View */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <GlassCard className="max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6 !p-6 border-agri-500/30">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <Badge variant="green" className="mb-2">{selectedScheme.category}</Badge>
                <h2 className="text-xl font-extrabold text-white">{selectedScheme.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{selectedScheme.ministry}</p>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-agri-400" /> Eligibility Criteria
                </h4>
                <ul className="space-y-1.5 pl-2">
                  {selectedScheme.eligibility.map((e, i) => (
                    <li key={i} className="text-slate-200 flex items-start space-x-2">
                      <CheckCircle className="w-3.5 h-3.5 text-agri-400 mt-0.5 flex-shrink-0" />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-purple-400" /> Mandatory Required Documents
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedScheme.required_documents.map((d, i) => (
                    <div key={i} className="p-2 rounded-lg bg-darkbg-900/80 border border-white/5 text-slate-200">
                      📄 {d}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedScheme(null)}
                className="px-4 py-2 rounded-xl bg-darkbg-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <a
                href={selectedScheme.application_link}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 rounded-xl bg-agri-500 hover:bg-agri-400 text-white font-bold text-xs flex items-center space-x-2"
              >
                <span>Apply on Govt Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
