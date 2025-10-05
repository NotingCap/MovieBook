import Link from 'next/link';

interface Movie {
  _id: string;
  title: string;
  genre: string;
  releaseYear: number;
  description: string;
  averageRating?: number;
  reviewCount?: number;
}

export default function MovieCard({ movie }: { movie: Movie }) {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400">★</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">★</span>
        ))}
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)} ({movie.reviewCount || 0})
        </span>
      </div>
    );
  };

  return (
    <Link href={`/movies/${movie._id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 h-full cursor-pointer">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{movie.title}</h3>
        
        <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {movie.genre}
          </span>
          <span>{movie.releaseYear}</span>
        </div>

        {movie.averageRating !== undefined && movie.averageRating > 0 ? (
          <div className="mb-3">
            {renderStars(movie.averageRating)}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-3">No reviews yet</p>
        )}

        <p className="text-gray-700 line-clamp-3">{movie.description}</p>
      </div>
    </Link>
  );
}