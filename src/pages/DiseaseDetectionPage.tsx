import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { DiseaseReport } from '../types';
import {
  UploadCloud,
  ScanSearch,
  CheckCircle,
  AlertTriangle,
  Pill,
  ShieldCheck,
  Sparkles,
  FileImage,
  RefreshCw
} from 'lucide-react';

export const DiseaseDetectionPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [report, setReport] = useState<DiseaseReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setReport(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await api.post('/disease/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setReport(res.data);
    } catch (err) {
      console.error("Disease scan failed", err);
      setError('Analysis could not be completed. Ensure the backend is running and a valid Gemini API key is configured.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
          <ScanSearch className="w-8 h-8 text-agri-400" />
          AI Leaf Disease Diagnostics
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload a clear photograph of an infected plant leaf for automated Computer Vision analysis powered by Gemini 1.5 Flash Vision.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Dropzone Column (5 cols) */}
        <GlassCard className="lg:col-span-5 space-y-6">
          <h3 className="text-base font-bold text-white">Upload Plant Leaf Photo</h3>

          <div
            className="border-2 border-dashed border-white/20 hover:border-agri-500/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-darkbg-900/40 relative overflow-hidden"
            onClick={() => document.getElementById('leafInput')?.click()}
          >
            <input
              id="leafInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {previewUrl ? (
              <div className="space-y-3">
                <img
                  src={previewUrl}
                  alt="Leaf preview"
                  className="max-h-56 rounded-xl object-contain mx-auto shadow-md border border-white/10"
                />
                <p className="text-xs font-semibold text-agri-400">Click to change photo</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-agri-500/10 border border-agri-500/20 flex items-center justify-center text-agri-400 mx-auto">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">Drag & Drop or Click to Upload</p>
                  <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP (Max 10MB)</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-agri-500 to-emerald-500 hover:from-agri-400 hover:to-emerald-400 disabled:opacity-50 text-white font-bold shadow-lg shadow-agri-500/20 flex items-center justify-center space-x-2 transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Running Gemini Vision Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Run AI Diagnosis</span>
              </>
            )}
          </button>
        </GlassCard>

        {/* Diagnosis Report Output Column (7 cols) */}
        <div className="lg:col-span-7">
          {report ? (
            <GlassCard className="space-y-6">
              {/* Header result info */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={report.analysis.is_healthy ? 'green' : 'red'}>
                      {report.analysis.urgency_level} Risk Level
                    </Badge>
                    <span className="text-xs font-bold text-agri-400">
                      {report.analysis.confidence}% Confidence
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white mt-2">
                    {report.analysis.disease_name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Crop Type: <strong className="text-slate-200">{report.analysis.crop_type}</strong>
                  </p>
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Identified Symptoms
                </h4>
                <ul className="space-y-1.5 pl-2">
                  {report.analysis.symptoms.map((sym, i) => (
                    <li key={i} className="text-xs text-slate-200 flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chemical & Organic Treatments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Pill className="w-4 h-4" /> Recommended Chemical Spray
                  </h4>
                  <ul className="space-y-1 pl-1">
                    {report.analysis.treatment.chemical.map((chem, i) => (
                      <li key={i} className="text-xs text-slate-200">• {chem}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-agri-950/30 border border-agri-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-agri-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Organic / Bio Treatment
                  </h4>
                  <ul className="space-y-1 pl-1">
                    {report.analysis.treatment.organic.map((org, i) => (
                      <li key={i} className="text-xs text-slate-200">• {org}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Dosage & Prevention */}
              <div className="p-4 rounded-xl bg-darkbg-900/60 border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Prevention Protocols</h4>
                <ul className="space-y-1 pl-2">
                  {report.analysis.prevention.map((prev, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-center space-x-2">
                      <CheckCircle className="w-3.5 h-3.5 text-agri-400 flex-shrink-0" />
                      <span>{prev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          ) : error ? (
            <GlassCard className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <AlertTriangle className="w-16 h-16 mb-3 text-amber-400" />
              <p className="text-sm font-semibold text-slate-200">Analysis unavailable</p>
              <p className="text-xs max-w-sm mt-1">{error}</p>
            </GlassCard>
          ) : (
            <GlassCard className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-500">
              <ScanSearch className="w-16 h-16 opacity-30 mb-3 text-agri-400" />
              <p className="text-sm font-semibold text-slate-400">No Leaf Scanned Yet</p>
              <p className="text-xs max-w-sm mt-1">
                Upload a plant leaf photo on the left to generate a complete agronomic diagnosis report.
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};
