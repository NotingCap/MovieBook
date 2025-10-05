import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import { getCurrentUser } from '@/lib/auth';
import mongoose from 'mongoose';

// PUT /api/reviews/[id] - Update review (requires authentication, own review only)
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
        { success: false, error: 'Invalid review ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { rating, comment } = body;

    // Find review
    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if user owns this review
    if (review.userId.toString() !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to update this review' },
        { status: 403 }
      );
    }

    // Update review
    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();

    return NextResponse.json({
      success: true,
      message: 'Review updated successfully',
      review,
    });
  } catch (error: any) {
    console.error('Update review error:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[id] - Delete review (requires authentication, own review only)
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
        { success: false, error: 'Invalid review ID' },
        { status: 400 }
      );
    }

    // Find review
    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if user owns this review
    if (review.userId.toString() !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to delete this review' },
        { status: 403 }
      );
    }

    // Delete review
    await Review.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}