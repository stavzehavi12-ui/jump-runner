import { useState } from 'react';
import { toDateString, getDayShort } from '../../utils/dateHelpers';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarPicker({ availableDays, selectedDate, onSelect }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function prevMonth() {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function nextMonth() {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  function isSelectable(day) {
    const date = new Date(year, month, day);
    if (date < today) return false;
    return availableDays.includes(date.getDay());
  }

  function handleClick(day) {
    if (!isSelectable(day)) return;
    const date = new Date(year, month, day);
    onSelect(toDateString(date));
  }

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const canGoBack = new Date(year, month, 1) > new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={!canGoBack}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ←
        </button>
        <h3 className="font-semibold text-gray-900">{MONTHS[month]} {year}</h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const selectable = isSelectable(day);
          const dateStr = toDateString(new Date(year, month, day));
          const isSelected = selectedDate === dateStr;

          return (
            <button
              key={i}
              onClick={() => handleClick(day)}
              disabled={!selectable}
              className={`
                aspect-square rounded-full text-sm font-medium transition-all
                ${isSelected ? 'bg-blue-600 text-white' : ''}
                ${selectable && !isSelected ? 'hover:bg-blue-50 text-gray-900 cursor-pointer' : ''}
                ${!selectable ? 'text-gray-300 cursor-not-allowed' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
