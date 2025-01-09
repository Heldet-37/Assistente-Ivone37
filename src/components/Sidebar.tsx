import React from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  userName?: string;
  userEmail?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ userName = 'Usuário', userEmail = 'usuario@email.com' }) => {
  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-40"
    >
      <div className="flex flex-col h-full">
        {/* Perfil do Usuário */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{userName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{userEmail}</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
                <span>Configurações</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Rodapé */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}