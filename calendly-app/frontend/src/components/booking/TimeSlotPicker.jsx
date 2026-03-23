import { formatTime } from '../../utils/dateHelpers';

export default function TimeSlotPicker({ slots, loading, selectedSlot, onSelect }) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="font-medium">No available slots</p>
        <p className="text-sm mt-1">Try selecting a different date</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
      {slots.map(slot => {
        const isSelected = selectedSlot?.start === slot.start;
        return (
          <button
            key={slot.start}
            onClick={() => onSelect(slot)}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
              isSelected
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            {formatTime(slot.start)}
          </button>
        );
      })}
    </div>
  );
}
