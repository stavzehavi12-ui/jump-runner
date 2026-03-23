const db = require('../db/database');

/**
 * Returns available booking slots for a given date.
 * @param {number} userId - Host's user ID
 * @param {object} meetingType - { id, duration, buffer_time }
 * @param {string} dateString - "YYYY-MM-DD"
 * @returns {Array<{ start: string, end: string }>} ISO datetime strings
 */
function getAvailableSlots(userId, meetingType, dateString) {
  const date = new Date(dateString + 'T00:00:00');
  const dayOfWeek = date.getDay();

  // Get host's availability window for this weekday
  const avail = db.prepare(
    'SELECT start_time, end_time FROM availability WHERE user_id = ? AND day_of_week = ?'
  ).get(userId, dayOfWeek);

  if (!avail) return [];

  const windowStart = new Date(dateString + 'T' + avail.start_time + ':00');
  const windowEnd = new Date(dateString + 'T' + avail.end_time + ':00');

  // Get all confirmed bookings for this host on this date (across all meeting types)
  const dayStart = dateString + 'T00:00:00';
  const dayEnd = dateString + 'T23:59:59';

  const existingBookings = db.prepare(`
    SELECT b.start_time, b.end_time
    FROM bookings b
    INNER JOIN meeting_types mt ON b.meeting_type_id = mt.id
    WHERE mt.user_id = ?
      AND b.status = 'confirmed'
      AND b.start_time >= ?
      AND b.start_time <= ?
  `).all(userId, dayStart, dayEnd);

  const duration = meetingType.duration; // minutes
  const buffer = meetingType.buffer_time || 0; // minutes
  const slotBlock = duration + buffer; // total minutes occupied per booking

  // Generate candidate slots
  const slots = [];
  let cursor = windowStart.getTime();
  const windowEndMs = windowEnd.getTime();
  const durationMs = duration * 60 * 1000;
  const blockMs = slotBlock * 60 * 1000;

  while (cursor + durationMs <= windowEndMs) {
    const slotStart = cursor;
    const slotEnd = cursor + durationMs;
    const blockedUntil = cursor + blockMs;

    // Check conflict with existing bookings
    const hasConflict = existingBookings.some(booking => {
      const bStart = new Date(booking.start_time).getTime();
      const bEnd = new Date(booking.end_time).getTime();
      return bStart < blockedUntil && bEnd > slotStart;
    });

    if (!hasConflict) {
      slots.push({
        start: new Date(slotStart).toISOString().slice(0, 19),
        end: new Date(slotEnd).toISOString().slice(0, 19),
      });
    }

    cursor += blockMs;
  }

  // Filter out slots that are in the past (require at least 30 min lead time)
  const minBookingTime = Date.now() + 30 * 60 * 1000;
  return slots.filter(slot => new Date(slot.start).getTime() >= minBookingTime);
}

module.exports = { getAvailableSlots };
