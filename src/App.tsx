import { useState } from 'react';
import { TabType } from './utils/types';
import JadwalTab from './components/JadwalTab';
import DokterTab from './components/DokterTab';
import SettingTab from './components/SettingTab';
import { Calendar, Users, Settings } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('jadwal');

  const tabs = [
    { id: 'jadwal' as TabType, label: 'Jadwal', icon: Calendar },
    { id: 'dokter' as TabType, label: 'Dokter', icon: Users },
    { id: 'setting' as TabType, label: 'Setting', icon: Settings },
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-holo-dark overflow-hidden">
      {/* Header */}
      <header className="shrink-0 px-4 py-2 bg-gradient-to-r from-purple-900/50 via-holo-card to-pink-900/50 border-b border-holo-border">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <h1 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-silver to-pink-300">
            Puskesmas Babakan
          </h1>
          <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
        </div>
        <p className="text-[9px] text-center text-gray-500">Jadwal Rotasi Dokter</p>
      </header>

      {/* Tab Navigation */}
      <nav className="shrink-0 flex border-b border-holo-border bg-holo-card/50">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 transition-all ${
                isActive
                  ? 'tab-active text-purple-300'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-purple-400' : ''} />
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Tab Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'jadwal' && <JadwalTab />}
        {activeTab === 'dokter' && <DokterTab />}
        {activeTab === 'setting' && <SettingTab />}
      </main>

      {/* Bottom shimmer line */}
      <div className="shrink-0 h-0.5 holo-shimmer bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600" />
    </div>
  );
}

export default App;
