import { useState, useEffect } from 'react';
import { Doctor } from '../utils/types';
import { getDoctors, saveDoctors } from '../utils/storage';
import { Plus, Edit2, Trash2, X, Check, Palette } from 'lucide-react';
import ColorPickerModal from './ColorPickerModal';

export default function DokterTab() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIsBackup, setNewIsBackup] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerDoctorId, setColorPickerDoctorId] = useState<string | null>(null);
  const [newDoctorColor, setNewDoctorColor] = useState('#1565c0');

  useEffect(() => {
    setDoctors(getDoctors());
  }, []);

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
      id: newName.trim().toLowerCase().replace(/[^a-z]/g, '') + Date.now(),
      name: newName.trim(),
      color: newDoctorColor,
      isBackup: newIsBackup,
    };
    const updated = [...doctors, newDoctor];
    setDoctors(updated);
    saveDoctors(updated);
    setShowAdd(false);
    setNewName('');
    setNewIsBackup(false);
    setNewDoctorColor('#1565c0');
  };

  const handleColorChange = (doctorId: string, newColor: string) => {
    const updated = doctors.map(d => 
      d.id === doctorId ? { ...d, color: newColor } : d
    );
    setDoctors(updated);
    saveDoctors(updated);
    setShowColorPicker(false);
    setColorPickerDoctorId(null);
  };

  const openColorPicker = (doctorId: string) => {
    setColorPickerDoctorId(doctorId);
    setShowColorPicker(true);
  };

  const getSelectedColor = () => {
    if (colorPickerDoctorId) {
      const doctor = doctors.find(d => d.id === colorPickerDoctorId);
      return doctor?.color || '#1565c0';
    }
    return '#1565c0';
  };

  return (
    <div className="p-4 space-y-4 overflow-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Daftar Dokter
        </h2>
        <button
          onClick={() => setShowAdd(true)}
          className="p-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 active:scale-95 transition-transform shadow-sm"
        >
          <Plus size={16} className="text-white" />
        </button>
      </div>

      <div className="space-y-2">
        {doctors.map(doctor => (
          <div
            key={doctor.id}
            className="glass-card rounded-2xl p-3 flex items-center gap-3 holo-border-gradient"
          >
            <button
              onClick={() => openColorPicker(doctor.id)}
              className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center relative group"
              style={{
                backgroundColor: `${doctor.color}15`,
                border: `2px solid ${doctor.color}`,
                boxShadow: `0 0 8px ${doctor.color}25`,
              }}
              title="Ubah warna"
            >
              <span className="text-xs font-bold" style={{ color: doctor.color }}>
                {doctor.name.replace('dr. ', '').charAt(0)}
              </span>
              <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Palette size={12} className="text-white" />
              </div>
            </button>

            {editingId === doctor.id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 bg-gray-50 border border-purple-200 rounded-lg text-sm text-gray-700 px-2 py-1"
                autoFocus
              />
            ) : (
              <div className="flex-1">
                <div className="text-sm font-bold" style={{ color: doctor.color }}>
                  {doctor.name}
                </div>
                {doctor.isBackup && (
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">Cadangan</span>
                )}
              </div>
            )}

            {editingId === doctor.id ? (
              <div className="flex gap-1">
                <button onClick={handleSaveEdit} className="p-2 rounded-xl bg-green-50 border border-green-200">
                  <Check size={14} className="text-green-600" />
                </button>
                <button onClick={() => setEditingId(null)} className="p-2 rounded-xl bg-gray-100">
                  <X size={14} className="text-gray-500" />
                </button>
              </div>
            ) : (
              <div className="flex gap-1">
                <button onClick={() => { setEditingId(doctor.id); setEditName(doctor.name); }} className="p-2 rounded-xl bg-purple-50 border border-purple-200">
                  <Edit2 size={14} className="text-purple-600" />
                </button>
                <button onClick={() => handleDelete(doctor.id)} className="p-2 rounded-xl bg-red-50 border border-red-200">
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Doctor Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
          <div className="glass-card rounded-2xl p-4 w-full max-w-xs holo-border-gradient">
            <h3 className="text-sm font-bold text-purple-700 mb-3">Tambah Dokter</h3>
            <input
              type="text"
              placeholder="Nama dokter (dr. ...)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-purple-200 text-sm text-gray-700 mb-3"
              autoFocus
            />
            
            {/* Color Picker for New Doctor */}
            <div className="mb-3">
              <label className="text-xs text-gray-600 mb-1.5 block">Warna:</label>
              <button
                onClick={() => {
                  setColorPickerDoctorId('new');
                  setShowColorPicker(true);
                }}
                className="w-full flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-purple-200"
              >
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: newDoctorColor, boxShadow: `0 0 8px ${newDoctorColor}40` }}
                />
                <span className="text-xs font-mono text-gray-600">{newDoctorColor.toUpperCase()}</span>
                <Palette size={14} className="ml-auto text-purple-500" />
              </button>
            </div>

            <label className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-purple-50/50">
              <input
                type="checkbox"
                checked={newIsBackup}
                onChange={(e) => setNewIsBackup(e.target.checked)}
                className="accent-purple-500"
              />
              <span className="text-xs text-gray-600">Dokter Cadangan</span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold shadow-sm"
              >
                Tambah
              </button>
              <button
                onClick={() => { setShowAdd(false); setNewName(''); }}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-xs"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Color Picker Modal */}
      {showColorPicker && (
        <ColorPickerModal
          currentColor={colorPickerDoctorId === 'new' ? newDoctorColor : getSelectedColor()}
          onConfirm={(color) => {
            if (colorPickerDoctorId === 'new') {
              setNewDoctorColor(color);
            } else if (colorPickerDoctorId) {
              handleColorChange(colorPickerDoctorId, color);
            }
            setShowColorPicker(false);
            setColorPickerDoctorId(null);
          }}
          onClose={() => {
            setShowColorPicker(false);
            setColorPickerDoctorId(null);
          }}
        />
      )}
    </div>
  );
}
