const BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(method, path, body, auth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Auth
export const register = (body) => request('POST', '/auth/register', body);
export const login = (body) => request('POST', '/auth/login', body);

// Meeting Types
export const getMeetingTypes = () => request('GET', '/meeting-types', null, true);
export const createMeetingType = (body) => request('POST', '/meeting-types', body, true);
export const updateMeetingType = (id, body) => request('PUT', `/meeting-types/${id}`, body, true);
export const deleteMeetingType = (id) => request('DELETE', `/meeting-types/${id}`, null, true);

// Availability
export const getAvailability = () => request('GET', '/availability', null, true);
export const saveAvailability = (slots) => request('PUT', '/availability', slots, true);

// Public booking
export const getBookingSlots = (username, slug, date) =>
  request('GET', `/book/${username}/${slug}?date=${date}`);
export const createBooking = (username, slug, body) =>
  request('POST', `/book/${username}/${slug}`, body);

// Host bookings
export const getHostBookings = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request('GET', `/bookings${qs ? '?' + qs : ''}`, null, true);
};
