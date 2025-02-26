import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { useUserSettings } from '../context/UserSettingsContext';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useUserSettings();

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <SettingsIcon className="w-5 h-5" />
        Configurações
      </h2>
      
      <div className="space-y-4">
        {/* Configuração de Voz */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.enableSpeech}
              onChange={(e) => updateSettings({ enableSpeech: e.target.checked })}
              className="rounded text-purple-600"
            />
            Ativar resposta por voz
          </label>
        </div>

        {/* Configuração de WhatsApp */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.enableWhatsApp}
                onChange={(e) => updateSettings({ enableWhatsApp: e.target.checked })}
                className="rounded text-purple-600"
              />
              Ativar envio por WhatsApp
            </label>
          </div>
          
          {settings.enableWhatsApp && (
            <input
              type="tel"
              value={settings.whatsAppNumber}
              onChange={(e) => updateSettings({ whatsAppNumber: e.target.value })}
              placeholder="+55 (99) 99999-9999"
              className="w-full p-2 border rounded-lg dark:bg-gray-700"
            />
          )}
        </div>
      </div>
    </div>
  );
};