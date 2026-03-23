import { formatDate, formatTime, durationLabel } from '../../utils/dateHelpers';

export default function ConfirmationScreen({ booking }) {
  const { meetingType, host, start_time, end_time, guest_name, guest_email } = booking;

  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">✓</span>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">You're confirmed!</h2>
      <p className="text-gray-500 text-sm mb-6">A confirmation will be sent to {guest_email}</p>

      <div className="bg-gray-50 rounded-xl p-5 text-left space-y-3 mb-6">
        <div className="flex gap-3">
          <span className="text-gray-400">📅</span>
          <div>
            <p className="text-sm font-medium text-gray-900">{formatDate(start_time)}</p>
            <p className="text-sm text-gray-500">{formatTime(start_time)} · {durationLabel(meetingType.duration)}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="text-gray-400">👤</span>
          <div>
            <p className="text-sm font-medium text-gray-900">{meetingType.title}</p>
            <p className="text-sm text-gray-500">with {host.username}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="text-gray-400">📧</span>
          <div>
            <p className="text-sm font-medium text-gray-900">{guest_name}</p>
            <p className="text-sm text-gray-500">{guest_email}</p>
          </div>
        </div>
      </div>

      <a
        href="/"
        className="inline-block bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Book another meeting
      </a>
    </div>
  );
}
