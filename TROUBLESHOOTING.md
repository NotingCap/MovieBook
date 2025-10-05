# Troubleshooting Guide

## MongoDB "Address already in use" Error

### Problem
When running `mongod`, you see:
```
Error setting up transport layer: Address already in use
```

### Solution
✅ **This is actually GOOD news!** MongoDB is already running on your system.

You have two options:

#### Option 1: Use the existing MongoDB instance (Recommended)
Just skip the `mongod` command and proceed directly to starting your Next.js app:

```bash
cd moviebook
npm run dev
```

Your app will connect to the already-running MongoDB instance.

#### Option 2: Stop the existing MongoDB and start fresh
If you want to start MongoDB manually:

**On macOS:**
```bash
# Stop the running MongoDB service
brew services stop mongodb-community

# Then start manually
mongod
```

**On Linux:**
```bash
# Stop the service
sudo systemctl stop mongod

# Then start manually
mongod
```

---

## How to Check if MongoDB is Running

```bash
# Try connecting with mongosh
mongosh

# If it connects, MongoDB is running!
# You'll see something like:
# Current Mongosh Log ID: ...
# Connecting to: mongodb://127.0.0.1:27017/
```

---

## Quick Start (Recommended Steps)

Since MongoDB is already running, just do:

```bash
# 1. Navigate to project
cd moviebook

# 2. Start Next.js development server
npm run dev

# 3. Open browser
# Visit: http://localhost:3000
```

That's it! Your app should work perfectly.

---

## Testing the Application

### 1. Register a New Account
- Go to http://localhost:3000/register
- Fill in the form
- Click "Register"

### 2. Browse Movies
- Go to http://localhost:3000
- You'll see an empty list (no movies yet)

### 3. Create a Movie (after logging in)
- Click "Add Movie" in the navbar
- Fill in the movie details
- Submit

### 4. Search and Filter
- Use the search bar on the home page
- Try filtering by genre or year

---

## Common Issues

### Issue: "Cannot connect to MongoDB"
**Solution**: Make sure MongoDB is running
```bash
# Check if MongoDB is running
mongosh

# If not running, start it
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Issue: "Session secret must be at least 32 characters"
**Solution**: Already fixed in `.env.local`
The session secret is properly configured.

### Issue: Port 3000 already in use
**Solution**: Kill the process or use a different port
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
PORT=3001 npm run dev
```

### Issue: TypeScript errors
**Solution**: Restart the dev server
```bash
# Stop the server (Ctrl+C)
# Clear Next.js cache
rm -rf .next

# Restart
npm run dev
```

---

## Database Management

### View Your Data
```bash
# Connect to MongoDB
mongosh

# Switch to moviebook database
use moviebook

# View collections
show collections

# View all movies
db.movies.find()

# View all users
db.users.find()

# View all reviews
db.reviews.find()
```

### Clear All Data (if needed)
```bash
mongosh

use moviebook

# Drop entire database
db.dropDatabase()
```

---

## Next Steps

1. ✅ MongoDB is running
2. ✅ Start the Next.js app: `npm run dev`
3. ✅ Visit http://localhost:3000
4. ✅ Register an account
5. ✅ Start using the app!

---

**Need Help?**
Check the main README.md or API_SUMMARY.md for more information.