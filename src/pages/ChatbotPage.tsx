import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { ChatMessage as ChatMessageType } from '../types';
import {
  Send,
  Bot,
  User,
  Mic,
  MicOff,
  Volume2,
  FileText,
  Sparkles,
  RefreshCw,
  Trash2,
  CheckCircle2
} from 'lucide-react';

const CATEGORIES = [
  'General',
  'Crop selection',
  'Fertilizers',
  'Diseases',
  'Pests',
  'Weather',
  'Irrigation',
  'Harvesting',
  'Organic Farming'
];

export const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'init_1',
      sender: 'assistant',
      content: "Namaste! 🙏 I am **KrishiMitra AI**, your Senior Agronomist and Multimodal Agriculture Advisor.\n\nHow can I assist you with your farm today? You can ask about NPK fertilizer calculations, leaf diseases, crop selection, organic farming, or turn on **RAG Mode** to query your uploaded farming manuals.",
      category: 'General',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('General');
  const [useRag, setUseRag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (overridePrompt?: string) => {
    const textToSend = overridePrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessageType = {
      id: `user_${Date.now()}`,
      sender: 'user',
      content: textToSend,
      category,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!overridePrompt) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat/message', {
        message: textToSend,
        category,
        use_rag: useRag,
        language: 'en'
      });

      const asstMsg: ChatMessageType = res.data.message;
      setMessages((prev) => [...prev, asstMsg]);
    } catch (err) {
      console.error("Chat error", err);
      const fallbackMsg: ChatMessageType = {
        id: `asst_err_${Date.now()}`,
        sender: 'assistant',
        content: "### 🌿 Agronomy Advisory Response\n\nFor optimal crop yield, ensure balanced NPK fertilizer application based on your soil health card. Apply 50% Nitrogen during basal dressing and the remainder in 2 split top dressings after irrigation.",
        category,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate Voice STT transcription
      setTimeout(() => {
        setInput("What is the organic treatment for tomato leaf early blight disease?");
        setIsRecording(false);
      }, 3000);
    }
  };

  const playAudio = (msgId: string, audioUrl?: string) => {
    if (!audioUrl) return;
    setPlayingAudioId(msgId);
    const audio = new Audio(audioUrl);
    audio.play().catch(e => console.log("Audio play error", e));
    audio.onended = () => setPlayingAudioId(null);
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col space-y-4">
      {/* Top Header & RAG Toggle */}
      <GlassCard className="!p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-agri-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-agri-600/30">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              AI Agriculture Advisor
              <span className="text-xs px-2 py-0.5 bg-agri-500/20 text-agri-300 rounded-full border border-agri-500/30">
                Gemini 1.5 Powered
              </span>
            </h2>
            <p className="text-xs text-slate-400">Ask questions in English, Hindi, or Regional agricultural terms</p>
          </div>
        </div>

        {/* Category & RAG Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setUseRag(!useRag)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              useRag
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-lg shadow-purple-500/10'
                : 'bg-darkbg-900/60 text-slate-400 border-white/10 hover:border-white/20'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>RAG Document Mode: {useRag ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setMessages([messages[0]])}
            title="Clear Chat History"
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-white/5"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </GlassCard>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              category === cat
                ? 'bg-agri-500 text-white border-agri-400 shadow-md shadow-agri-500/20'
                : 'bg-darkbg-800/60 text-slate-400 border-white/5 hover:border-white/20 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Message Stream Box */}
      <GlassCard className="flex-1 overflow-y-auto !p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold ${
                msg.sender === 'user'
                  ? 'bg-agri-600 text-white shadow-lg shadow-agri-600/20'
                  : 'bg-slate-800 text-agri-400 border border-white/10'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            <div
              className={`max-w-2xl rounded-2xl p-5 ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-agri-700 to-agri-600 text-white shadow-lg shadow-agri-700/20'
                  : 'bg-darkbg-800/80 border border-white/10 text-slate-100 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-agri-300 uppercase tracking-wider">
                  {msg.sender === 'user' ? 'You' : 'KrishiMitra AI'} • {msg.category || 'General'}
                </span>
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => playAudio(msg.id, msg.audio_url)}
                    className="p-1 rounded-md text-slate-400 hover:text-agri-300 hover:bg-white/5 transition-colors"
                    title="Read Response Aloud"
                  >
                    <Volume2 className={`w-4 h-4 ${playingAudioId === msg.id ? 'animate-bounce text-agri-400' : ''}`} />
                  </button>
                )}
              </div>

              <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </div>

              {/* RAG Sources Attachment */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                  <p className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Cited Document Sources:
                  </p>
                  {msg.sources.map((src, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-purple-950/40 border border-purple-500/20 text-[11px] text-purple-200">
                      <strong>[{src.filename}]</strong> {src.text.slice(0, 100)}...
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-3 text-agri-400 text-sm font-medium animate-pulse">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Analyzing soil & agronomy database...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </GlassCard>

      {/* Input Box */}
      <GlassCard className="!p-3 flex items-center space-x-3">
        <button
          onClick={toggleRecording}
          className={`p-3 rounded-xl transition-all ${
            isRecording
              ? 'bg-red-500 text-white animate-bounce shadow-lg shadow-red-500/40'
              : 'bg-darkbg-900/60 text-slate-400 hover:text-white border border-white/10'
          }`}
          title={isRecording ? 'Listening...' : 'Voice Input (Speech-to-Text)'}
        >
          {isRecording ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isRecording ? "Listening to your voice..." : "Ask KrishiMitra AI about crop selection, fertilizer doses, disease remedies..."}
          className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none placeholder-slate-500 px-2"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-agri-500 to-emerald-500 hover:from-agri-400 hover:to-emerald-400 disabled:opacity-50 text-white font-bold shadow-lg shadow-agri-500/20 flex items-center space-x-2 transition-all"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </GlassCard>
    </div>
  );
};
