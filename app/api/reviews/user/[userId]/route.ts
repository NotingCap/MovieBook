import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import mongoose from 'mongoose';

// GET /api/reviews/user/[userId] - Get all reviews by a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Get reviews with movie information
    const reviews = await Review.find({ userId })
      .populate('movieId', 'title genre releaseYear')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}