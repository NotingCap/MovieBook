'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import ReviewCard from '@/components/ReviewCard';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  reviewCount: number;
  averageRating: number;
  createdAt: string;
}

interface Review {
  _id: string;
  movieId: {
    _id: string;
    title: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const [userId, setUserId] = useState('');

  useEffect(() => {
    params.then(p => {
      setUserId(p.id);
      fetchProfile(p.id);
      fetchReviews(p.id);
    });
  }, []);

  const fetchProfile = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (id: string) => {
    try {
      const response = await fetch(`/api/reviews/user/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews(reviews.filter(r => r._id !== reviewId));
    fetchProfile(userId);
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </Layout>
    );
  }

  const isOwnProfile = user?.id === profile._id;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since {new Date(profile.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })}
              </p>
            </div>
            {isOwnProfile && (
              <div className="flex gap-2">
                <Link
                  href={`/profile/edit/${profile._id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete Account
                </button>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{profile.reviewCount}</p>
              <p className="text-gray-600">Reviews Written</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                {renderStars(profile.averageRating)}
                <span className="text-2xl font-bold text-gray-900">
                  {profile.averageRating.toFixed(1)}
                </span>
              </div>
              <p className="text-gray-600">Average Rating Given</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              {isOwnProfile ? "You haven't written any reviews yet." : "This user hasn't written any reviews yet."}
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
                  <Link
                    href={`/movies/${review.movieId._id}`}
                    className="text-xl font-bold text-blue-600 hover:underline mb-2 block"
                  >
                    {review.movieId.title}
                  </Link>
                  <ReviewCard
                    review={{
                      ...review,
                      userId: profile._id,
                    }}
                    onDelete={handleDeleteReview}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}