import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { User as UserIcon, Save, Settings, Layout, Palette, Book, LogOut } from 'lucide-react';

interface SettingsViewProps {
  user: User | null;
  onLogout: () => void;
  activeTab: 'account' | 'kdp' | 'editor';
}

interface AppSettings {
  authorName: string;
  defaultTrimSize: "8.5x11" | "6x9" | "8.5x8.5";
  defaultRenderStyle: 'shapes' | 'pixels';
  defaultGridDensity: number;
  language: 'en' | 'vi';
}

const DEFAULT_SETTINGS: AppSettings = {
  authorName: '',
  defaultTrimSize: '8.5x11',
  defaultRenderStyle: 'shapes',
  defaultGridDensity: 60,
  language: 'en'
};

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onLogout, activeTab }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const savedSettings = localStorage.getItem('kdp_monocrafter_settings');
    if (savedSettings) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('kdp_monocrafter_settings', JSON.stringify(settings));
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 500);
  };

  return (
    <div className="flex-1 bg-neutral-50 overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Settings</h1>
          <p className="text-neutral-500">Manage your account, preferences, and KDP defaults.</p>
        </div>

        <div className="flex flex-col gap-6">
          {activeTab === 'account' && (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <UserIcon size={20} className="text-neutral-400" /> Account Information
              </h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-1">Email Address</label>
                  <div className="px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-medium">
                    {user?.email || 'Not signed in'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-1">Display Name</label>
                  <div className="px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-medium">
                    {user?.displayName || 'N/A'}
                  </div>
                </div>
                
                <div className="pt-4 mt-2 border-t border-neutral-100">
                  <button 
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kdp' && (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Book size={20} className="text-neutral-400" /> KDP Publishing Defaults
              </h2>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-1">Default Author Name</label>
                  <p className="text-xs text-neutral-500 mb-2">Used automatically in the Copyright Page of BookFlow.</p>
                  <input 
                    type="text" 
                    value={settings.authorName}
                    onChange={(e) => setSettings({...settings, authorName: e.target.value})}
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-1">Default Trim Size</label>
                  <div className="flex gap-3 mt-2">
                    {['8.5x11', '6x9', '8.5x8.5'].map(size => (
                      <button
                        key={size}
                        onClick={() => setSettings({...settings, defaultTrimSize: size as any})}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                          settings.defaultTrimSize === size 
                            ? 'bg-neutral-900 text-white' 
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-neutral-100 mt-2">
                  {saveMessage && (
                    <span className="text-sm font-medium text-green-600">{saveMessage}</span>
                  )}
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-lg font-semibold transition-colors disabled:opacity-70"
                  >
                    <Save size={18} />
                    {isSaving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Palette size={20} className="text-neutral-400" /> Editor Preferences
              </h2>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-1">Default Render Style</label>
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => setSettings({...settings, defaultRenderStyle: 'shapes'})}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        settings.defaultRenderStyle === 'shapes' 
                          ? 'bg-neutral-900 text-white' 
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      Shapes (Tracing)
                    </button>
                    <button
                      onClick={() => setSettings({...settings, defaultRenderStyle: 'pixels'})}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        settings.defaultRenderStyle === 'pixels' 
                          ? 'bg-neutral-900 text-white' 
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      Pixels (Shading)
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-1">Default Grid Density</label>
                  <p className="text-xs text-neutral-500 mb-3">Number of columns for the grid. Higher = more detailed.</p>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="20" 
                      max="150" 
                      step="10"
                      value={settings.defaultGridDensity}
                      onChange={(e) => setSettings({...settings, defaultGridDensity: parseInt(e.target.value)})}
                      className="flex-1 accent-neutral-900"
                    />
                    <span className="text-sm font-bold w-12 text-center bg-neutral-100 py-1 rounded">
                      {settings.defaultGridDensity}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-neutral-100 mt-2">
                  {saveMessage && (
                    <span className="text-sm font-medium text-green-600">{saveMessage}</span>
                  )}
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-lg font-semibold transition-colors disabled:opacity-70"
                  >
                    <Save size={18} />
                    {isSaving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
