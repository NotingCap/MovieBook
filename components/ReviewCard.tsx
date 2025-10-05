'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
  } | string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

export default function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const userId = typeof review.userId === 'string' ? review.userId : review.userId._id;
  const userName = typeof review.userId === 'string' ? 'User' : review.userId.name;
  const isOwner = user?.id === userId;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/reviews/${review._id}`, {
        method: 'DELETE',
      });

      if (response.ok && onDelete) {
        onDelete(review._id);
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
      alert('Failed to delete review');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-50">{userName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(review.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        {renderStars(review.rating)}
      </div>

      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{review.comment}</p>

      {isOwner && (onEdit || onDelete) && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {onEdit && (
            <button
              onClick={() => onEdit(review)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-600 hover:text-red-800 text-sm font-medium disabled:text-red-300"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}