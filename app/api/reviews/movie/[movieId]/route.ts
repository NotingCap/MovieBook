import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import mongoose from 'mongoose';

// GET /api/reviews/movie/[movieId] - Get all reviews for a specific movie
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ movieId: string }> }
) {
  try {
    await dbConnect();
    const { movieId } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid movie ID' },
        { status: 400 }
      );
    }

    // Get reviews with user information
    const reviews = await Review.find({ movieId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error('Get movie reviews error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}