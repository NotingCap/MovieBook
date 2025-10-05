import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Movie from '@/models/Movie';
import Review from '@/models/Review';
import { getCurrentUser } from '@/lib/auth';
import mongoose from 'mongoose';

// GET /api/movies/[id] - Get single movie by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid movie ID' },
        { status: 400 }
      );
    }

    const movie = await Movie.findById(id).lean();

    if (!movie) {
      return NextResponse.json(
        { success: false, error: 'Movie not found' },
        { status: 404 }
      );
    }

    // Calculate average rating
    const reviews = await Review.find({ movieId: id });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return NextResponse.json({
      success: true,
      movie: {
        ...movie,
        _id: movie._id.toString(),
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      },
    });
  } catch (error) {
    console.error('Get movie error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch movie' },
      { status: 500 }
    );
  }
}

// PUT /api/movies/[id] - Update movie (requires authentication)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid movie ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, genre, releaseYear, description } = body;

    // Update movie
    const movie = await Movie.findByIdAndUpdate(
      id,
      { title, genre, releaseYear, description },
      { new: true, runValidators: true }
    );

    if (!movie) {
      return NextResponse.json(
        { success: false, error: 'Movie not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Movie updated successfully',
      movie,
    });
  } catch (error: any) {
    console.error('Update movie error:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update movie' },
      { status: 500 }
    );
  }
}

// DELETE /api/movies/[id] - Delete movie (requires authentication)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid movie ID' },
        { status: 400 }
      );
    }

    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      return NextResponse.json(
        { success: false, error: 'Movie not found' },
        { status: 404 }
      );
    }

    // Also delete all reviews for this movie
    await Review.deleteMany({ movieId: id });

    return NextResponse.json({
      success: true,
      message: 'Movie deleted successfully',
    });
  } catch (error) {
    console.error('Delete movie error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete movie' },
      { status: 500 }
    );
  }
}