# 🎬 MovieBook - Movie Review Platform

A modern, full-stack movie review platform built with **Next.js 15** (App Router), **MongoDB**, and **TypeScript**. Browse movies, write reviews, rate films, and manage your profile - all in one beautiful, responsive application.

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Features

### 🎥 Movie Management
- Create, edit, and delete movies
- Browse all movies with beautiful cards
- View detailed movie information
- Automatic average rating calculation

### ⭐ Review System
- Write reviews with 1-5 star ratings
- Edit and delete your own reviews
- View all reviews for a movie
- Interactive star rating selector
- One review per user per movie

### 🔍 Search & Discovery
- Full-text search by title and description
- Filter by genre (10 genres available)
- Filter by release year
- Real-time search results
- Clear filters with one click

### 👤 User Profiles
- View user profiles with statistics
- See review count and average rating
- View all reviews by a user
- Edit your own profile
- Secure account management

### 🔐 Authentication
- Secure session-based authentication
- Register new accounts
- Login/logout functionality
- Protected routes for authenticated users
- Session persistence across page refreshes

### 📱 Modern UI/UX
- Fully responsive design (mobile, tablet, desktop)
- Tailwind CSS styling
- Loading states and animations
- Error handling and validation
- Clean, intuitive interface

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v14+ - [Download](https://nodejs.org/)
- **MongoDB** v4.4+ - [Download](https://www.mongodb.com/try/download/community)

### Installation

1. **Navigate to the project**
```bash
cd moviebook
```

2. **Install dependencies** (if not already done)
```bash
npm install
```

3. **Check environment variables**

The `.env.local` file should already be configured with:
```env
MONGODB_URI=mongodb://localhost:27017/moviebook
SESSION_SECRET=this-is-a-super-secret-key-that-is-at-least-32-characters-long-for-iron-session
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Start the application**

MongoDB is already running on your system, so just start Next.js:

```bash
npm run dev
```

5. **Open your browser**

Navigate to **http://localhost:3000**

🎉 **You're ready to go!**

---

## 📖 User Guide

### Getting Started

1. **Register an Account**
   - Click "Register" in the navbar
   - Fill in your name, email, and password
   - You'll be automatically logged in

2. **Browse Movies**
   - The home page shows all movies
   - Use the search bar to find specific movies
   - Filter by genre or year

3. **Add a Movie**
   - Click "Add Movie" in the navbar (requires login)
   - Fill in the movie details
   - Submit to create

4. **Write a Review**
   - Click on any movie to view details
   - Click "Write a Review"
   - Select your rating (1-5 stars)
   - Write your thoughts
   - Submit

5. **Manage Your Profile**
   - Click "Profile" in the navbar
   - View your statistics
   - Edit your profile information
   - See all your reviews

---

## 🏗️ Project Structure

```
moviebook/
├── app/
│   ├── api/              # Backend API Routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── movies/       # Movie CRUD
│   │   ├── reviews/      # Review CRUD
│   │   └── users/        # User management
│   ├── movies/           # Movie pages
│   │   ├── [id]/         # Movie detail
│   │   ├── new/          # Create movie
│   │   └── edit/[id]/    # Edit movie
│   ├── profile/          # Profile pages
│   │   ├── [id]/         # View profile
│   │   └── edit/[id]/    # Edit profile
│   ├── login/            # Login page
│   ├── register/         # Register page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
│
├── components/           # React Components
│   ├── Layout.tsx        # Main layout wrapper
│   ├── Navbar.tsx        # Navigation bar
│   ├── MovieCard.tsx     # Movie card display
│   ├── ReviewCard.tsx    # Review display
│   └── ReviewForm.tsx    # Review form
│
├── context/              # React Context
│   └── AuthContext.tsx   # Authentication state
│
├── lib/                  # Utilities
│   ├── mongodb.ts        # MongoDB connection
│   ├── session.ts        # Session config
│   └── auth.ts           # Auth helpers
│
├── models/               # Database Models
│   ├── Movie.ts          # Movie schema
│   ├── User.ts           # User schema
│   └── Review.ts         # Review schema
│
└── .env.local            # Environment variables
```

---

## 🔌 API Endpoints

All API endpoints are available at `/api/*`

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/movies` - Get all movies (supports `?q=search&genre=Sci-Fi&year=2010`)
- `GET /api/movies/[id]` - Get movie by ID
- `POST /api/movies` - Create movie (protected)
- `PUT /api/movies/[id]` - Update movie (protected)
- `DELETE /api/movies/[id]` - Delete movie (protected)

### Reviews
- `GET /api/reviews/movie/[movieId]` - Get reviews for a movie
- `GET /api/reviews/user/[userId]` - Get reviews by a user
- `POST /api/reviews` - Create review (protected)
- `PUT /api/reviews/[id]` - Update review (protected, own only)
- `DELETE /api/reviews/[id]` - Delete review (protected, own only)

### Users
- `GET /api/users/[id]` - Get user profile
- `PUT /api/users/[id]` - Update profile (protected, own only)
- `DELETE /api/users/[id]` - Delete account (protected, own only)

**Total: 17 API endpoints**

See [`API_SUMMARY.md`](API_SUMMARY.md) for detailed API documentation.

---

## 🗄️ Database Schema

### Movie
```typescript
{
  title: string (required, max 200 chars)
  genre: enum (10 options)
  releaseYear: number (1888 - current year + 5)
  description: string (required, max 2000 chars)
  createdAt: Date
  updatedAt: Date
}
```

### User
```typescript
{
  name: string (required, max 100 chars)
  email: string (required, unique, valid email)
  password: string (required, min 6 chars)
  createdAt: Date
  updatedAt: Date
}
```

### Review
```typescript
{
  userId: ObjectId (ref: User)
  movieId: ObjectId (ref: Movie)
  rating: number (1-5)
  comment: string (required, max 1000 chars)
  createdAt: Date
  updatedAt: Date
}
```

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server (with Turbopack)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: iron-session (encrypted cookies)
- **Styling**: Tailwind CSS 4
- **UI**: React 19

### Key Dependencies

```json
{
  "next": "15.5.4",
  "react": "19.1.0",
  "mongoose": "^8.19.0",
  "iron-session": "^8.0.4",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

---

## 🧪 Testing

See [`TESTING_GUIDE.md`](TESTING_GUIDE.md) for comprehensive testing instructions.

### Quick Test

1. Start the app: `npm run dev`
2. Register an account
3. Create a movie
4. Write a review
5. Test search and filter

---

## 🐛 Troubleshooting

### MongoDB "Address already in use"
✅ This is normal! MongoDB is already running. Just start Next.js with `npm run dev`.

See [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) for detailed solutions.

### Common Issues

**Port 3000 in use:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Clear Next.js cache:**
```bash
rm -rf .next
npm run dev
```

**Reset database:**
```bash
mongosh
use moviebook
db.dropDatabase()
```

---

## 📚 Documentation

- [`API_SUMMARY.md`](API_SUMMARY.md) - Complete API documentation
- [`TESTING_GUIDE.md`](TESTING_GUIDE.md) - Testing instructions
- [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) - Common issues and solutions
- [`PROGRESS.md`](PROGRESS.md) - Development progress tracker

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

2. **Deploy to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your repository
- Add environment variables:
  - `MONGODB_URI` - Your MongoDB Atlas connection string
  - `SESSION_SECRET` - A secure random string (32+ chars)
  - `NEXT_PUBLIC_APP_URL` - Your production URL
- Click "Deploy"

3. **Set up MongoDB Atlas**
- Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string
- Add it to Vercel environment variables

---

## 🔒 Security Notes

⚠️ **Important**: This is a learning project with simplified authentication.

**Current Implementation:**
- Plain text password storage (for learning)
- Simple session management
- Basic input validation

**For Production, add:**
- Password hashing with bcrypt
- Rate limiting
- CSRF protection
- Input sanitization
- HTTPS only
- Environment variable validation
- Logging and monitoring

---

## 🎓 Learning Outcomes

By building this project, you've learned:

### Backend
- ✅ Next.js API Routes
- ✅ MongoDB with Mongoose
- ✅ Session-based authentication
- ✅ RESTful API design
- ✅ Data validation
- ✅ Error handling

### Frontend
- ✅ Next.js App Router
- ✅ React Server Components
- ✅ Client Components with hooks
- ✅ Context API for state
- ✅ Form handling
- ✅ Responsive design

### Full-Stack
- ✅ Authentication flow
- ✅ CRUD operations
- ✅ Search and filter
- ✅ Data relationships
- ✅ TypeScript integration

---

## 🤝 Contributing

This is a student project. Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make improvements
4. Submit a pull request

---

## 📝 License

Created for educational purposes as part of Web Application Development coursework.

---

## 👨‍💻 Author

Built with ❤️ using Next.js, MongoDB, and TypeScript.

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database
- Vercel for hosting
- Tailwind CSS for styling
- Open source community

---

## 📞 Support

For issues or questions:
1. Check [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md)
2. Review [`TESTING_GUIDE.md`](TESTING_GUIDE.md)
3. Check [`API_SUMMARY.md`](API_SUMMARY.md)

---

**Happy Coding! 🚀**

Start the app with `npm run dev` and visit http://localhost:3000
