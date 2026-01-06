'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWidgetProps {
  lang: 'en' | 'fi';
  dict: {
    greeting: string;
    placeholder: string;
    typing: string;
    botName: string;
    error: string;
    chips: {
      shipping: string;
      warranty: string;
      returns: string;
    };
    answers: {
      shipping: string;
      warranty: string;
      returns: string;
    };
  };
}

export default function ChatWidget({ lang, dict }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize greeting using the Dictionary
  useEffect(() => {
    setMessages([{ role: 'assistant', content: dict.greeting }]);
  }, [dict]); // Re-run if language changes
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { role: 'user', content: text } as Message];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const lowerText = text.toLowerCase();
    
    let localAnswer = null;

    if (lowerText.includes('shipping') || lowerText.includes('toimitus')) {
      localAnswer = dict.answers.shipping;
    } 
    else if (lowerText.includes('warranty') || lowerText.includes('takuu')) {
      localAnswer = dict.answers.warranty;
    }
    else if (lowerText.includes('return') || lowerText.includes('palautus')) {
      localAnswer = dict.answers.returns;
    }

    if (localAnswer) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: localAnswer! }]);
        setIsLoading(false);
      }, 600);
      return;
    }

    // 3. AI Fallback
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, lang }), 
      });

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();
      setMessages(prev => [...prev, data]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: dict.error }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-background border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px] animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-primary p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="font-bold">{dict.botName}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-secondary/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-none text-xs text-gray-500 animate-pulse">
                  {dict.typing}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-background border-t border-gray-200 dark:border-gray-800">
            <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide">
              {/* Map through the 'chips' object values */}
              {Object.values(dict.chips).map(chipLabel => (
                <button 
                  key={chipLabel} 
                  onClick={() => handleSend(chipLabel)}
                  className="text-xs whitespace-nowrap bg-secondary hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 transition"
                >
                  {chipLabel}
                </button>
              ))}
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <input 
                className="flex-1 bg-secondary rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-gray-400"
                placeholder={dict.placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()} 
                className="bg-primary text-white w-10 h-10 flex items-center justify-center rounded-lg hover:brightness-110 disabled:opacity-50 transition"
              >
                ➤
              </button>
            </form>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/40 flex items-center justify-center text-white text-3xl hover:scale-110 transition duration-300"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}