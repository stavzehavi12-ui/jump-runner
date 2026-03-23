import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewMeeting from './pages/NewMeeting';
import Availability from './pages/Availability';
import Bookings from './pages/Bookings';
import BookingPage from './pages/BookingPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth pages (no navbar needed) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main layout with navbar */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />

            {/* Protected host routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/dashboard/new-meeting" element={
              <ProtectedRoute><NewMeeting /></ProtectedRoute>
            } />
            <Route path="/dashboard/availability" element={
              <ProtectedRoute><Availability /></ProtectedRoute>
            } />
            <Route path="/dashboard/bookings" element={
              <ProtectedRoute><Bookings /></ProtectedRoute>
            } />

            {/* Public booking page */}
            <Route path="/:username/:slug" element={<BookingPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
