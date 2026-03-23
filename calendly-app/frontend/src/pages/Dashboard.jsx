import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMeetingTypes } from '../utils/api';
import MeetingTypeCard from '../components/host/MeetingTypeCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [meetingTypes, setMeetingTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMeetingTypes()
      .then(setMeetingTypes)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleDeleted(id) {
    setMeetingTypes(prev => prev.filter(mt => mt.id !== id));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meeting Types</h1>
          <p className="text-gray-500 mt-1">Create and manage your booking pages</p>
        </div>
        <Link
          to="/dashboard/new-meeting"
          className="bg-blue-600 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          + New meeting type
        </Link>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
      )}

      {!loading && meetingTypes.length === 0 && !error && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">🗓️</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No meeting types yet</h2>
          <p className="text-gray-500 mb-6">Create your first meeting type to start accepting bookings</p>
          <Link
            to="/dashboard/new-meeting"
            className="bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create meeting type
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {meetingTypes.map(mt => (
          <MeetingTypeCard
            key={mt.id}
            meetingType={mt}
            username={user.username}
            onDeleted={handleDeleted}
          />
        ))}
      </div>
    </div>
  );
}
