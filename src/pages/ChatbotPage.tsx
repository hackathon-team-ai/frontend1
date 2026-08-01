// ChatbotPage — multilingual AI farming assistant
// Supports voice input, RAG knowledge base, and 10 Indian languages
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { api } from '../services/api';
import { ChatMessage as ChatMessageType } from '../types';
import { useLanguage, Language } from '../context/LanguageContext';
import {
  Send, Bot, User, Mic, MicOff, Volume2,
  FileText, RefreshCw, Trash2, AlertCircle, Pencil, Check, X
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

// BCP-47 locale codes for Web Speech API per language
// Only locales confirmed supported in Chrome/Edge
const SPEECH_LOCALE: Record<Language, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  bn: 'bn-IN',
  or: 'hi-IN',  // Odia not supported by Chrome Speech API — fallback to Hindi
};

const CATEGORIES = [
  'General','Crop Selection','Fertilizers','Diseases',
  'Pests','Weather','Irrigation','Harvesting','Organic Farming',
];

const buildWelcome = (lang: Language) => {
  const msgs: Partial<Record<Language, string>> = {
    en: "Namaste! 🙏 I am **KrishiMitra AI**, your Senior Agronomist.\n\nAsk me about fertilizers, diseases, crop selection, organic farming, or enable **RAG Mode** to query your uploaded manuals.",
    hi: "नमस्ते! 🙏 मैं **KrishiMitra AI** हूँ, आपका वरिष्ठ कृषि विशेषज्ञ।\n\nखाद, रोग, फसल चयन, जैविक खेती के बारे में पूछें या **RAG Mode** चालू करके अपने अपलोड किए दस्तावेज़ क्वेरी करें।",
    mr: "नमस्कार! 🙏 मी **KrishiMitra AI** आहे, तुमचा वरिष्ठ कृषी सल्लागार।\n\nखत, रोग, पीक निवड, सेंद्रिय शेतीबद्दल विचारा किंवा **RAG Mode** चालू करा.",
    ta: "வணக்கம்! 🙏 நான் **KrishiMitra AI**, உங்கள் மூத்த வேளாண் ஆலோசகர்.\n\nஉரம், நோய், பயிர் தேர்வு, இயற்கை விவசாயம் பற்றி கேளுங்கள்.",
    te: "నమస్కారం! 🙏 నేను **KrishiMitra AI**, మీ వ్యవసాయ నిపుణుడు.\n\nఎరువులు, వ్యాధులు, పంట ఎంపిక గురించి అడగండి.",
    kn: "ನಮಸ್ಕಾರ! 🙏 ನಾನು **KrishiMitra AI**, ನಿಮ್ಮ ಕೃಷಿ ತಜ್ಞ.\n\nಗೊಬ್ಬರ, ರೋಗ, ಬೆಳೆ ಆಯ್ಕೆ ಬಗ್ಗೆ ಕೇಳಿ.",
    gu: "નમસ્તે! 🙏 હું **KrishiMitra AI** છું, તમારો કૃષિ નિષ્ણાત.\n\nખાતર, રોગ, પાક પસંદગી વિશે પૂછો.",
    pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! 🙏 ਮੈਂ **KrishiMitra AI** ਹਾਂ, ਤੁਹਾਡਾ ਖੇਤੀ ਮਾਹਰ।\n\nਖਾਦ, ਬਿਮਾਰੀਆਂ, ਫਸਲ ਚੋਣ ਬਾਰੇ ਪੁੱਛੋ।",
    bn: "নমস্কার! 🙏 আমি **KrishiMitra AI**, আপনার কৃষি বিশেষজ্ঞ।\n\nসার, রোগ, ফসল নির্বাচন সম্পর্কে জিজ্ঞেস করুন।",
    or: "ନମସ୍କାର! 🙏 ମୁଁ **KrishiMitra AI**, ଆପଣଙ୍କ କୃଷି ବିଶେଷଜ୍ଞ।\n\nସାର, ରୋଗ, ଫସଲ ଚୟନ ବିଷୟରେ ପଚାରନ୍ତୁ।",
  };
  return msgs[lang] || msgs.en!;
};

