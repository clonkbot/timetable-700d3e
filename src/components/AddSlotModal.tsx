import { useState, useEffect } from 'react';
import { ScheduleItem } from '../App';

interface AddSlotModalProps {
  day: string;
  editingItem: ScheduleItem | null;
  onSave: (item: Omit<ScheduleItem, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

type ColorOption = 'coral' | 'sage' | 'blue' | 'charcoal';

const colorOptions: { value: ColorOption; bg: string; label: string }[] = [
  { value: 'coral', bg: 'bg-[#FF6B4A]', label: 'Coral' },
  { value: 'sage', bg: 'bg-[#8B9A82]', label: 'Sage' },
  { value: 'blue', bg: 'bg-[#3B5BDB]', label: 'Blue' },
  { value: 'charcoal', bg: 'bg-[#1A1A1A]', label: 'Dark' },
];

export function AddSlotModal({ day, editingItem, onSave, onClose }: AddSlotModalProps) {
  const [title, setTitle] = useState(editingItem?.title || '');
  const [startTime, setStartTime] = useState(editingItem?.startTime || '09:00');
  const [endTime, setEndTime] = useState(editingItem?.endTime || '10:00');
  const [color, setColor] = useState<ColorOption>(editingItem?.color || 'coral');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: editingItem?.id,
      day,
      title: title.trim(),
      startTime,
      endTime,
      color,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1A1A1A]/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-[#F5F0E6] border-4 border-[#1A1A1A] animate-scale-in"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
        }}
      >
        {/* Corner decoration */}
        <div
          className="absolute top-0 right-0 w-4 h-4 bg-[#FF6B4A]"
          style={{ clipPath: 'polygon(0 0, 100% 100%, 100% 0)' }}
        />

        {/* Header */}
        <div className="px-4 md:px-6 py-4 border-b-4 border-[#1A1A1A] flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] md:text-xs text-[#1A1A1A]/50 uppercase tracking-wider">
              {editingItem ? 'Edit Entry' : 'New Entry'}
            </span>
            <h2 className="font-display text-xl md:text-2xl font-bold text-[#1A1A1A]">
              {day}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 md:w-12 md:h-12 border-3 border-[#1A1A1A] flex items-center justify-center hover:bg-[#1A1A1A] hover:text-[#F5F0E6] transition-colors"
            style={{ borderWidth: '3px' }}
            aria-label="Close modal"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Title */}
          <div>
            <label className="block font-mono text-[10px] md:text-xs text-[#1A1A1A]/50 uppercase tracking-wider mb-2">
              Activity
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Math Class, Gym, Meeting..."
              className="w-full px-4 py-3 bg-white border-3 border-[#1A1A1A] font-body text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#3B5BDB] focus:ring-offset-2"
              style={{ borderWidth: '3px' }}
              autoFocus
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block font-mono text-[10px] md:text-xs text-[#1A1A1A]/50 uppercase tracking-wider mb-2">
                Start
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 md:px-4 py-3 bg-white border-3 border-[#1A1A1A] font-mono text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#3B5BDB] focus:ring-offset-2"
                style={{ borderWidth: '3px' }}
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] md:text-xs text-[#1A1A1A]/50 uppercase tracking-wider mb-2">
                End
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 md:px-4 py-3 bg-white border-3 border-[#1A1A1A] font-mono text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#3B5BDB] focus:ring-offset-2"
                style={{ borderWidth: '3px' }}
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block font-mono text-[10px] md:text-xs text-[#1A1A1A]/50 uppercase tracking-wider mb-3">
              Color
            </label>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {colorOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setColor(opt.value)}
                  className={`flex-1 min-w-[60px] px-3 py-2 md:py-3 ${opt.bg} text-white font-display font-bold text-xs uppercase transition-all ${
                    color === opt.value
                      ? 'ring-4 ring-offset-2 ring-[#1A1A1A]'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full px-6 py-4 bg-[#1A1A1A] text-[#F5F0E6] font-display font-bold text-sm md:text-base uppercase tracking-wider hover:bg-[#FF6B4A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <span>{editingItem ? 'Update' : 'Add to Schedule'}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>

        {/* Decorative stamp */}
        <div className="absolute -bottom-3 -left-3 w-8 h-8 md:w-10 md:h-10 bg-[#3B5BDB] rotate-12 flex items-center justify-center">
          <span className="text-white font-display font-bold text-sm md:text-base">+</span>
        </div>
      </div>
    </div>
  );
}
