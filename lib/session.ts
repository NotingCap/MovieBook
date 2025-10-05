import { SessionOptions } from 'iron-session';

export interface SessionData {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'moviebook_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    sameSite: 'lax',
  },
};

// Validate session configuration
if (!sessionOptions.password || typeof sessionOptions.password === 'string' && sessionOptions.password.length < 32) {
  throw new Error(
    'SESSION_SECRET must be at least 32 characters long. Please update your .env.local file.'
  );
}