// Suggested quick questions per language
const QUICK_QUESTIONS: Partial<Record<Language, string[]>> = {
  en: ['Wheat NPK dose per acre', 'Tomato yellow leaf spots cure', 'Organic neem pest spray'],
  hi: ['गेहूँ के लिए NPK मात्रा', 'टमाटर पत्तियों पर पीले धब्बे', 'नीम जैविक कीटनाशक'],
  mr: ['गव्हासाठी NPK मात्रा', 'टमाटोच्या पानांवर पिवळे डाग', 'कडुनिंब सेंद्रिय फवारणी'],
  ta: ['கோதுமைக்கு NPK அளவு', 'தக்காளி இலை மஞ்சள் புள்ளி', 'வேப்பம் பூச்சி தடுப்பு'],
  te: ['గోధుమకు NPK మోతాదు', 'టమాటా ఆకు పసుపు మచ్చలు', 'వేప జీవ పురుగుల మందు'],
  kn: ['ಗೋಧಿ NPK ಪ್ರಮಾಣ', 'ಟೊಮೇಟೊ ಎಲೆ ಹಳದಿ ಕಲೆ', 'ಬೇವಿನ ಕೀಟನಾಶಕ'],
  gu: ['ઘઉં NPK ડોઝ', 'ટામેટા પાન પીળા ડાઘ', 'લીમડો જૈવ જંતુનાશક'],
  pa: ['ਕਣਕ NPK ਮਾਤਰਾ', 'ਟਮਾਟਰ ਪੱਤੇ ਪੀਲੇ ਧੱਬੇ', 'ਨਿੰਮ ਜੈਵਿਕ ਕੀਟਨਾਸ਼ਕ'],
  bn: ['গম NPK ডোজ', 'টমেটো হলুদ পাতার দাগ', 'নিম জৈব কীটনাশক'],
  or: ['ଗହମ NPK ମାତ୍ରା', 'ଟମାଟୋ ହଳଦିଆ ପତ୍ର ଦାଗ', 'ନିମ ଜୈବ କୀଟନାଶକ'],
};

