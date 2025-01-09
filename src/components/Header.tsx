import React, { useState } from 'react';
import { Bot, Star, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme, onProfileClick }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    onProfileClick();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-900 to-indigo-900 dark:from-gray-900 dark:to-purple-900 shadow-lg z-50">
      <div className="container mx-auto px-3 py-2 sm:px-4 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-2 sm:p-3 rounded-lg shadow-inner">
              <Bot className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2 sm:space-x-3">
                <span>IVONE(37)</span>
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
              </h1>
              <p className="text-xs sm:text-sm text-purple-200">Sua Assistente Virtual</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
            
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 sm:space-x-3 bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-2 sm:px-4 py-2"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-white text-sm hidden sm:inline">Usuário</span>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2"
                  >
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">usuario@email.com</p>
                    </div>
                    <button 
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700"
                    >
                      Perfil
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                      Sair
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};