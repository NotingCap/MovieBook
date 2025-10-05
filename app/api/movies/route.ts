import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Movie, { IMovie } from '@/models/Movie';
import Review from '@/models/Review';
import { getCurrentUser } from '@/lib/auth';

// GET /api/movies - Get all movies with optional search and filter
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q'); // Search query
    const genre = searchParams.get('genre'); // Filter by genre
    const year = searchParams.get('year'); // Filter by year

    // Build query
    let query: any = {};

    if (q) {
      query.$text = { $search: q };
    }

    if (genre) {
      query.genre = genre;
    }

    if (year) {
      query.releaseYear = parseInt(year);
    }

    // Fetch movies
    const movies = await Movie.find(query).sort({ createdAt: -1 }).lean();

    // Calculate average ratings for each movie
    const moviesWithRatings = await Promise.all(
      movies.map(async (movie) => {
        const reviews = await Review.find({ movieId: movie._id });
        const avgRating =
          reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        return {
          ...movie,
          _id: movie._id.toString(),
          averageRating: Math.round(avgRating * 10) / 10,
          reviewCount: reviews.length,
        };
      })
    );

    return NextResponse.json({
      success: true,
      count: moviesWithRatings.length,
      movies: moviesWithRatings,
    });
  } catch (error) {
    console.error('Get movies error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}

// POST /api/movies - Create a new movie (requires authentication)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { title, genre, releaseYear, description } = body;

    // Validation
    if (!title || !genre || !releaseYear || !description) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create movie
    const movie = await Movie.create({
      title,
      genre,
      releaseYear,
      description,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Movie created successfully',
        movie,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create movie error:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create movie' },
      { status: 500 }
    );
  }
}