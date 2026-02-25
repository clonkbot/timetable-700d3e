import { ScheduleItem } from '../App';

interface TimeSlotProps {
  item: ScheduleItem;
  onEdit: (item: ScheduleItem) => void;
  onDelete: (id: string) => void;
}

const colorStyles = {
  coral: {
    bg: 'bg-[#FF6B4A]',
    text: 'text-white',
    border: 'border-[#FF6B4A]',
    accent: '#FF6B4A',
  },
  sage: {
    bg: 'bg-[#8B9A82]',
    text: 'text-white',
    border: 'border-[#8B9A82]',
    accent: '#8B9A82',
  },
  blue: {
    bg: 'bg-[#3B5BDB]',
    text: 'text-white',
    border: 'border-[#3B5BDB]',
    accent: '#3B5BDB',
  },
  charcoal: {
    bg: 'bg-[#1A1A1A]',
    text: 'text-[#F5F0E6]',
    border: 'border-[#1A1A1A]',
    accent: '#1A1A1A',
  },
};

export function TimeSlot({ item, onEdit, onDelete }: TimeSlotProps) {
  const styles = colorStyles[item.color];

  return (
    <div
      className={`group relative ${styles.bg} ${styles.text} p-3 md:p-4 transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer`}
      style={{
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
      }}
      onClick={() => onEdit(item)}
    >
      {/* Time badge */}
      <div className="flex items-center gap-1 mb-2 font-mono text-[10px] md:text-xs opacity-80">
        <span>{item.startTime}</span>
        <span className="inline-block w-2 md:w-3 h-px bg-current" />
        <span>{item.endTime}</span>
      </div>

      {/* Title */}
      <h4 className="font-display font-bold text-sm md:text-base leading-tight pr-6">
        {item.title}
      </h4>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="absolute top-2 right-2 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/30"
        aria-label="Delete slot"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 2L10 10M10 2L2 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Corner cut decoration */}
      <div
        className="absolute bottom-0 right-0 w-2 h-2 bg-[#F5F0E6]"
        style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
      />
    </div>
  );
}

interface DayScheduleProps {
  day: string;
  items: ScheduleItem[];
  onAddSlot: () => void;
  onEditSlot: (item: ScheduleItem) => void;
  onDeleteSlot: (id: string) => void;
  animationDelay: number;
}

export function DaySchedule({
  day,
  items,
  onAddSlot,
  onEditSlot,
  onDeleteSlot,
  animationDelay,
}: DayScheduleProps) {
  const isWeekend = day === 'Saturday' || day === 'Sunday';

  return (
    <div
      className="group/day bg-white border-3 border-[#1A1A1A] relative animate-fade-in"
      style={{
        animationDelay: `${animationDelay}s`,
        borderWidth: '3px',
      }}
    >
      {/* Day header */}
      <div
        className={`px-3 md:px-4 py-2 md:py-3 border-b-3 border-[#1A1A1A] flex items-center justify-between ${
          isWeekend ? 'bg-[#1A1A1A]' : 'bg-[#F5F0E6]'
        }`}
        style={{ borderBottomWidth: '3px' }}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 md:w-3 md:h-3 ${isWeekend ? 'bg-[#FF6B4A]' : 'bg-[#3B5BDB]'}`}
          />
          <h3
            className={`font-display font-bold text-sm md:text-base uppercase tracking-wide ${
              isWeekend ? 'text-[#F5F0E6]' : 'text-[#1A1A1A]'
            }`}
          >
            {day.slice(0, 3)}
          </h3>
        </div>
        <span
          className={`font-mono text-[10px] md:text-xs ${
            isWeekend ? 'text-[#F5F0E6]/50' : 'text-[#1A1A1A]/30'
          }`}
        >
          {items.length}
        </span>
      </div>

      {/* Time slots */}
      <div className="p-2 md:p-3 min-h-[120px] md:min-h-[150px] space-y-2">
        {items.map((item) => (
          <TimeSlot
            key={item.id}
            item={item}
            onEdit={onEditSlot}
            onDelete={onDeleteSlot}
          />
        ))}

        {items.length === 0 && (
          <div className="h-full min-h-[80px] md:min-h-[100px] flex items-center justify-center">
            <span className="font-mono text-[10px] md:text-xs text-[#1A1A1A]/20 uppercase tracking-wider">
              Empty
            </span>
          </div>
        )}
      </div>

      {/* Add button */}
      <button
        onClick={onAddSlot}
        className="w-full px-4 py-2 md:py-3 border-t-3 border-[#1A1A1A] bg-[#F5F0E6] hover:bg-[#1A1A1A] hover:text-[#F5F0E6] transition-colors font-display font-bold text-xs md:text-sm uppercase tracking-wider flex items-center justify-center gap-2"
        style={{ borderTopWidth: '3px' }}
      >
        <span className="text-base md:text-lg leading-none">+</span>
        <span>Add</span>
      </button>

      {/* Decorative corner */}
      <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-[#FF6B4A] opacity-0 group-hover/day:opacity-100 transition-opacity" />
    </div>
  );
}
