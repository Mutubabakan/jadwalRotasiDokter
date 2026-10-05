import { useState } from 'react';
import { X, Check, Palette } from 'lucide-react';

interface ColorPickerModalProps {
  currentColor: string;
  onConfirm: (color: string) => void;
  onClose: () => void;
}

// Standard color palette
const standardColors = [
  '#1565c0', // Blue (dr. Santi)
  '#c2185b', // Pink (dr. Rakean)
  '#388e3c', // Green (dr. Afif)
  '#f57c00', // Orange (dr. Likha)
  '#7b1fa2', // Purple (dr. Abdi)
  '#00838f', // Teal
  '#d32f2f', // Red
  '#5d4037', // Brown
  '#455a64', // Blue Grey
  '#fbc02d', // Yellow
  '#8e24aa', // Deep Purple
  '#00acc1', // Cyan
  '#e64a19', // Deep Orange
  '#3949ab', // Indigo
  '#689f38', // Light Green
];

// Honeycomb colors (60 colors arranged in hexagonal pattern)
const honeycombColors = [
  // Reds
  '#ffebee', '#ffcdd2', '#ef9a9a', '#e57373', '#ef5350', '#f44336', '#e53935', '#d32f2f', '#c62828', '#b71c1c',
  // Pinks
  '#fce4ec', '#f8bbd0', '#f48fb1', '#f06292', '#ec407a', '#e91e63', '#d81b60', '#c2185b', '#ad1457', '#880e4f',
  // Purples
  '#f3e5f5', '#e1bee7', '#ce93d8', '#ba68c8', '#ab47bc', '#9c27b0', '#8e24aa', '#7b1fa2', '#6a1b9a', '#4a148c',
  // Deep Purples
  '#ede7f6', '#d1c4e9', '#b39ddb', '#9575cd', '#7e57c2', '#673ab7', '#5e35b1', '#512da8', '#4527a0', '#311b92',
  // Indigos
  '#e8eaf6', '#c5cae9', '#9fa8da', '#7986cb', '#5c6bc0', '#3f51b5', '#3949ab', '#303f9f', '#283593', '#1a237e',
  // Blues
  '#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1',
  // Light Blues
  '#e1f5fe', '#b3e5fc', '#81d4fa', '#4fc3f7', '#29b6f6', '#03a9f4', '#039be5', '#0288d1', '#0277bd', '#01579b',
  // Cyans
  '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064',
  // Teals
  '#e0f2f1', '#b2dfdb', '#80cbc4', '#4db6ac', '#26a69a', '#009688', '#00897b', '#00796b', '#00695c', '#004d40',
  // Greens
  '#e8f5e9', '#c8e6c9', '#a5d6a7', '#81c784', '#66bb6a', '#4caf50', '#43a047', '#388e3c', '#2e7d32', '#1b5e20',
  // Light Greens
  '#f1f8e9', '#dcedc8', '#c5e1a5', '#aed581', '#9ccc65', '#8bc34a', '#7cb342', '#689f38', '#558b2f', '#33691e',
  // Limes
  '#f9fbe7', '#f0f4c3', '#e6ee9c', '#dce775', '#d4e157', '#cddc39', '#c0ca33', '#afb42b', '#9e9d24', '#827717',
  // Yellows
  '#fffde7', '#fff9c4', '#fff59d', '#fff176', '#ffee58', '#ffeb3b', '#fdd835', '#fbc02d', '#f9a825', '#f57f17',
  // Ambers
  '#fff8e1', '#ffecb3', '#ffe082', '#ffd54f', '#ffca28', '#ffc107', '#ffb300', '#ffa000', '#ff8f00', '#ff6f00',
  // Oranges
  '#fff3e0', '#ffe0b2', '#ffcc80', '#ffb74d', '#ffa726', '#ff9800', '#fb8c00', '#f57c00', '#ef6c00', '#e65100',
  // Deep Oranges
  '#fbe9e7', '#ffccbc', '#ffab91', '#ff8a65', '#ff7043', '#ff5722', '#f4511e', '#e64a19', '#d84315', '#bf360c',
  // Browns
  '#efebe9', '#d7ccc8', '#bcaaa4', '#a1887f', '#8d6e63', '#795548', '#6d4c41', '#5d4037', '#4e342e', '#3e2723',
  // Greys
  '#fafafa', '#f5f5f5', '#eeeeee', '#e0e0e0', '#bdbdbd', '#9e9e9e', '#757575', '#616161', '#424242', '#212121',
  // Blue Greys
  '#eceff1', '#cfd8dc', '#b0bec5', '#90a4ae', '#78909c', '#607d8b', '#546e7a', '#455a64', '#37474f', '#263238',
];

