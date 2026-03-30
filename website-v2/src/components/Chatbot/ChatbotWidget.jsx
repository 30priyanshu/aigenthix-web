import React, { useEffect, useRef, useState } from 'react';
import { Bot, MessageSquare, X, Send, Loader2, User } from 'lucide-react';
import { getAnswer } from './chatService';

import { useNavigate } from 'react-router-dom';

const WELCOME_MSG =
  "Hi, I'm the AiGENThix assistant. I can answer questions about our company, services, products, industries, core principles, and contact details. How can I help you today?";

// Simple formatter to handle bold (**text**), bullet points (* point), and markdown links ([text](url))
const formatMessage = (content, navigate) => {
  if (!content) return null;

  // Split by line to handle bullet points
  const lines = content.split('\n');
  const formattedLines = [];
  let inList = false;

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Handle bullet points (starting with * or -)
    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      if (!inList) {
        formattedLines.push(<ul key={`ul-${index}`} className="list-disc ml-5 mb-2 space-y-1"></ul>);
        inList = true;
      }

      const bulletContent = trimmedLine.substring(2);
      const formattedBullet = formatInline(bulletContent, navigate);

      // Push to the last ul
      const lastUl = formattedLines[formattedLines.length - 1];
      formattedLines[formattedLines.length - 1] = React.cloneElement(lastUl, {
        children: [...(lastUl.props.children || []), <li key={`li-${index}`} className="pl-1">{formattedBullet}</li>]
      });
    } else {
      inList = false;
      if (trimmedLine === '') {
        formattedLines.push(<div key={`br-${index}`} className="h-2" />);
      } else {
        formattedLines.push(<p key={`p-${index}`} className="mb-2 last:mb-0">{formatInline(trimmedLine, navigate)}</p>);
      }
    }
  });

  return formattedLines;
};

// Helper to format bold text and markdown links
const formatInline = (text, navigate) => {
  // Split text by bold (**text**) or markdown links ([text](url))
  const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-[#3da4c1]">{part.slice(2, -2)}</strong>;
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const href = linkMatch[2].trim();
      const isExternal = href.startsWith('http') || href.startsWith('mailto:');
      
      if (isExternal) {
        return (
          <a 
            key={i} 
            href={href} 
            className="text-[#3da4c1] hover:text-white underline decoration-[#3da4c1]/50 underline-offset-2 transition-colors font-medium break-words"
            target="_blank"
            rel="noreferrer"
          >
            {linkMatch[1]}
          </a>
        );
      } else {
        return (
          <span 
            key={i} 
            onClick={() => navigate(href)} 
            className="cursor-pointer text-[#3da4c1] hover:text-white underline decoration-[#3da4c1]/50 underline-offset-2 transition-colors font-medium break-words inline-block"
            role="link"
          >
            {linkMatch[1]}
          </span>
        );
      }
    }
    return <span key={i}>{part}</span>;
  });
};

const ChatbotWidget = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: WELCOME_MSG },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ bottom: 24, right: 24 });
  const [dragging, setDragging] = useState(false);

  const dragStartRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const startDrag = (e) => {
    // Only drag from the button, or if dragging is already active
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      startBottom: position.bottom,
      startRight: position.right,
    };
    setDragging(true);
  };

  const onDrag = (e) => {
    if (!dragging || !dragStartRef.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const dx = clientX - dragStartRef.current.startX;
    const dy = clientY - dragStartRef.current.startY;

    const newBottom = Math.max(12, dragStartRef.current.startBottom - dy);
    const newRight = Math.max(12, dragStartRef.current.startRight - dx);
    setPosition({ bottom: newBottom, right: newRight });
  };

  const endDrag = () => {
    setDragging(false);
    dragStartRef.current = null;
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e) => onDrag(e);
    const up = () => endDrag();
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
    };
  }, [dragging]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const answer = await getAnswer(text);
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, something went wrong. Please try again or contact us at info@aigenthix.com.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const bubbleClass =
    'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-lg';

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: position.bottom + 20,
          right: position.right,
          zIndex: 60,
        }}
      >
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          className={`group flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#3da4c1] to-[#1B307A] text-white shadow-xl transition-all duration-300 hover:scale-110 border border-white/20 backdrop-blur-md ${isOpen ? 'rotate-90' : 'rotate-0'}`}
          aria-label={isOpen ? 'Close AiGENThix chat' : 'Open AiGENThix chat'}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="relative">
              <MessageSquare className="h-7 w-7" />

            </div>
          )}
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-3xl border border-white/10 bg-[#020617]/90 text-white shadow-2xl backdrop-blur-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
          role="dialog"
          aria-label="AiGENThix chatbot"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 bg-gradient-to-r from-[#111827]/80 via-[#020617]/80 to-[#1E293B]/80 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg animate-pulse">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight">AiGENThix Assistant</span>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-slate-400 font-medium">Online • AI-Powered</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Container */}
          <div className="h-[400px] overflow-y-auto px-4 py-4 space-y-4 bg-slate-950/40 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-blue-600/50' : 'bg-slate-800'}`}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-cyan-400" />}
                </div>
                <div
                  className={`${bubbleClass} ${msg.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-br-none border border-blue-400/20'
                    : 'bg-[#1e293b]/80 text-slate-100 rounded-bl-none border border-white/5'
                    }`}
                >
                  <div className="text-[13px] sm:text-sm">
                    {msg.role === 'assistant' ? formatMessage(msg.content, navigate) : msg.content}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-end gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800">
                  <Bot className="h-4 w-4 text-cyan-400" />
                </div>
                <div className={`${bubbleClass} bg-[#1e293b]/60 text-slate-300 rounded-bl-none border border-white/5 flex items-center gap-2 py-2`}>
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                  <span className="text-xs font-medium italic">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-900/60 border-t border-white/10 backdrop-blur-xl">
            <div className="relative flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="How can AiGENThix help you?"
                className="flex-1 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="absolute right-1.5 h-9 w-9 inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 transition-all disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-[10px] text-slate-500 text-center font-medium">
              Powered by AiGENThix
            </p>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </>
  );
};

export default ChatbotWidget;


