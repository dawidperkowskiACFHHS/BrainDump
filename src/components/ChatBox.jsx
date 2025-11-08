import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../lib/store';
import { streamChat } from '../lib/llm';
import { answerLocalQuestion } from '../lib/localChat';
import { Button } from './ui/Button';
import { Send, Loader2, Trash2, User, Bot } from 'lucide-react';

export function ChatBox({ user }) {
  const { showToast, showError } = useStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Try local answer first
    const localAnswer = answerLocalQuestion(input.trim(), user);
    if (localAnswer) {
      setMessages((prev) => [...prev, { role: 'assistant', content: localAnswer }]);
      setLoading(false);
      return;
    }

    const knowledge = user.documents.map((d) => d.content).join('\n\n');
    const systemPrompt = `You are ${user.name}. Answer questions based only on this knowledge:\n\n${knowledge}`;

    const apiMessages = [{ role: 'system', content: systemPrompt }, ...messages, userMessage];

    try {
      let assistantMessage = '';
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      for await (const chunk of streamChat(apiMessages, user.documents)) {
        assistantMessage += chunk;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = assistantMessage;
          return newMessages;
        });
      }
    } catch (error) {
      const errorDetails = {
        message: error.message,
        endpoint: 'Credal ACF API',
        model: 'Credal Agent',
        stack: error.stack,
        timestamp: new Date().toISOString(),
      };
      showError(errorDetails);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">Chat with {user.name}</h2>
        <button
          onClick={() => setMessages([])}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Clear chat"
        >
          <Trash2 className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2" role="log" aria-live="polite">
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Start a conversation with {user.name}</p>
            <p className="text-gray-600 text-sm mt-2">Ask anything about their knowledge base</p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white/10 border border-white/10'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={loading}
          aria-label="Chat message"
          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <Button type="submit" disabled={loading || !input.trim()} size="lg">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </Button>
      </form>
    </div>
  );
}