export const ChatbotPage: React.FC = () => {
  const { t, language } = useLanguage();
  const location = useLocation();

  const makeWelcomeMsg = (lang: Language): ChatMessageType => ({
    id: 'init_1',
    sender: 'assistant',
    content: buildWelcome(lang),
    category: 'General',
    timestamp: new Date().toISOString(),
  });

  const [messages, setMessages] = useState<ChatMessageType[]>([makeWelcomeMsg(language)]);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('General');
  const [useRag, setUseRag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [micError, setMicError] = useState('');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // ── Edit state ───────────────────────────────────────────────────────────────
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  // Update welcome message when language changes
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'init_1') {
        return [makeWelcomeMsg(language)];
      }
      return prev;
    });
  }, [language]);

  // Pre-fill from navbar search
  useEffect(() => {
    const state = location.state as { prefill?: string } | null;
    if (state?.prefill) {
      setInput(state.prefill);
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ── Send message ────────────────────────────────────────────────────────────
  const handleSend = useCallback(async (overridePrompt?: string) => {
    const textToSend = (overridePrompt || input).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessageType = {
      id: `user_${Date.now()}`,
      sender: 'user',
      content: textToSend,
      category,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!overridePrompt) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat/message', {
        message: textToSend,
        category,
        use_rag: useRag,
        language,          // ← send the actual selected language, not hardcoded 'en'
      });

      const raw = res?.data?.message;
      const asstMsg: ChatMessageType = {
        id: raw?.id || `asst_${Date.now()}`,
        sender: 'assistant',
        content: raw?.content || 'I could not generate a response right now.',
        category: raw?.category || category,
        audio_url: raw?.audio_url,
        sources: raw?.sources || [],
        timestamp: raw?.timestamp || new Date().toISOString(),
      };
      setMessages(prev => [...prev, asstMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: `asst_err_${Date.now()}`,
        sender: 'assistant',
        content: '⚠️ Could not reach the server. Please check the backend connection and try again.',
        category,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, category, useRag, language, loading]);

  // ── Edit message ────────────────────────────────────────────────────────────
  const startEdit = (msg: ChatMessageType) => {
    setEditingMsgId(msg.id);
    setEditingText(msg.content);
    // Focus textarea after render
    setTimeout(() => editInputRef.current?.focus(), 50);
  };

  const cancelEdit = () => {
    setEditingMsgId(null);
    setEditingText('');
  };

  const confirmEdit = async (msgId: string) => {
    const newText = editingText.trim();
    if (!newText) return;

    // Find the index of the edited message
    const msgIndex = messages.findIndex(m => m.id === msgId);
    if (msgIndex === -1) return;

    // Update the user message text + remove all messages after it (old AI response)
    const updatedMessages = messages.slice(0, msgIndex);
    updatedMessages.push({
      ...messages[msgIndex],
      content: newText,
    });

    setMessages(updatedMessages);
    setEditingMsgId(null);
    setEditingText('');

    // Re-send the edited message to get a fresh AI response
    setLoading(true);
    try {
      const res = await api.post('/chat/message', {
        message: newText,
        category,
        use_rag: useRag,
        language,
      });
      const raw = res?.data?.message;
      const asstMsg: ChatMessageType = {
        id: raw?.id || `asst_${Date.now()}`,
        sender: 'assistant',
        content: raw?.content || 'I could not generate a response right now.',
        category: raw?.category || category,
        audio_url: raw?.audio_url,
        sources: raw?.sources || [],
        timestamp: raw?.timestamp || new Date().toISOString(),
      };
      setMessages(prev => [...prev, asstMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: `asst_err_${Date.now()}`,
        sender: 'assistant',
        content: '⚠️ Could not reach the server. Please try again.',
        category,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  // ── Web Speech API mic ───────────────────────────────────────────────────────
  // Keep a flag so onend knows whether to auto-restart after no-speech
  const shouldRestartRef = useRef(false);
  const finalTranscriptRef = useRef('');

  const startRecording = useCallback(() => {
    setMicError('');
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError('Voice input is not supported. Please use Chrome or Edge on desktop.');
      return;
    }

    const locale = SPEECH_LOCALE[language] || 'en-IN';
    finalTranscriptRef.current = '';

    const recognition = new SpeechRecognition();
    recognition.lang = locale;
    recognition.continuous = true;       // keep listening until user stops
    recognition.interimResults = true;   // show words as you speak
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      shouldRestartRef.current = true;
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = finalTranscriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }

      finalTranscriptRef.current = final;
      // Show final + interim combined in the input box
      setInput((final + interim).trim());
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        shouldRestartRef.current = false;
        setIsRecording(false);
        setMicError('Microphone access denied. Click the 🔒 icon in your browser address bar and allow microphone.');
      } else if (event.error === 'no-speech') {
        // Do NOT show error — just silently restart so user can keep trying
        // onend will handle restart via shouldRestartRef
      } else if (event.error === 'network') {
        shouldRestartRef.current = false;
        setIsRecording(false);
        setMicError('Network error during voice recognition. Please check your internet connection.');
      } else if (event.error === 'aborted') {
        // User or code stopped — ignore
      } else {
        shouldRestartRef.current = false;
        setIsRecording(false);
        setMicError(`Voice error: ${event.error}. Please try again.`);
      }
    };

    recognition.onend = () => {
      // Auto-restart if mic is still supposed to be on (handles no-speech timeout)
      if (shouldRestartRef.current) {
        try {
          recognition.start();
        } catch {
          setIsRecording(false);
          shouldRestartRef.current = false;
        }
      } else {
        setIsRecording(false);
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setMicError('Could not start voice recognition. Please refresh the page and try again.');
    }
  }, [language]);

  const stopRecording = useCallback(() => {
    shouldRestartRef.current = false;
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

  const toggleMic = () => {
    if (isRecording) {
      stopRecording();
      // If there's a final transcript, send it automatically
      if (finalTranscriptRef.current.trim()) {
        handleSend(finalTranscriptRef.current.trim());
        setInput('');
        finalTranscriptRef.current = '';
      }
    } else {
      startRecording();
    }
  };

  // ── Audio playback ──────────────────────────────────────────────────────────
  const playAudio = (msgId: string, audioUrl?: string) => {
    if (!audioUrl) return;
    setPlayingAudioId(msgId);
    const audio = new Audio(audioUrl);
    audio.play().catch(() => setPlayingAudioId(null));
    audio.onended = () => setPlayingAudioId(null);
  };

  const quickQuestions = QUICK_QUESTIONS[language] || QUICK_QUESTIONS.en!;

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col space-y-3">
      {/* Header */}
      <GlassCard className="!p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-agri-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-agri-600/30">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              {t('chatbot_title')}
              <span className="text-xs px-2 py-0.5 bg-agri-500/20 text-agri-300 rounded-full border border-agri-500/30">
                {language.toUpperCase()}
              </span>
            </h2>
            <p className="text-xs text-slate-400">{t('chatbot_subtitle')}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setUseRag(!useRag)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              useRag
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-darkbg-900/60 text-slate-400 border-white/10 hover:border-white/20'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>RAG: {useRag ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setMessages([makeWelcomeMsg(language)])}
            title={t('clear_chat')}
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </GlassCard>

      {/* Category pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => (
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

      {/* Quick questions — language-aware */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[11px] font-bold text-agri-400 whitespace-nowrap px-1">
          ⚡ {t('suggested_questions')}
        </span>
        {quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 rounded-lg bg-agri-950/60 text-agri-200 border border-agri-500/30 hover:bg-agri-500 hover:text-white transition-all whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Mic error banner */}
      {micError && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/50 border border-red-500/30 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{micError}</span>
          <button onClick={() => setMicError('')} className="ml-2 hover:text-white">✕</button>
        </div>
      )}

      {/* Message stream */}
      <GlassCard className="flex-1 overflow-y-auto !p-5 space-y-5 min-h-0">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 group ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold ${
              msg.sender === 'user'
                ? 'bg-agri-600 text-white shadow-lg shadow-agri-600/20'
                : 'bg-slate-800 text-agri-400 border border-white/10'
            }`}>
              {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-2xl rounded-2xl p-4 relative ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-agri-700 to-agri-600 text-white shadow-lg shadow-agri-700/20'
                : 'bg-darkbg-800/80 border border-white/10 text-slate-100 shadow-md'
            }`}>
              {/* Header row */}
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <span className="text-[10px] font-semibold text-agri-300 uppercase tracking-wider">
                  {msg.sender === 'user' ? 'You' : 'KrishiMitra AI'} · {msg.category || 'General'}
                </span>

                <div className="flex items-center gap-1">
                  {/* Audio play button (assistant only) */}
                  {msg.sender === 'assistant' && msg.audio_url && (
                    <button
                      onClick={() => playAudio(msg.id, msg.audio_url)}
                      className="p-1 rounded-md text-slate-400 hover:text-agri-300 hover:bg-white/5 transition-colors"
                      title="Play audio"
                    >
                      <Volume2 className={`w-4 h-4 ${playingAudioId === msg.id ? 'text-agri-400 animate-bounce' : ''}`} />
                    </button>
                  )}

                  {/* Edit button — only for user messages, not the welcome message */}
                  {msg.sender === 'user' && msg.id !== 'init_1' && editingMsgId !== msg.id && (
                    <button
                      onClick={() => startEdit(msg)}
                      className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                      title="Edit message"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Message content — show textarea when editing, text when not */}
              {editingMsgId === msg.id ? (
                <div className="space-y-2">
                  <textarea
                    ref={editInputRef}
                    value={editingText}
                    onChange={e => setEditingText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); confirmEdit(msg.id); }
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    rows={3}
                    className="w-full bg-agri-900/60 border border-agri-400/40 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-agri-400/50 resize-none"
                  />
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-[10px] text-white/50">Enter to save · Esc to cancel</span>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white/70 hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" /> Cancel
                    </button>
                    <button
                      onClick={() => confirmEdit(msg.id)}
                      disabled={!editingText.trim() || loading}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-agri-500 hover:bg-agri-400 disabled:opacity-40 text-xs text-white font-bold transition-colors"
                    >
                      <Check className="w-3 h-3" /> Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
              )}

              {/* RAG sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                  <p className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Sources:
                  </p>
                  {msg.sources.map((src: any, i: number) => (
                    <div key={i} className="p-2 rounded-lg bg-purple-950/40 border border-purple-500/20 text-[11px] text-purple-200">
                      <strong>[{src.filename}]</strong> {src.text?.slice(0, 100)}…
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
            <span>Thinking in {language.toUpperCase()}…</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </GlassCard>

      {/* Input box */}
      <GlassCard className="!p-3 flex items-center space-x-3">
        <button
          onClick={toggleMic}
          className={`p-3 rounded-xl transition-all flex-shrink-0 relative ${
            isRecording
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 ring-4 ring-red-500/30'
              : 'bg-darkbg-900/60 text-slate-400 hover:text-white border border-white/10 hover:border-agri-500/40'
          }`}
          title={isRecording ? 'Tap to stop & send' : t('record_voice')}
        >
          {isRecording ? <Mic className="w-5 h-5 animate-pulse" /> : <MicOff className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder={isRecording ? '🎙️ बोला... (Tap mic to stop & send)' : t('type_message_placeholder')}
          className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none placeholder-slate-500 px-2"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-agri-500 to-emerald-500 hover:from-agri-400 hover:to-emerald-400 disabled:opacity-40 text-white font-bold shadow-lg shadow-agri-500/20 flex items-center space-x-2 transition-all"
        >
          <span>{t('send')}</span>
          <Send className="w-4 h-4" />
        </button>
      </GlassCard>
    </div>
  );
};
