import React, { useState, useRef, useEffect } from 'react';
import { SendHorizonal } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  loading: boolean;
  onError: (error: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, loading }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSubmit(input);
    setInput('');
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-4 border border-purple-100 dark:border-purple-900"
    >
      <div className="relative flex items-end space-x-2 sm:space-x-4">
        <div className="flex-grow relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Digite sua mensagem..."
            className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-purple-200 dark:border-purple-900 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none min-h-[50px] sm:min-h-[60px] max-h-[200px] text-sm sm:text-base"
            rows={1}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold rounded-lg sm:rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md"
        >
          <span className="hidden sm:inline">Enviar</span>
          <SendHorizonal className="w-5 h-5" />
        </button>
      </div>
    </motion.form>
  );
};