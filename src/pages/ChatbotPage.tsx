import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { ChatMessage as ChatMessageType } from '../types';
import { useLanguage } from '../context/LanguageContext';
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

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'mr', label: 'मराठी' }
];

const getWelcomeMessage = (language: string) => {
  if (language === 'mr') {
    return 'नमस्कार! 🙏 मी **KrishiMitra AI**, तुमचा शेती सल्लागार आहे. तुम्ही खत, पिकांचे रोग, सिंचन, पीक निवड किंवा सेंद्रिय शेतीबद्दल मराठीत प्रश्न विचारू शकता.';
  }
  if (language === 'hi') {
    return 'नमस्ते! 🙏 मैं **KrishiMitra AI**, आपका कृषि सलाहकार हूँ। आप उर्वरक, फसल रोग, सिंचाई, फसल चयन या जैविक खेती के बारे में हिंदी में पूछ सकते हैं।';
  }
  switch (language) {
    case 'hi':
      return 'नमस्ते! 🙏 मैं **KrishiMitra AI** हूँ, आपका Senior Agronomist और Multimodal Agriculture Advisor।\n\nआज आपकी खेती में मैं किस तरह मदद कर सकता हूँ? आप NPK उर्वरक, पत्ती रोग, फसल चयन, जैविक खेती या **RAG Mode** के बारे में पूछ सकते हैं.';
    case 'mr':
      return 'नमस्कार! 🙏 मी **KrishiMitra AI**, तुमचा Senior Agronomist आणि Multimodal Agriculture Advisor आहे.\n\nआज तुमच्या शेतात मी तुम्हाला कशा मदत करू शकतो? तुम्ही NPK खत, पानांचे रोग, पीक निवड, सेंद्रिय शेती किंवा **RAG Mode** विषयी चौकशी करू शकता.';
    default:
      return 'Namaste! 🙏 I am **KrishiMitra AI**, your Senior Agronomist and Multimodal Agriculture Advisor.\n\nHow can I assist you with your farm today? You can ask about NPK fertilizer calculations, leaf diseases, crop selection, organic farming, or turn on **RAG Mode** to query your uploaded farming manuals.';
  }
};

const getSuggestedFollowups = (language: string) => {
  switch (language) {
    case 'hi':
      return [
        'इस फसल के लिए सबसे अच्छा NPK उर्वरक अनुपात क्या है?',
        'मैं जैविक तरीके से कीटों से कैसे बचूँ?',
        'कटाई के लिए सबसे अच्छा मौसम क्या है?'
      ];
    case 'mr':
      return [
        'या पिकासाठी सर्वोत्तम NPK खत प्रमाण काय आहे?',
        'मी सेंद्रिय पद्धतीने कीटकांपासून कसे बचू?',
        'कात्रीसाठी सर्वोत्तम हवामान काय आहे?'
      ];
    default:
      return [
        'What is the recommended NPK fertilizer dosage for this crop?',
        'How can I prevent pest attacks organically?',
        'What weather conditions are best for harvesting?'
      ];
  }
};

