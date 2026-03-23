import { useState } from 'react';
import { formatDate, formatTime, durationLabel } from '../../utils/dateHelpers';

export default function BookingForm({ slot, meetingType, host, onSubmit, onBack, loading, error }) {
  const [form, setForm] = useState({ guest_name: '', guest_email: '' });

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div>
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <p className="text-sm font-medium text-blue-900">{meetingType.title}</p>
        <p className="text-sm text-blue-700 mt-0.5">
          {formatDate(slot.start)} at {formatTime(slot.start)} · {durationLabel(meetingType.duration)}
        </p>
        <p className="text-xs text-blue-500 mt-0.5">with {host.username} ({host.timezone})</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your name *</label>
          <input
            type="text"
            value={form.guest_name}
            onChange={e => setForm(f => ({ ...f, guest_name: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Jane Smith"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email address *</label>
          <input
            type="email"
            value={form.guest_email}
            onChange={e => setForm(f => ({ ...f, guest_email: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="you@email.com"
            required
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Confirming...' : 'Confirm booking'}
          </button>
        </div>
      </form>
    </div>
  );
}
