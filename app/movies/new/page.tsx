'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';

export default function NewMoviePage() {
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    releaseYear: new Date().getFullYear(),
    description: '',
  });
  const [searchTitle, setSearchTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Documentary', 'Animation', 'Other'];
  const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

  // Redirect if not authenticated
  if (!user) {
    router.push('/login');
    return null;
  }

  const fetchMovieDetails = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError('');
    if (!searchTitle.trim()) return;

    setLoading(true);

    try {
      const url = `https://www.omdbapi.com/?t=${encodeURIComponent(searchTitle)}&apikey=${OMDB_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.Response === "True") {
        
        // Match OMDb genre string to one of the local valid genres
        const omdbGenre = data.Genre.split(',')[0].trim();
        const matchedGenre = genres.find(g => omdbGenre.includes(g)) || 'Other';
        
        setFormData({
          title: data.Title,
          genre: matchedGenre,
          releaseYear: parseInt(data.Year) || new Date().getFullYear(),
          description: data.Plot.length < 2000 ? data.Plot : data.Plot.substring(0, 1997) + '...',
        });
        setSearchTitle(''); // Clear search input on success
        
      } else {
        setError(data.Error || 'Movie not found in OMDb.');
      }

    } catch (err: any) {
      console.error('OMDb fetch error:', err);
      setError('Failed to fetch movie details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'releaseYear' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic form validation check before submitting to API
    if (!formData.title || !formData.genre || !formData.releaseYear || !formData.description) {
        setError('Please complete all required fields.');
        setLoading(false);
        return;
    }

    try {
      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create movie');
      }

      router.push(`/movies/${data.movie._id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-6">Add New Movie</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* OMDb Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 space-y-4 border border-blue-500/50">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">Fetch Movie Details</h2>
            <div className="flex gap-4">
                <input
                    type="text"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    required
                    placeholder="Enter movie title to search"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                <button
                    onClick={fetchMovieDetails}
                    disabled={loading || !OMDB_API_KEY}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 transition"
                >
                    {loading ? 'Fetching...' : 'Fetch Details'}
                </button>
            </div>
            {!OMDB_API_KEY && (
                <p className="text-sm text-red-500">
                    Warning: NEXT_PUBLIC_OMDB_API_KEY is not set in .env.local. Fetching is disabled.
                </p>
            )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="Enter movie title"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Genre *
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select a genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="releaseYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Release Year *
              </label>
              <input
                type="number"
                id="releaseYear"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleChange}
                required
                min={1888}
                max={new Date().getFullYear() + 5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              maxLength={2000}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="Enter movie description"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formData.description.length}/2000 characters
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition"
            >
              {loading ? 'Creating...' : 'Create Movie'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-50 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}