export const ChatbotPage: React.FC = () => {
<<<<<<< HEAD
  const [language, setLanguage] = useState('en');
=======
  const { language, t } = useLanguage();

  const getInitialWelcome = (lang: string) => {
    if (lang === 'hi') {
      return "à¤¨à¤®à¤¸à¥à¤¤à¥‡! ðŸ™ à¤®à¥ˆà¤‚ **à¤•à¥ƒà¤·à¤¿ à¤®à¤¿à¤¤à¥à¤° à¤à¤†à¤ˆ** à¤¹à¥‚à¤, à¤†à¤ªà¤•à¤¾ à¤µà¤°à¤¿à¤·à¥à¤  à¤•à¥ƒà¤·à¤¿ à¤¸à¤²à¤¾à¤¹à¤•à¤¾à¤°à¥¤\n\nà¤†à¤œ à¤†à¤ªà¤•à¥€ à¤«à¤¸à¤² à¤¯à¤¾ à¤–à¥‡à¤¤à¥€ à¤®à¥‡à¤‚ à¤•à¥à¤¯à¤¾ à¤¸à¤¹à¤¾à¤¯à¤¤à¤¾ à¤•à¤° à¤¸à¤•à¤¤à¤¾ à¤¹à¥‚à¤? à¤†à¤ª à¤–à¤¾à¤¦ (NPK), à¤¬à¥€à¤®à¤¾à¤°à¥€ à¤¨à¤¿à¤µà¤¾à¤°à¤£, à¤®à¥Œà¤¸à¤® à¤¯à¤¾ à¤«à¤¸à¤² à¤šà¤¯à¤¨ à¤•à¥‡ à¤¬à¤¾à¤°à¥‡ à¤®à¥‡à¤‚ à¤ªà¥‚à¤› à¤¸à¤•à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤";
    }
    if (lang === 'mr') {
      return "à¤¨à¤®à¤¸à¥à¤•à¤¾à¤°! ðŸ™ à¤®à¥€ **à¤•à¥ƒà¤·à¥€à¤®à¤¿à¤¤à¥à¤° à¤à¤†à¤¯** à¤†à¤¹à¥‡, à¤¤à¥à¤®à¤šà¤¾ à¤¶à¥‡à¤¤à¥€ à¤¸à¤²à¥à¤²à¤¾à¤—à¤¾à¤°à¥¤\n\nà¤†à¤œ à¤®à¥€ à¤¤à¥à¤®à¥à¤¹à¤¾à¤²à¤¾ à¤•à¤¶à¤¾à¤¤ à¤®à¤¦à¤¤ à¤•à¤°à¥‚ à¤¶à¤•à¤¤à¥‹? à¤¤à¥à¤®à¥à¤¹à¥€ à¤–à¤¤à¥‡, à¤ªà¤¿à¤•à¤¾à¤‚à¤µà¤°à¥€à¤² à¤°à¥‹à¤—, à¤¹à¤µà¤¾à¤®à¤¾à¤¨ à¤•à¤¿à¤‚à¤µà¤¾ à¤¯à¥‹à¤—à¥à¤¯ à¤ªà¤¿à¤•à¤¾à¤šà¥€ à¤¨à¤¿à¤µà¤¡ à¤¯à¤¾à¤¬à¤¦à¥à¤¦à¤² à¤µà¤¿à¤šà¤¾à¤°à¥‚ à¤¶à¤•à¤¤à¤¾.";
    }
    return "Namaste! ðŸ™ I am **KrishiMitra AI**, your Senior Agronomist and Multimodal Agriculture Advisor.\n\nHow can I assist you with your farm today? You can ask about NPK fertilizer calculations, leaf diseases, crop selection, organic farming, or turn on **RAG Mode** to query your uploaded farming manuals.";
  };

>>>>>>> f49f41f6512d5af5258752a507f1c67730fdddb2
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'init_1',
      sender: 'assistant',
<<<<<<< HEAD
      content: getWelcomeMessage('en'),
=======
      content: getInitialWelcome(language),
>>>>>>> f49f41f6512d5af5258752a507f1c67730fdddb2
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

<<<<<<< HEAD
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 0) {
        return [{
          id: 'init_1',
          sender: 'assistant',
          content: getWelcomeMessage(language),
          category: 'General',
          timestamp: new Date().toISOString()
        }];
      }

      return prev.map((msg, index) => {
        if (index === 0 && msg.id === 'init_1') {
          return { ...msg, content: getWelcomeMessage(language) };
        }
        return msg;
      });
    });
=======
  // Update welcome message if user changes language and hasn't started chatting
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'init_1') {
      setMessages([
        {
          id: 'init_1',
          sender: 'assistant',
          content: getInitialWelcome(language),
          category: 'General',
          timestamp: new Date().toISOString()
        }
      ]);
    }
