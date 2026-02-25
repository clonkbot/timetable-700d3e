import { useState, useEffect } from 'react';
import { TimeSlot, DaySchedule } from './components/TimeSlot';
import { AddSlotModal } from './components/AddSlotModal';

export interface ScheduleItem {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  title: string;
  color: 'coral' | 'sage' | 'blue' | 'charcoal';
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const STORAGE_KEY = 'timetable-data';

function App() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
  }, [schedule]);

  const handleAddSlot = (day: string) => {
    setSelectedDay(day);
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditSlot = (item: ScheduleItem) => {
    setEditingItem(item);
    setSelectedDay(item.day);
    setIsModalOpen(true);
  };

  const handleSaveSlot = (item: Omit<ScheduleItem, 'id'> & { id?: string }) => {
    if (item.id) {
      setSchedule(prev => prev.map(s => s.id === item.id ? { ...item, id: item.id } as ScheduleItem : s));
    } else {
      const newItem: ScheduleItem = {
        ...item,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
      setSchedule(prev => [...prev, newItem]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteSlot = (id: string) => {
    setSchedule(prev => prev.filter(s => s.id !== id));
  };

  const getScheduleForDay = (day: string) => {
    return schedule
      .filter(item => item.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6] relative overflow-x-hidden">
      {/* Texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header className="relative border-b-4 border-[#1A1A1A] bg-[#F5F0E6]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-[#FF6B4A] rotate-45" />
                <span className="text-xs md:text-sm font-mono text-[#1A1A1A]/60 tracking-widest uppercase">
                  Weekly Schedule
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-[#1A1A1A] tracking-tight leading-none">
                TIME<span className="text-[#FF6B4A]">.</span>TABLE
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm font-mono text-[#1A1A1A]/50">
              <span className="hidden sm:inline">Entries:</span>
              <span className="px-2 py-1 bg-[#1A1A1A] text-[#F5F0E6] font-bold">
                {schedule.length}
              </span>
            </div>
          </div>
        </div>
        {/* Decorative line */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6B4A] via-[#3B5BDB] to-[#8B9A82]" />
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {DAYS.map((day, index) => (
            <DaySchedule
              key={day}
              day={day}
              items={getScheduleForDay(day)}
              onAddSlot={() => handleAddSlot(day)}
              onEditSlot={handleEditSlot}
              onDeleteSlot={handleDeleteSlot}
              animationDelay={index * 0.05}
            />
          ))}
        </div>

        {schedule.length === 0 && (
          <div className="mt-8 md:mt-16 text-center">
            <div className="inline-block p-6 md:p-8 border-4 border-dashed border-[#1A1A1A]/20 bg-white/50">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 border-4 border-[#1A1A1A]/20 flex items-center justify-center">
                <span className="text-2xl md:text-3xl">+</span>
              </div>
              <p className="font-display text-lg md:text-xl font-bold text-[#1A1A1A]/40">
                Your timetable is empty
              </p>
              <p className="font-body text-sm md:text-base text-[#1A1A1A]/30 mt-2">
                Click &quot;Add&quot; on any day to get started
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#F5F0E6]/90 backdrop-blur-sm border-t-2 border-[#1A1A1A]/10 py-3 md:py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="font-mono text-[10px] md:text-xs text-[#1A1A1A]/40 tracking-wide">
            Requested by <span className="text-[#1A1A1A]/60">@Nishant293</span> · Built by <span className="text-[#1A1A1A]/60">@clonkbot</span>
          </p>
        </div>
      </footer>

      {/* Modal */}
      {isModalOpen && selectedDay && (
        <AddSlotModal
          day={selectedDay}
          editingItem={editingItem}
          onSave={handleSaveSlot}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
