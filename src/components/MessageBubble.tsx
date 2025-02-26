import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Copy, Check, Bot, User, Volume2, VolumeX, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import 'katex/dist/katex.min.css';
import { speechService } from '../services/speech';
import { sendWhatsAppMessage } from '../services/whatsapp';
import { useUserSettings } from '../context/UserSettingsContext';

interface MessageBubbleProps {
  content: string;
  isUser: boolean;
  timestamp: number;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ content, isUser, timestamp }) => {
  const { settings } = useUserSettings();
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
    } else {
      speechService.speak(content);
      setIsSpeaking(true);
    }
  };

  const handleWhatsAppSend = async () => {
    try {
      await sendWhatsAppMessage(settings.whatsAppNumber, content);
      // Mostrar notificação de sucesso
    } catch (error) {
      // Mostrar notificação de erro
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 sm:mb-6 group`}
    >
      <div className={`flex items-start space-x-2 sm:space-x-3 max-w-[90%] sm:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg ${
          isUser 
            ? 'bg-gradient-to-br from-pink-500 to-purple-600' 
            : 'bg-gradient-to-br from-purple-600 to-pink-500'
        }`}>
          {isUser ? <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
        </div>
        
        <div className={`relative rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg ${
          isUser 
            ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white' 
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
        }`}>
          <button
            onClick={copyToClipboard}
            className="absolute right-2 top-2 p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
            title={copied ? 'Copiado!' : 'Copiar mensagem'}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
            )}
          </button>

          <div className="prose dark:prose-invert max-w-none text-sm sm:text-base">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="relative group mt-3 sm:mt-4 mb-3 sm:mb-4">
                      <div className="absolute -top-3 left-4 px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900 text-xs font-medium text-purple-700 dark:text-purple-300">
                        {match[1]}
                      </div>
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg sm:rounded-xl !bg-gray-900/95 !p-3 sm:!p-4 !pt-5 sm:!pt-6 text-sm sm:text-base"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md ${
                      isUser 
                        ? 'bg-white/10 text-white' 
                        : 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    }`} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
          
          <div className={`text-xs mt-2 sm:mt-3 opacity-75 ${
            isUser ? 'text-white/75' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {formatTime(timestamp)}
          </div>

          <div className="flex gap-2 mt-2">
            {settings.enableSpeech && !isUser && (
              <button
                onClick={handleSpeak}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title={isSpeaking ? 'Parar de falar' : 'Ouvir mensagem'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}
            
            {settings.enableWhatsApp && !isUser && (
              <button
                onClick={handleWhatsAppSend}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Enviar para WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};