>>>>>>> f49f41f6512d5af5258752a507f1c67730fdddb2
  }, [language]);

  const handleSend = async (overridePrompt?: string) => {
    const textToSend = (overridePrompt || input).trim();
    if (!textToSend || loading) return;

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
<<<<<<< HEAD
        language
=======
        language: language
>>>>>>> f49f41f6512d5af5258752a507f1c67730fdddb2
      });

      const rawMessage = res?.data?.message;
      const asstMsg: ChatMessageType = {
        id: rawMessage?.id || `asst_${Date.now()}`,
        sender: rawMessage?.sender || 'assistant',
        content: rawMessage?.content || 'I could not generate a response right now.',
        category: rawMessage?.category || category,
        audio_url: rawMessage?.audio_url,
        sources: rawMessage?.sources || [],
        timestamp: rawMessage?.timestamp || new Date().toISOString()
      };

      setMessages((prev) => [...prev, asstMsg]);
    } catch (err) {
<<<<<<< HEAD
      console.error('Chat error', err);
      setMessages((prev) => [...prev, {
        id: `asst_err_${Date.now()}`,
        sender: 'assistant',
        content: language === 'mr'
          ? `तुमच्या प्रश्नाचे उत्तर मिळाले नाही: **${textToSend}**. Backend/Gemini connection तपासा आणि पुन्हा प्रयत्न करा.`
          : language === 'hi'
            ? `आपके प्रश्न का उत्तर नहीं मिल सका: **${textToSend}**। Backend/Gemini connection जाँचकर फिर प्रयास करें।`
            : `I could not answer your question: **${textToSend}**. Please check the backend/Gemini connection and try again.`,
        category,
        timestamp: new Date().toISOString()
      }]);
      return;
      const fallbackMsg: ChatMessageType = {
        id: `asst_err_${Date.now()}`,
        sender: 'assistant',
        content: language === 'hi'
          ? '### 🌿 कृषि सलाह\n\nफसल की उपज के लिए मिट्टी की जांच के आधार पर संतुलित NPK अनुप्रयोग करें।\n\n- बेसल ड्रेसिंग में 50% नाइट्रोजन दें\n- बाकी 50% दो बार में सप्लीमेंट करें\n- कीटों से बचाव के लिए जैविक उपाय अपनाएँ'
          : language === 'mr'
            ? '### 🌿 शेती सल्ला\n\nपिकाची उपज चांगली मिळण्यासाठी मातीच्या चाचणीनुसार संतुलित NPK लागू करा.\n\n- बेसल ड्रेसिंगमध्ये 50% नत्र द्या\n- उर्वरित 50% दोन भागात द्या\n- कीटकांपासून बचावासाठी सेंद्रिय उपाय वापरा'
            : '### 🌿 Agronomy Advisory Response\n\nFor optimal crop yield, ensure balanced NPK fertilizer application based on your soil health card. Apply 50% Nitrogen during basal dressing and the remainder in 2 split top dressings after irrigation.',
=======
      console.error("Chat error", err);
      let fallbackText = "### Unable to get an answer\n\nThe chatbot service could not be reached. No farming advice was generated, so please try again shortly.";
      if (language === 'hi') {
        fallbackText = "### Answer unavailable\n\nThe chatbot service could not be reached. Please try again shortly.";
      } else if (language === 'mr') {
        fallbackText = "### Answer unavailable\n\nThe chatbot service could not be reached. Please try again shortly.";
      }

      const fallbackMsg: ChatMessageType = {
        id: `asst_err_${Date.now()}`,
        sender: 'assistant',
        content: fallbackText,
>>>>>>> f49f41f6512d5af5258752a507f1c67730fdddb2
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
      setTimeout(() => {
        if (language === 'hi') {
          setInput("à¤Ÿà¤®à¤¾à¤Ÿà¤° à¤•à¥‡ à¤ªà¤¤à¥à¤¤à¥‹à¤‚ à¤®à¥‡à¤‚ à¤ªà¥€à¤²à¥‡ à¤§à¤¬à¥à¤¬à¥‹à¤‚ à¤•à¤¾ à¤œà¥ˆà¤µà¤¿à¤• à¤‰à¤ªà¤šà¤¾à¤° à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ?");
        } else if (language === 'mr') {
          setInput("à¤Ÿà¥‹à¤®à¥…à¤Ÿà¥‹à¤šà¥à¤¯à¤¾ à¤ªà¤¾à¤¨à¤¾à¤‚à¤µà¤°à¥€à¤² à¤ªà¤¿à¤µà¤³à¥à¤¯à¤¾ à¤ à¤¿à¤ªà¤•à¥à¤¯à¤¾à¤‚à¤µà¤° à¤¸à¥‡à¤‚à¤¦à¥à¤°à¤¿à¤¯ à¤‰à¤ªà¤¾à¤¯ à¤•à¤¾à¤¯ à¤†à¤¹à¥‡?");
        } else {
          setInput("What is the simple treatment for leaf spots on tomatoes?");
        }
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
              {t('chatbot_title')}
              <span className="text-xs px-2 py-0.5 bg-agri-500/20 text-agri-300 rounded-full border border-agri-500/30 font-medium">
                Simple Multi-Language AI
              </span>
            </h2>
            <p className="text-xs text-slate-400">{t('chatbot_subtitle')}</p>
          </div>
        </div>

        {/* Category & RAG Toggle */}
        <div className="flex items-center space-x-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-darkbg-900/60 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.value === 'mr' ? 'मराठी' : lang.value === 'hi' ? 'हिंदी' : 'English'}
              </option>
            ))}
          </select>

          <button
            onClick={() => setUseRag(!useRag)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              useRag
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-lg shadow-purple-500/10'
                : 'bg-darkbg-900/60 text-slate-400 border-white/10 hover:border-white/20'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{language === 'hi' ? 'RAG दस्तावेज मोड:' : language === 'mr' ? 'RAG दस्तऐवज मोड:' : 'RAG Document Mode:'} {useRag ? 'ON' : 'OFF'}</span>
          </button>

          <button
<<<<<<< HEAD
            onClick={() => setMessages([messages[0] || {
              id: 'init_1',
              sender: 'assistant',
              content: 'Namaste! 🙏 I am **KrishiMitra AI**, your Senior Agronomist and Multimodal Agriculture Advisor.\n\nHow can I assist you with your farm today? You can ask about NPK fertilizer calculations, leaf diseases, crop selection, organic farming, or turn on **RAG Mode** to query your uploaded farming manuals.',
              category: 'General',
              timestamp: new Date().toISOString()
            }])}
            title="Clear Chat History"
=======
            onClick={() => setMessages([messages[0]])}
            title={t('clear_chat')}
>>>>>>> f49f41f6512d5af5258752a507f1c67730fdddb2
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

      {/* Quick Action Sample Question Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[11px] font-bold text-agri-400 whitespace-nowrap px-1">âš¡ {t('suggested_questions')}</span>
        {[
          language === 'hi' ? "à¤—à¥‡à¤¹à¥‚à¤‚ à¤®à¥‡à¤‚ à¤–à¤¾à¤¦ (NPK) à¤•à¥€ à¤¸à¤¹à¥€ à¤®à¤¾à¤¤à¥à¤°à¤¾" : language === 'mr' ? "à¤—à¤µà¥à¤¹à¤¾à¤¸à¤¾à¤ à¥€ à¤–à¤¤à¤¾à¤‚à¤šà¥‡ à¤ªà¥à¤°à¤®à¤¾à¤£" : "Wheat NPK Dose per Acre",
          language === 'hi' ? "à¤Ÿà¤®à¤¾à¤Ÿà¤° à¤•à¥‡ à¤ªà¤¤à¥à¤¤à¥‹à¤‚ à¤®à¥‡à¤‚ à¤ªà¥€à¤²à¥‡ à¤§à¤¬à¥à¤¬à¥‹à¤‚ à¤•à¤¾ à¤‡à¤²à¤¾à¤œ" : language === 'mr' ? "à¤Ÿà¥‹à¤®à¥…à¤Ÿà¥‹ à¤ªà¤¿à¤•à¤¾à¤¤à¥€à¤² à¤°à¥‹à¤— à¤‰à¤ªà¤¾à¤¯" : "Tomato Leaf Yellow Spot Cure",
          language === 'hi' ? "à¤œà¥ˆà¤µà¤¿à¤• à¤•à¥€à¤Ÿà¤¨à¤¾à¤¶à¤• (à¤¨à¥€à¤® à¤¤à¥‡à¤²) à¤‰à¤ªà¤¯à¥‹à¤—" : language === 'mr' ? "à¤¸à¥‡à¤‚à¤¦à¥à¤°à¤¿à¤¯ à¤•à¥€à¤Ÿà¤•à¤¨à¤¾à¤¶à¤• à¤¸à¤²à¥à¤²à¤¾" : "Organic Neem Oil Pest Spray",
        ].map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 rounded-lg bg-agri-950/60 text-agri-200 border border-agri-500/30 hover:bg-agri-500 hover:text-white transition-all whitespace-nowrap"
          >
            {q}
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
                  {msg.sender === 'user' ? 'You' : 'KrishiMitra AI'} â€¢ {msg.category || 'General'}
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
            <span>
              {language === 'hi'
                ? 'à¤•à¥ƒà¤·à¤¿ à¤‰à¤¤à¥à¤¤à¤° à¤¤à¥ˆà¤¯à¤¾à¤° à¤•à¤¿à¤¯à¤¾ à¤œà¤¾ à¤°à¤¹à¤¾ à¤¹à¥ˆ...'
                : language === 'mr'
                ? 'à¤¶à¥‡à¤¤à¥€à¤µà¤¿à¤·à¤¯à¤• à¤‰à¤¤à¥à¤¤à¤° à¤¤à¤¯à¤¾à¤° à¤•à¥‡à¤²à¥‡ à¤œà¤¾à¤¤ à¤†à¤¹à¥‡...'
                : 'Preparing simple farming advice...'}
            </span>
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
          title={isRecording ? t('listening') : t('record_voice')}
        >
          {isRecording ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isRecording ? t('listening') : t('type_message_placeholder')}
          className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none placeholder-slate-500 px-2"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-agri-500 to-emerald-500 hover:from-agri-400 hover:to-emerald-400 disabled:opacity-50 text-white font-bold shadow-lg shadow-agri-500/20 flex items-center space-x-2 transition-all"
        >
          <span>{t('send')}</span>
          <Send className="w-4 h-4" />
        </button>
      </GlassCard>
    </div>
  );
};


