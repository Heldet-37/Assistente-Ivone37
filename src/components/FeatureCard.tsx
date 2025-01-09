import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  gradient?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  Icon,
  gradient = 'from-purple-500 to-pink-500'
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100 dark:border-purple-900 relative overflow-hidden group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      <div className={`flex items-center justify-center w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl mb-6 shadow-inner group-hover:shadow-lg transition-shadow duration-300`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}