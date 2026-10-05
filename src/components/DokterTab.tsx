import { useState, useEffect } from 'react';
import { Doctor } from '../utils/types';
import { getDoctors, saveDoctors } from '../utils/storage';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

export default function DokterTab() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIsBackup, setNewIsBackup] = useState(false);

  useEffect(() => {
    setDoctors(getDoctors());
  }, []);

  const handleSave = () => {
    saveDoctors(doctors);
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingId(doctor.id);
    setEditName(doctor.name);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editName.trim()) return;
    const updated = doctors.map(d => d.id === editingId ? { ...d, name: editName.trim() } : d);
    setDoctors(updated);
    saveDoctors(updated);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus dokter ini?')) {
      const updated = doctors.filter(d => d.id !== id);
      setDoctors(updated);
      saveDoctors(updated);
    }
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    const newDoctor: Doctor = {
      id: newName.trim().toLowerCase().replace(/[^a-z]/g, ''),
      name: newName.trim(),
      color: `hsl(${Math.random() * 360}, 100%, 60%)`,
      isBackup: newIsBackup,
    };
    const updated = [...doctors, newDoctor];
    setDoctors(updated);
    saveDoctors(updated);
    setShowAdd(false);
    setNewName('');
    setNewIsBackup(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
          Daftar Dokter
        </h2>
        <button
          onClick={() => setShowAdd(true)}
          className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 active:scale-95 transition-transform"
        >
          <Plus size={16} className="text-white" />
        </button>
      </div>

      {/* Doctor List */}
      <div className="space-y-2">
        {doctors.map(doctor => (
          <div
            key={doctor.id}
            className="glass-card rounded-xl p-3 flex items-center gap-3"
          >
            {/* Color indicator */}
            <div
              className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center"
              style={{
                backgroundColor: `${doctor.color}20`,
                border: `2px solid ${doctor.color}`,
                boxShadow: `0 0 10px ${doctor.color}40`,
              }}
            >
              <span className="text-[10px] font-bold" style={{ color: doctor.color }}>
                {doctor.name.replace('dr. ', '').charAt(0)}
              </span>
            </div>

            {/* Name */}
            {editingId === doctor.id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 bg-transparent border-b border-purple-500 text-sm text-white px-1"
                autoFocus
              />
            ) : (
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: doctor.color }}>
                  {doctor.name}
                </div>
                {doctor.isBackup && (
                  <span className="text-[10px] text-gray-400">Cadangan</span>
                )}
              </div>
            )}

            {/* Actions */}
            {editingId === doctor.id ? (
              <div className="flex gap-1">
                <button onClick={handleSaveEdit} className="p-1.5 rounded-lg bg-green-900/40">
                  <Check size={14} className="text-green-400" />
                </button>
                <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg bg-gray-700/40">
                  <X size={14} className="text-gray-400" />
                </button>
              </div>
            ) : (
              <div className="flex gap-1">
                <button onClick={() => handleEdit(doctor)} className="p-1.5 rounded-lg bg-purple-900/40">
                  <Edit2 size={14} className="text-purple-400" />
                </button>
                <button onClick={() => handleDelete(doctor.id)} className="p-1.5 rounded-lg bg-red-900/40">
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Doctor Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-card rounded-xl p-4 w-full max-w-xs">
            <h3 className="text-sm font-bold text-purple-300 mb-3">Tambah Dokter</h3>
            <input
              type="text"
              placeholder="Nama dokter (dr. ...)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-holo-dark border border-purple-700/50 text-sm text-white mb-3"
              autoFocus
            />
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={newIsBackup}
                onChange={(e) => setNewIsBackup(e.target.checked)}
                className="accent-purple-500"
              />
              <span className="text-xs text-gray-300">Dokter Cadangan</span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold"
              >
                Tambah
              </button>
              <button
                onClick={() => { setShowAdd(false); setNewName(''); }}
                className="flex-1 py-2 rounded-lg bg-gray-700 text-gray-300 text-xs"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
