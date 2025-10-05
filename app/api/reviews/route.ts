import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Movie from '@/models/Movie';
import { getCurrentUser } from '@/lib/auth';
import mongoose from 'mongoose';

// POST /api/reviews - Create a new review (requires authentication)
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
    const { movieId, rating, comment } = body;

    // Validation
    if (!movieId || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid movie ID' },
        { status: 400 }
      );
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return NextResponse.json(
        { success: false, error: 'Movie not found' },
        { status: 404 }
      );
    }

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      userId: user.id,
      movieId,
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this movie' },
        { status: 409 }
      );
    }

    // Create review
    const review = await Review.create({
      userId: user.id,
      movieId,
      rating,
      comment,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Review created successfully',
        review,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create review error:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this movie' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}