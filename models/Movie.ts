import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  genre: string;
  releaseYear: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const movieSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      enum: {
        values: [
          'Action',
          'Comedy',
          'Drama',
          'Horror',
          'Sci-Fi',
          'Romance',
          'Thriller',
          'Documentary',
          'Animation',
          'Other',
        ],
        message: '{VALUE} is not a valid genre',
      },
    },
    releaseYear: {
      type: Number,
      required: [true, 'Release year is required'],
      min: [1888, 'Invalid release year'],
      max: [new Date().getFullYear() + 5, 'Release year too far in future'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create text index for search functionality
movieSchema.index({ title: 'text', description: 'text' });

// Index for filtering
movieSchema.index({ genre: 1, releaseYear: -1 });

// Prevent model recompilation in development
const Movie: Model<IMovie> =
  mongoose.models.Movie || mongoose.model<IMovie>('Movie', movieSchema);

export default Movie;