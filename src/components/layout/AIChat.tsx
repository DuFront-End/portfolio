// d:/portfolio/src/components/layout/AIChat.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, Sparkles, Zap, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Message {
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Xin chào! Tôi là trợ lý AI của Khanh Du. Tôi có thể giúp bạn khám phá các dự án hoặc chọn nhạc phù hợp. Bạn cần giúp gì không? ✨', timestamp: new Date() }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', text: userMsg, timestamp: new Date() }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({ role: m.role, text: m.text }));
      const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const response = await axios.post(`${apiUrl}/api/ai/chat`, {
        message: userMsg,
        history
      });

      const aiText = response.data.data;
      
      if (aiText.includes('[ACTION:PLAY_SONG:')) {
        const songName = aiText.match(/\[ACTION:PLAY_SONG:(.*?)\]/)?.[1];
        if (songName) {
          window.dispatchEvent(new CustomEvent('ai-play-song', { detail: { songName } }));
          toast.success(`AI đang phát bài: ${songName}`, { icon: '🎵' });
        }
      }

      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: aiText.replace(/\[ACTION:.*?\]/g, '').trim(), 
        timestamp: new Date() 
      }]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      toast.error('Có lỗi khi kết nối với Cyber-Conductor.');
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'ai', text: 'Dữ liệu đã được làm mới. Tôi sẵn sàng tiếp tục hành trình cùng bạn!', timestamp: new Date() }]);
  };

  return (
    <>
      {/* Floating Tooltip Label (Desktop only) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden lg:block fixed bottom-[115px] left-8 z-50 pointer-events-none"
      >
        <div className="bg-[#05080f]/90 backdrop-blur-md border border-music-gold/30 px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-music-gold animate-pulse" />
          <span className="text-[10px] font-bold text-music-gold uppercase tracking-wider whitespace-nowrap">
            Hỏi AI về Khanh Du 🤖
          </span>
          <div className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center">
             <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
          </div>
          <div className="absolute -bottom-1 left-8 w-2 h-2 bg-[#05080f] border-r border-b border-music-gold/30 rotate-45" />
        </div>
      </motion.div>

      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        animate={{ 
          boxShadow: [
            "0 0 5px rgba(6, 182, 212, 0.2)", 
            "0 0 25px rgba(6, 182, 212, 0.5)", 
            "0 0 5px rgba(6, 182, 212, 0.2)"
          ] 
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-24 left-4 sm:bottom-8 sm:left-8 z-[100] p-1.5 sm:p-3 rounded-full sm:rounded-2xl bg-[#0a192f]/90 backdrop-blur-xl border-2 border-cyan-500/40 hover:border-cyan-400 shadow-2xl group transition-all duration-300 flex items-center gap-3 sm:gap-0 pr-4 sm:pr-3"
      >
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full sm:rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 flex items-center justify-center border border-white/20 group-hover:border-cyan-400/50 transition-colors shadow-[inset_0_0_15px_rgba(6,182,212,0.3)]">
            <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] group-hover:scale-110 transition-transform" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-400 rounded-full border-2 border-[#0a192f] shadow-[0_0_15px_#34d399]" />
        </div>
        <span className="sm:hidden text-[11px] font-bold text-cyan-300 uppercase tracking-widest whitespace-nowrap ml-1">
          Hỏi AI
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%", x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: "100%", x: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 sm:inset-auto sm:left-6 sm:bottom-6 z-[200] w-full sm:w-[420px] h-[92vh] sm:h-[650px] bg-[#05080f]/98 backdrop-blur-2xl border-t sm:border border-white/10 rounded-t-[32px] sm:rounded-[32px] shadow-[0_-20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {/* Mobile Drag Handle */}
                <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/10 rounded-full" />
                
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center relative">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#05080f]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cyber AI Assistant</h3>
                  <p className="text-[9px] text-cyan-400/60 font-tech uppercase tracking-tighter">Online & Ready to sync</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={clearChat} 
                  className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-rose-400 transition-colors" 
                  title="Clear History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 bg-white/5 sm:bg-transparent hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all active:scale-90"
                >
                  <X className="w-6 h-6 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-main-scrollbar scroll-smooth"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[88%] p-3.5 sm:p-4 rounded-2xl text-[13px] sm:text-xs leading-relaxed shadow-lg ${
                    msg.role === 'user' 
                    ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-tr-none border border-cyan-400/20' 
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none backdrop-blur-sm'
                  }`}>
                    {msg.text}
                    <div className={`text-[9px] mt-2 opacity-40 font-tech ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1.5 shadow-lg">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <form 
              onSubmit={handleSendMessage} 
              className="p-4 sm:p-5 bg-[#0a1221] border-t border-white/5 pb-8 sm:pb-5"
            >
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1 group">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Hỏi tôi bất cứ điều gì..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 sm:py-3 pl-4 sm:pl-5 pr-12 text-[16px] sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity" />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-12 h-12 sm:w-11 sm:h-11 rounded-2xl bg-cyan-500 text-white flex items-center justify-center hover:bg-cyan-400 active:scale-95 transition-all disabled:opacity-30 shadow-lg shadow-cyan-500/20 shrink-0"
                >
                  <Send className="w-5 h-5 sm:w-4 sm:h-4" />
                </button>
              </div>
              <p className="text-[10px] text-center text-slate-500 mt-3 hidden sm:block">
                Powered by <span className="text-cyan-500/80 font-bold">Cyber-Conductor AI</span>
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;
