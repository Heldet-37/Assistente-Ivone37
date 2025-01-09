import React, { useState, useEffect } from 'react';
import { User, Settings, Activity, Bell, History, Star, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { getFullUserProfile, updateUserProfile } from '../services/database';

interface UserProfileProps {
  userId: string;
}

interface UserData {
  name: string;
  email: string;
  created_at: string;
  interests: string[];
  favorite_topics: string[];
  interaction_count: number;
  last_topics: string[];
  preferences: {
    theme: string;
    language: string;
    notifications: boolean;
  };
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for user data
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    created_at: new Date().toISOString(),
    interests: [],
    favorite_topics: [],
    interaction_count: 0,
    last_topics: [],
    preferences: {
      theme: 'dark',
      language: 'pt-BR',
      notifications: true
    }
  });

  // State for form inputs
  const [formData, setFormData] = useState(userData);
  const [newInterest, setNewInterest] = useState('');
  const [newTopic, setNewTopic] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const profile = await getFullUserProfile(userId);
      if (profile) {
        const formattedData = {
          name: profile.name || '',
          email: profile.email || '',
          created_at: profile.created_at,
          interests: profile.userData?.interests || [],
          favorite_topics: profile.userData?.favorite_topics || [],
          interaction_count: profile.interaction_count || 0,
          last_topics: profile.userData?.last_topics || [],
          preferences: {
            theme: profile.preferences?.theme || 'dark',
            language: profile.preferences?.language || 'pt-BR',
            notifications: profile.preferences?.notification_enabled || true
          }
        };
        setUserData(formattedData);
        setFormData(formattedData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceToggle = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: !prev.preferences[preference as keyof typeof prev.preferences]
      }
    }));
  };

  const handleAddInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newInterest.trim()) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleAddTopic = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTopic.trim()) {
      setFormData(prev => ({
        ...prev,
        favorite_topics: [...prev.favorite_topics, newTopic.trim()]
      }));
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      favorite_topics: prev.favorite_topics.filter(t => t !== topic)
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await updateUserProfile(userId, {
        name: formData.name,
        email: formData.email,
        interests: formData.interests,
        favorite_topics: formData.favorite_topics
      });
      
      setUserData(formData);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {showSaveSuccess && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
          Perfil atualizado com sucesso!
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full sm:w-64 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'profile'
                ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5" />
              <span>Perfil</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'preferences'
                ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5" />
              <span>Preferências</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'activity'
                ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5" />
              <span>Atividade</span>
            </div>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Perfil</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  {isEditing ? 'Cancelar' : 'Editar'}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={isEditing ? formData.name : userData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={isEditing ? formData.email : userData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Interesses
                  </label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyDown={handleAddInterest}
                        placeholder="Pressione Enter para adicionar"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                      />
                      <div className="flex flex-wrap gap-2">
                        {formData.interests.map((interest) => (
                          <span
                            key={interest}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                          >
                            {interest}
                            <button
                              onClick={() => handleRemoveInterest(interest)}
                              className="ml-2 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {userData.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Preferências</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span>Notificações</span>
                  </div>
                  <button
                    onClick={() => handlePreferenceToggle('notifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.preferences.notifications
                        ? 'bg-purple-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Atividade</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <History className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      <span>Total de interações</span>
                    </div>
                    <span className="text-2xl font-semibold text-purple-500">
                      {userData.interaction_count}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Tópicos Recentes</h3>
                  <div className="space-y-2">
                    {userData.last_topics.map((topic, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300"
                      >
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};