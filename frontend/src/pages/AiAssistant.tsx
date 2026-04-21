import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import Card from '../components/Card';
import { generateAIResponse } from '../utils/mockAi';
import { expenseService, type ExpenseResponse } from '../services/expenseService';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export default function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I'm your intelligent finance assistant. How can I help you analyze your spending or budget today? Try asking:\n• \"Where am I spending the most?\"\n• \"Give me savings tips\"\n• \"Categorize my Swiggy order\""
    }
  ]);
  const [input, setInput] = useState('');
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    expenseService.getAll().then(setExpenses).catch(() => {});
  }, []);

  const now = new Date();
  const monthlyTotal = expenses
    .filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, e) => s + Number(e.amount), 0);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const responseText = generateAIResponse({
        message: userMessage.text,
        monthlyTotal,
        expenses: expenses.map(exp => ({
          id: exp.id,
          description: exp.description,
          amount: Number(exp.amount),
          category: exp.category,
          date: exp.date,
        })),
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 600);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-4xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">AI Assistant</h2>
        <p className="text-slate-500">Ask questions, get insights, and categorize your expenses automatically.</p>
        {expenses.length > 0 && (
          <p className="text-xs text-slate-400 mt-1">
            Loaded {expenses.length} expenses · This month: ${monthlyTotal.toFixed(2)}
          </p>
        )}
      </div>

      <Card className="flex-1 flex flex-col min-h-0 relative">
        <div className="flex-1 overflow-y-auto pr-4 space-y-6 pb-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user' 
                  ? 'bg-primary text-white' 
                  : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
              }`}>
                {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              
              <div className={`px-5 py-3 rounded-2xl max-w-[80%] shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
              }`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              id="ai-message-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about your expenses..."
              className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-inner"
            />
            <button 
              id="ai-send-btn"
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 p-2 bg-primary text-white rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}
