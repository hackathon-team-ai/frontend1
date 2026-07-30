import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { RAGDocument } from '../types';
import {
  FileText, Upload, Search, Database,
  Sparkles, RefreshCw, BookOpen, AlertCircle, CheckCircle2, X
} from 'lucide-react';

export const KnowledgeBasePage: React.FC = () => {
  const [documents, setDocuments] = useState<RAGDocument[]>([]);
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadDocs(); }, []);

  const loadDocs = async () => {
    try {
      const res = await api.get('/rag/documents');
      setDocuments(Array.isArray(res.data) ? res.data : []);
    } catch {
      setDocuments([]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    // Client-side validation
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const allowedExt = ['.pdf', '.docx', '.txt'];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!allowed.includes(file.type) && !allowedExt.includes(ext)) {
      setUploadError('Only PDF, DOCX, and TXT files are supported.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError('File size must be under 20 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/rag/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000, // 60 s for large files
      });
      setDocuments(prev => [res.data, ...prev]);
      setUploadSuccess(`"${file.name}" indexed successfully!`);
    } catch (err: any) {
      const detail = err?.response?.data?.detail || err?.message || 'Upload failed. Please try again.';
      setUploadError(typeof detail === 'string' ? detail : JSON.stringify(detail));
    } finally {
      setUploading(false);
      // Reset file input so the same file can be re-uploaded if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await api.post('/rag/query', { query, top_k: 4 });
      setQueryResult(res.data);
    } catch {
      setQueryResult({
        answer: 'Could not retrieve answer. Ensure documents are uploaded and the backend is running.',
        sources: [],
      });
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
            <Database className="w-8 h-8 text-purple-400" />
            RAG Knowledge Base
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload agricultural PDFs, manuals, and guides. ChromaDB stores embeddings for semantic Q&amp;A.
          </p>
        </div>

        {/* Upload button */}
        <label className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg cursor-pointer transition-all select-none ${
          uploading
            ? 'bg-purple-800 opacity-70 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
        }`}>
          {uploading
            ? <><RefreshCw className="w-4 h-4 animate-spin" /><span>Processing…</span></>
            : <><Upload className="w-4 h-4" /><span>Upload PDF / DOCX / TXT</span></>
          }
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Upload feedback banners */}
      {uploadError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
          <span className="flex-1">{uploadError}</span>
          <button onClick={() => setUploadError('')}><X className="w-4 h-4 hover:text-white" /></button>
        </div>
      )}
      {uploadSuccess && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-agri-950/50 border border-agri-500/40 text-xs text-agri-300">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-agri-400" />
          <span className="flex-1">{uploadSuccess}</span>
          <button onClick={() => setUploadSuccess('')}><X className="w-4 h-4 hover:text-white" /></button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Search Panel */}
        <GlassCard className="lg:col-span-7 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-purple-400" />
            Query Knowledge Database
          </h3>

          <div className="flex items-center space-x-2 glass-input p-2 rounded-2xl">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Ask anything from your uploaded documents..."
              className="bg-transparent border-none text-sm text-white focus:outline-none w-full px-2"
            />
            <button
              onClick={handleSearch}
              disabled={!query.trim() || searching}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-colors"
            >
              {searching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Retrieve</span>}
            </button>
          </div>

          {queryResult && (
            <div className="space-y-4 pt-2">
              <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-3">
                <div className="flex items-center space-x-2 text-purple-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Synthesized Answer</span>
                </div>
                <p className="text-sm text-slate-100 leading-relaxed whitespace-pre-wrap">{queryResult.answer}</p>
              </div>

              {queryResult.sources?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Source Matches</h4>
                  {queryResult.sources.map((src: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-darkbg-900/60 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-purple-300">📄 {src.filename}</span>
                        <Badge variant="purple">{Math.round((src.score ?? 0.88) * 100)}% Match</Badge>
                      </div>
                      <p className="text-xs text-slate-300 italic">"{src.text}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!queryResult && (
            <div className="text-center py-8 text-slate-500 text-xs">
              Type a question above and press Enter or click Retrieve.
            </div>
          )}
        </GlassCard>

        {/* Document Library */}
        <GlassCard className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-agri-400" />
              Indexed Documents
            </h3>
            <button onClick={loadDocs} title="Refresh" className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {documents.length > 0 ? documents.map(doc => (
              <div key={doc.id} className="p-3.5 rounded-xl bg-darkbg-900/60 border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-200 truncate">{doc.filename}</p>
                    <p className="text-[10px] text-slate-400">{doc.num_chunks} chunks · {doc.file_size_kb} KB</p>
                  </div>
                </div>
                <Badge variant="green">Indexed</Badge>
              </div>
            )) : (
              <div className="py-12 text-center space-y-2">
                <Database className="w-10 h-10 text-slate-700 mx-auto" />
                <p className="text-xs text-slate-500">No documents yet.</p>
                <p className="text-xs text-slate-600">Upload a PDF to start RAG Q&amp;A.</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
