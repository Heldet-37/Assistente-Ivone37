import React, { useState, useEffect, useRef } from 'react';
import { Bot, MessageSquare, Star, Code, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from './types/chat';
import { sendMessage, clearConversationHistory } from './services/api';
import { MessageBubble } from './components/MessageBubble';
import { FeatureCard } from './components/FeatureCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { Header } from './components/Header';
import { ChatInput } from './components/ChatInput';
import { UserProfile } from './components/UserProfile';
import { saveHistory, loadHistory, clearHistory } from './utils/storage';
import { UserSettingsProvider } from './context/UserSettingsContext';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isDark, setIsDark] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: Bot,
      title: 'Conheça a IVONE',
      description: 'Sua assistente virtual elegante e sofisticada'
    },
    {
      icon: Star,
      title: 'Inteligência Refinada',
      description: 'Desenvolvida com expertise por Hélder Alves(37)'
    },
    {
      icon: MessageSquare,
      title: 'Diálogo Profissional',
      description: 'Comunicação clara e objetiva'
    },
    {
      icon: Code,
      title: 'Suporte Técnico',
      description: 'Auxílio especializado em programação'
    }
  ];

  useEffect(() => {
    const savedMessages = loadHistory();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    // Rolando até a última mensagem quando as mensagens mudam
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (input: string) => {
    if (!input.trim()) return;
    
    setError(null);
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    saveHistory(newMessages);
    setLoading(true);

    try {
      const response = await sendMessage(input);
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      saveHistory(updatedMessages);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ocorreu um erro ao processar sua mensagem');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setShowClearConfirm(true);
  };

  const confirmClearChat = () => {
    setMessages([]);
    clearHistory();
    clearConversationHistory();
    setShowClearConfirm(false);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  // Temporary user ID for demo
  const tempUserId = "demo-user-123";

  return (
    <UserSettingsProvider>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950 transition-colors flex flex-col">
        <Header 
          isDark={isDark} 
          toggleTheme={() => setIsDark(!isDark)} 
          onProfileClick={toggleProfile}
        />
        
        <main className="flex-1 container mx-auto px-4 pt-20 pb-24 relative max-w-[100rem]">
          {showProfile ? (
            <UserProfile userId={tempUserId} />
          ) : (
            <div className="h-[calc(100vh-11rem)] overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-purple-200 dark:scrollbar-thumb-purple-900 scrollbar-track-transparent">
              {messages.length === 0 ? (
                <>
                  <div className="text-center mb-8 sm:mb-12 px-4">
                    <h2 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-4 sm:mb-6">
                      Bem-vindo à IVONE
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                      Assistente virtual inteligente e sofisticada, criada por Hélder Alves(37)
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto px-4">
                    {features.map((feature, index) => (
                      <FeatureCard
                        key={index}
                        Icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-4">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      content={message.content}
                      isUser={message.role === 'user'}
                      timestamp={message.timestamp}
                    />
                  ))}
                  {loading && <LoadingSkeleton />}
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 text-red-600 dark:text-red-400 text-sm sm:text-base">
                      {error}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          )}
          
          {!showProfile && (
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-purple-50 via-purple-50/95 to-transparent dark:from-gray-900 dark:via-gray-900/95 py-3 sm:py-4 backdrop-blur-sm">
              <div className="max-w-3xl mx-auto px-3 sm:px-4">
                {messages.length > 0 && (
                  <button
                    onClick={handleClearChat}
                    className="absolute -top-12 right-4 p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    title="Limpar conversa"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <ChatInput onSubmit={handleSubmit} loading={loading} onError={setError} />
              </div>
            </div>
          )}
        </main>

        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 max-w-sm w-full shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Limpar conversa
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Tem certeza que deseja apagar todo o histórico da conversa?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmClearChat}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserSettingsProvider>
  );
}

export default App;
