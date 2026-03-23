import { useState } from 'react';
import { durationLabel } from '../../utils/dateHelpers';
import { deleteMeetingType } from '../../utils/api';

export default function MeetingTypeCard({ meetingType, username, onDeleted }) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const bookingUrl = `${window.location.origin}/${username}/${meetingType.slug}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDelete() {
    if (!confirm(`Delete "${meetingType.title}"? This will also cancel any bookings.`)) return;
    setDeleting(true);
    try {
      await deleteMeetingType(meetingType.id);
      onDeleted(meetingType.id);
    } catch (err) {
      alert(err.message);
      setDeleting(false);
    }
  }

  const durationColors = {
    15: 'bg-green-50 text-green-700',
    30: 'bg-blue-50 text-blue-700',
    60: 'bg-purple-50 text-purple-700',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base truncate">{meetingType.title}</h3>
          {meetingType.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{meetingType.description}</p>
          )}
        </div>
        <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${durationColors[meetingType.duration] || 'bg-gray-100 text-gray-600'}`}>
          {durationLabel(meetingType.duration)}
        </span>
      </div>

      {meetingType.buffer_time > 0 && (
        <p className="text-xs text-gray-400">+ {meetingType.buffer_time} min buffer</p>
      )}

      <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-2 text-xs text-gray-500 font-mono overflow-hidden">
        <span className="truncate flex-1">{window.location.host}/{username}/{meetingType.slug}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 text-sm font-medium border border-gray-200 text-gray-700 rounded-lg py-2 hover:bg-gray-50 transition-colors"
        >
          {copied ? '✓ Copied!' : 'Copy link'}
        </button>
        <a
          href={`/${username}/${meetingType.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-sm font-medium bg-blue-600 text-white rounded-lg py-2 text-center hover:bg-blue-700 transition-colors"
        >
          Preview
        </a>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm text-red-500 hover:text-red-700 px-2 py-2 disabled:opacity-50"
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
