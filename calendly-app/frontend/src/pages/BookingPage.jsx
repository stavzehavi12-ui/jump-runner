import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBookingSlots, createBooking } from '../utils/api';
import { durationLabel } from '../utils/dateHelpers';
import CalendarPicker from '../components/booking/CalendarPicker';
import TimeSlotPicker from '../components/booking/TimeSlotPicker';
import BookingForm from '../components/booking/BookingForm';
import ConfirmationScreen from '../components/booking/ConfirmationScreen';

export default function BookingPage() {
  const { username, slug } = useParams();

  const [step, setStep] = useState(1); // 1=calendar, 2=time, 3=form, 4=confirmed
  const [meta, setMeta] = useState(null); // { meetingType, host, availableDays }
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState('');

  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [booking, setBooking] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Load meeting type info once (use today's date to get metadata)
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    getBookingSlots(username, slug, today)
      .then(data => {
        // Fetch availability days from backend — load a week to find which days are open
        setMeta({
          meetingType: data.meetingType,
          host: data.host,
        });
        // Fetch available weekdays by checking all days of the week
        return fetchAvailableDays(username, slug);
      })
      .then(days => {
        setMeta(prev => ({ ...prev, availableDays: days }));
      })
      .catch(err => setMetaError(err.message))
      .finally(() => setMetaLoading(false));
  }, [username, slug]);

  async function fetchAvailableDays(username, slug) {
    // Check the next 7 days to find which days of week have availability
    const available = new Set();
    const now = new Date();
    const promises = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      promises.push(
        getBookingSlots(username, slug, dateStr)
          .then(data => {
            if (data.slots.length > 0) available.add(d.getDay());
          })
          .catch(() => {})
      );
    }
    await Promise.all(promises);
    return [...available];
  }

  async function handleDateSelect(date) {
    setSelectedDate(date);
    setSelectedSlot(null);
    setSlots([]);
    setSlotsLoading(true);
    setStep(2);
    try {
      const data = await getBookingSlots(username, slug, date);
      setSlots(data.slots);
    } catch (err) {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }

  function handleSlotSelect(slot) {
    setSelectedSlot(slot);
    setStep(3);
  }

  async function handleBookingSubmit({ guest_name, guest_email }) {
    setBookingError('');
    setBookingLoading(true);
    try {
      const data = await createBooking(username, slug, {
        start_time: selectedSlot.start,
        guest_name,
        guest_email,
      });
      setBooking(data.booking);
      setStep(4);
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  }

  const STEP_LABELS = ['Select date', 'Select time', 'Your details', 'Confirmed'];

  if (metaLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (metaError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Page not found</h1>
          <p className="text-gray-500">{metaError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Meeting info */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <p className="text-sm font-medium text-gray-500 mb-1">@{meta.host.username}</p>
              <h1 className="text-xl font-bold text-gray-900 mb-2">{meta.meetingType.title}</h1>
              {meta.meetingType.description && (
                <p className="text-sm text-gray-500 mb-4">{meta.meetingType.description}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>🕐</span>
                <span>{durationLabel(meta.meetingType.duration)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <span>🌍</span>
                <span>{meta.host.timezone}</span>
              </div>
              {selectedDate && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-blue-600 font-medium">
                  {selectedDate}
                </div>
              )}
            </div>
          </div>

          {/* Right: Booking wizard */}
          <div className="md:col-span-2">
            {/* Progress steps */}
            {step < 4 && (
              <div className="flex items-center gap-1 mb-6">
                {STEP_LABELS.slice(0, 3).map((label, i) => (
                  <div key={i} className="flex items-center gap-1 flex-1">
                    <div className={`flex items-center gap-2 text-xs font-medium ${step === i + 1 ? 'text-blue-600' : step > i + 1 ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${step === i + 1 ? 'bg-blue-600 text-white' : step > i + 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {step > i + 1 ? '✓' : i + 1}
                      </span>
                      <span className="hidden sm:block">{label}</span>
                    </div>
                    {i < 2 && <div className="flex-1 h-px bg-gray-200 mx-2" />}
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              {step === 1 && (
                <div>
                  <h2 className="font-semibold text-gray-900 mb-4">Select a date</h2>
                  <CalendarPicker
                    availableDays={meta.availableDays || []}
                    selectedDate={selectedDate}
                    onSelect={handleDateSelect}
                  />
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
                    <h2 className="font-semibold text-gray-900">Select a time</h2>
                  </div>
                  <TimeSlotPicker
                    slots={slots}
                    loading={slotsLoading}
                    selectedSlot={selectedSlot}
                    onSelect={handleSlotSelect}
                  />
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="font-semibold text-gray-900 mb-5">Your details</h2>
                  <BookingForm
                    slot={selectedSlot}
                    meetingType={meta.meetingType}
                    host={meta.host}
                    onSubmit={handleBookingSubmit}
                    onBack={() => setStep(2)}
                    loading={bookingLoading}
                    error={bookingError}
                  />
                </div>
              )}

              {step === 4 && booking && (
                <ConfirmationScreen booking={booking} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
