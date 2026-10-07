import { useState, useEffect } from 'react';
import { TabType } from './utils/types';
import JadwalTab from './components/JadwalTab';
import DokterTab from './components/DokterTab';
import SettingTab from './components/SettingTab';
import { Calendar, Users, Settings } from 'lucide-react';
import { initialSync, startAutoPush, onCloudStatus, CloudStatus } from './utils/cloud';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('jadwal');
  const [ready, setReady] = useState(false);
  const [cloud, setCloud] = useState<{ status: CloudStatus; message?: string }>({ status: 'idle' });

  useEffect(() => {
    const offStatus = onCloudStatus((status, message) => setCloud({ status, message }));
    const offPush = startAutoPush();
    initialSync().finally(() => setReady(true));
    return () => {
      offStatus();
      offPush();
    };
  }, []);

  const cloudLabel =
    cloud.status === 'loading' ? '☁️ Memuat…' :
    cloud.status === 'saving' ? '☁️ Menyimpan…' :
    cloud.status === 'saved' ? '☁️ Tersimpan' :
    cloud.status === 'error' ? '⚠️ Gagal sinkron' : '';

  const tabs = [
    { id: 'jadwal' as TabType, label: 'Jadwal', icon: Calendar },
    { id: 'dokter' as TabType, label: 'Dokter', icon: Users },
    { id: 'setting' as TabType, label: 'Setting', icon: Settings },
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-holo-bg overflow-hidden">
      {/* Header */}
      <header className="shrink-0 px-4 py-2.5 bg-white/80 backdrop-blur-md border-b border-purple-200/50 shadow-sm">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <h1 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600">
            Puskesmas Babakan
          </h1>
          <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
        </div>
        <p className="text-[9px] text-center text-gray-400 font-medium tracking-wide">JADWAL ROTASI DOKTER</p>
        {cloudLabel && (
          <p
            className={`text-[9px] text-center font-medium ${cloud.status === 'error' ? 'text-red-500' : 'text-gray-400'}`}
            title={cloud.message || ''}
          >
            {cloudLabel}
          </p>
        )}
        {cloud.status === 'error' && cloud.message && (
          <p className="text-[9px] text-center text-red-500 px-2">
            {cloud.message} Data tetap tersimpan di perangkat ini. Data baru belum dikirim ke spreadsheet; cek tab Setting.
          </p>
        )}
      </header>

      {/* Tab Navigation */}
      <nav className="shrink-0 flex border-b border-purple-200/50 bg-white/60 backdrop-blur-sm">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-all ${
                isActive
                  ? 'tab-active text-purple-700'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-purple-600' : ''} />
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Tab Content */}
      <main className="flex-1 overflow-hidden">
        {!ready ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-purple-500">
            <div className="w-8 h-8 rounded-full border-[3px] border-purple-200 border-t-purple-500 animate-spin" />
            <span className="text-xs">Memuat data dari spreadsheet…</span>
          </div>
        ) : (
          <>
            {activeTab === 'jadwal' && <JadwalTab />}
            {activeTab === 'dokter' && <DokterTab />}
            {activeTab === 'setting' && <SettingTab />}
          </>
        )}
      </main>

      {/* Bottom gradient line */}
      <div className="shrink-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-60" />
    </div>
  );
}

export default App;
