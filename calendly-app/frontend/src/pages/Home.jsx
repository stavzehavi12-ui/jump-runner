import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Scheduling,<br />
          <span className="text-blue-600">simplified.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">
          Share your booking link. Let people pick a time that works. No back-and-forth emails.
        </p>
        <div className="flex items-center justify-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl text-lg hover:bg-blue-700 transition-colors"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl text-lg hover:bg-blue-700 transition-colors"
              >
                Get started free
              </Link>
              <Link
                to="/login"
                className="border border-gray-300 text-gray-700 font-semibold px-8 py-3.5 rounded-xl text-lg hover:bg-gray-50 transition-colors"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