export default function ColorPickerModal({ currentColor, onConfirm, onClose }: ColorPickerModalProps) {
  const [selectedColor, setSelectedColor] = useState(currentColor);
  const [mode, setMode] = useState<'standard' | 'custom'>('standard');
  const [customColor, setCustomColor] = useState(currentColor);

  const handleStandardSelect = (color: string) => {
    setSelectedColor(color);
    setCustomColor(color);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    setSelectedColor(color);
  };

  const handleConfirm = () => {
    onConfirm(selectedColor);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
      <div className="glass-card rounded-2xl p-4 w-full max-w-sm holo-border-gradient max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-purple-700 flex items-center gap-1.5">
            <Palette size={14} /> Pilih Warna
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Current Color Preview */}
        <div className="mb-3 p-2 rounded-xl bg-gray-50 border border-purple-200 flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full border-2 border-white shadow-md"
            style={{ backgroundColor: selectedColor, boxShadow: `0 0 8px ${selectedColor}40` }}
          />
          <div className="flex-1">
            <div className="text-[10px] text-gray-500">Warna dipilih:</div>
            <div className="text-xs font-mono font-bold" style={{ color: selectedColor }}>
              {selectedColor.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-1 mb-3 p-1 rounded-xl bg-gray-100">
          <button
            onClick={() => setMode('standard')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === 'standard' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500'
            }`}
          >
            Standar
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === 'custom' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500'
            }`}
          >
            Custom
          </button>
        </div>

        {/* Standard Palette */}
        {mode === 'standard' && (
          <div className="grid grid-cols-5 gap-2 mb-3">
            {standardColors.map((color) => (
              <button
                key={color}
                onClick={() => handleStandardSelect(color)}
                className={`aspect-square rounded-xl border-2 transition-all active:scale-90 ${
                  selectedColor === color ? 'border-purple-600 scale-110 shadow-lg' : 'border-white'
                }`}
                style={{
                  backgroundColor: color,
                  boxShadow: selectedColor === color ? `0 0 12px ${color}60` : `0 1px 3px ${color}30`,
                }}
              />
            ))}
          </div>
        )}

        {/* Custom Honeycomb Palette */}
        {mode === 'custom' && (
          <div className="mb-3">
            {/* Honeycomb Grid */}
            <div className="bg-gray-50 rounded-xl p-2 border border-purple-200">
              <div className="grid grid-cols-10 gap-0.5">
                {honeycombColors.map((color, idx) => {
                  // Create honeycomb effect by offsetting odd rows
                  const row = Math.floor(idx / 10);
                  const isOddRow = row % 2 === 1;
                  
                  return (
                    <button
                      key={`${color}-${idx}`}
                      onClick={() => handleStandardSelect(color)}
                      className={`aspect-square rounded-md border transition-all active:scale-75 ${
                        selectedColor === color 
                          ? 'border-purple-600 scale-125 shadow-lg z-10' 
                          : 'border-white/50 hover:scale-110'
                      } ${isOddRow ? 'translate-x-1.5' : ''}`}
                      style={{
                        backgroundColor: color,
                        boxShadow: selectedColor === color ? `0 0 8px ${color}60` : 'none',
                      }}
                      title={color}
                    />
                  );
                })}
              </div>
            </div>

            {/* Custom Color Input */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="color"
                value={customColor}
                onChange={handleCustomChange}
                className="w-10 h-10 rounded-lg border border-purple-200 cursor-pointer"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                    setCustomColor(val);
                    if (val.length === 7) {
                      setSelectedColor(val);
                    }
                  }
                }}
                className="flex-1 px-3 py-2 rounded-lg bg-gray-50 border border-purple-200 text-xs font-mono text-gray-700"
                placeholder="#000000"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Check size={12} /> Pilih
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-xs"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
