import { getDayName } from '../../utils/dateHelpers';

const DAYS = [0, 1, 2, 3, 4, 5, 6];

export default function AvailabilityGrid({ slots, onChange }) {
  function isEnabled(day) {
    return slots.some(s => s.day_of_week === day);
  }

  function getSlot(day) {
    return slots.find(s => s.day_of_week === day) || { start_time: '09:00', end_time: '17:00' };
  }

  function toggleDay(day) {
    if (isEnabled(day)) {
      onChange(slots.filter(s => s.day_of_week !== day));
    } else {
      onChange([...slots, { day_of_week: day, start_time: '09:00', end_time: '17:00' }].sort((a, b) => a.day_of_week - b.day_of_week));
    }
  }

  function updateTime(day, field, value) {
    onChange(slots.map(s =>
      s.day_of_week === day ? { ...s, [field]: value } : s
    ));
  }

  return (
    <div className="space-y-3">
      {DAYS.map(day => {
        const enabled = isEnabled(day);
        const slot = getSlot(day);
        return (
          <div key={day} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${enabled ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'}`}>
            <label className="flex items-center gap-3 min-w-0 cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => toggleDay(day)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className={`text-sm font-medium w-24 ${enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                {getDayName(day)}
              </span>
            </label>

            {enabled ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="time"
                  value={slot.start_time}
                  onChange={e => updateTime(day, 'start_time', e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-400 text-sm">–</span>
                <input
                  type="time"
                  value={slot.end_time}
                  onChange={e => updateTime(day, 'end_time', e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <span className="text-sm text-gray-400 flex-1">Unavailable</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
