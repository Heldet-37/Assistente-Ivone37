import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { validateImage } from '../utils/image';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  onError: (error: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, onError }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await validateImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreview(imageUrl);
        onImageSelect(imageUrl);
      };
      reader.onerror = () => {
        throw new Error('Erro ao ler o arquivo');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Erro ao processar imagem');
      clearImage();
    }
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <AnimatePresence>
        {!preview ? (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Upload size={18} />
            <span>Enviar Imagem</span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative inline-block"
          >
            <img
              src={preview}
              alt="Preview"
              className="h-20 w-20 object-cover rounded-lg"
            />
            <button
              onClick={clearImage}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};