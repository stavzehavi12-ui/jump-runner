import { useState } from 'react';

export default function MeetingTypeForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState({
    title: '',
    duration: 30,
    buffer_time: 0,
    description: '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Meeting title *</label>
        <input
          type="text"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g. 30 Minute Meeting"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
        <div className="grid grid-cols-3 gap-3">
          {[15, 30, 60].map(d => (
            <button
              key={d}
              type="button"
              onClick={() => setForm(f => ({ ...f, duration: d }))}
              className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                form.duration === d
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {d === 60 ? '1 hr' : `${d} min`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Buffer time <span className="text-gray-400 font-normal">(minutes between meetings)</span>
        </label>
        <select
          value={form.buffer_time}
          onChange={e => setForm(f => ({ ...f, buffer_time: Number(e.target.value) }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {[0, 5, 10, 15, 30].map(b => (
            <option key={b} value={b}>{b === 0 ? 'No buffer' : `${b} minutes`}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-gray-400 font-normal">(optional)</span></label>
        <textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          placeholder="What is this meeting about?"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Creating...' : 'Create meeting type'}
      </button>
    </form>
  );
}
