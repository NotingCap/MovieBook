'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';

interface Movie {
  _id: string;
  title: string;
  genre: string;
  releaseYear: number;
  description: string;
  averageRating: number;
  reviewCount: number;
}

interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const [movieId, setMovieId] = useState<string>('');

  useEffect(() => {
    params.then(p => {
      setMovieId(p.id);
      fetchMovie(p.id);
      fetchReviews(p.id);
    });
  }, []);

  const fetchMovie = async (id: string) => {
    try {
      const response = await fetch(`/api/movies/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setMovie(data.movie);
      }
    } catch (error) {
      console.error('Failed to fetch movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (id: string) => {
    try {
      const response = await fetch(`/api/reviews/movie/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews);
        
        // Check if current user has already reviewed
        if (user) {
          const userRev = data.reviews.find((r: Review) => r.userId._id === user.id);
          setUserReview(userRev || null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    fetchMovie(movieId);
    fetchReviews(movieId);
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews(reviews.filter(r => r._id !== reviewId));
    setUserReview(null);
    fetchMovie(movieId);
  };

  const handleDeleteMovie = async () => {
    if (!confirm('Are you sure you want to delete this movie? All reviews will also be deleted.')) {
      return;
    }

    try {
      const response = await fetch(`/api/movies/${movieId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to delete movie:', error);
      alert('Failed to delete movie');
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400 text-2xl">★</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400 text-2xl">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300 text-2xl">★</span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading movie...</p>
        </div>
      </Layout>
    );
  }

  if (!movie) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Movie Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Movies
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Movie Details */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{movie.title}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                  {movie.genre}
                </span>
                <span>{movie.releaseYear}</span>
              </div>
            </div>
            {user && (
              <div className="flex gap-2">
                <Link
                  href={`/movies/edit/${movie._id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDeleteMovie}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="mb-6">
            {movie.averageRating > 0 ? (
              <div className="flex items-center gap-3">
                {renderStars(movie.averageRating)}
                <span className="text-xl font-semibold text-gray-900">
                  {movie.averageRating.toFixed(1)}
                </span>
                <span className="text-gray-600">
                  ({movie.reviewCount} {movie.reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{movie.description}</p>
          </div>
        </div>

        {/* Review Form */}
        {user && !userReview && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Write a Review
          </button>
        )}

        {user && (showReviewForm || editingReview) && (
          <ReviewForm
            movieId={movie._id}
            existingReview={editingReview || undefined}
            onSuccess={handleReviewSuccess}
            onCancel={() => {
              setShowReviewForm(false);
              setEditingReview(null);
            }}
          />
        )}

        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-gray-700">
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Login
              </Link>
              {' '}or{' '}
              <Link href="/register" className="text-blue-600 hover:underline font-medium">
                register
              </Link>
              {' '}to write a review
            </p>
          </div>
        )}

        {/* Reviews List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              No reviews yet. Be the first to review this movie!
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onEdit={(rev) => setEditingReview(rev as Review)}
                  onDelete={handleDeleteReview}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}