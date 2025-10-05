import mongoose, { Schema, Model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  userId: Types.ObjectId;
  movieId: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    movieId: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie ID is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate reviews (one review per user per movie)
reviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });

// Index for queries
reviewSchema.index({ movieId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });

// Prevent model recompilation in development
const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);

export default Review;