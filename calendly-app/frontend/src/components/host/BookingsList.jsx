import { formatDate, formatTime, durationLabel } from '../../utils/dateHelpers';

export default function BookingsList({ bookings }) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-4xl mb-3">📅</div>
        <p className="font-medium">No upcoming bookings</p>
        <p className="text-sm mt-1">Share your booking links to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Guest</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Meeting</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date & Time</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Duration</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {bookings.map(b => (
            <tr key={b.id} className="hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="font-medium text-gray-900">{b.guest_name}</div>
                <div className="text-gray-400">{b.guest_email}</div>
              </td>
              <td className="py-3 px-4 text-gray-700">{b.meetingType.title}</td>
              <td className="py-3 px-4">
                <div className="text-gray-900">{formatDate(b.start_time)}</div>
                <div className="text-gray-500">{formatTime(b.start_time)}</div>
              </td>
              <td className="py-3 px-4">
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {durationLabel(b.meetingType.duration)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
