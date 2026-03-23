import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createMeetingType } from '../utils/api';
import MeetingTypeForm from '../components/host/MeetingTypeForm';

export default function NewMeeting() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(form) {
    setError('');
    setLoading(true);
    try {
      await createMeetingType(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6">
        <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">← Back to dashboard</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-3">New meeting type</h1>
        <p className="text-gray-500 mt-1">Set up a new booking page for your guests</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <MeetingTypeForm onSubmit={handleSubmit} loading={loading} error={error} />
      </div>
    </div>
  );
}
