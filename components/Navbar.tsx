'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold hover:text-blue-400 transition">
            🎬 MovieBook
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="hover:text-blue-400 transition"
            >
              Movies
            </Link>

            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/movies/new"
                      className="hover:text-blue-400 transition"
                    >
                      Add Movie
                    </Link>
                    <Link
                      href={`/profile/${user.id}`}
                      className="hover:text-blue-400 transition"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="hover:text-blue-400 transition"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
                    >
                      Register
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}