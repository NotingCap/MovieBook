# 🧪 MovieBook Testing Guide

## Quick Start Testing

### 1. Start the Application

```bash
# MongoDB is already running (you saw the "address in use" message)
# Just start Next.js:
cd moviebook
npm run dev
```

Open your browser to **http://localhost:3000**

---

## 📋 Complete Testing Checklist

### ✅ Authentication Flow

#### Test 1: Register New Account
1. Go to http://localhost:3000/register
2. Fill in the form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
   - Confirm Password: "password123"
3. Click "Register"
4. ✅ Should redirect to home page
5. ✅ Should see "Test User" in navbar
6. ✅ Should see "Add Movie" and "Profile" links

#### Test 2: Logout
1. Click "Logout" button in navbar
2. ✅ Should redirect to home
3. ✅ Should see "Login" and "Register" buttons

#### Test 3: Login
1. Go to http://localhost:3000/login
2. Enter credentials:
   - Email: "test@example.com"
   - Password: "password123"
3. Click "Login"
4. ✅ Should redirect to home
5. ✅ Should be logged in

---

### ✅ Movie Management

#### Test 4: Create Movie
1. Make sure you're logged in
2. Click "Add Movie" in navbar
3. Fill in the form:
   - Title: "Inception"
   - Genre: "Sci-Fi"
   - Release Year: 2010
   - Description: "A thief who steals corporate secrets through dream-sharing technology..."
4. Click "Create Movie"
5. ✅ Should redirect to movie detail page
6. ✅ Should see the movie details

#### Test 5: View Movie List
1. Go to http://localhost:3000
2. ✅ Should see the movie you created
3. ✅ Should see movie card with title, genre, year
4. ✅ Should show "No reviews yet"

#### Test 6: View Movie Details
1. Click on a movie card
2. ✅ Should see full movie details
3. ✅ Should see description
4. ✅ Should see "Write a Review" button (if logged in)
5. ✅ Should see "Edit" and "Delete" buttons (if logged in)

#### Test 7: Edit Movie
1. On movie detail page, click "Edit"
2. Change the title to "Inception (Updated)"
3. Click "Update Movie"
4. ✅ Should redirect back to movie detail
5. ✅ Should see updated title

#### Test 8: Delete Movie
1. On movie detail page, click "Delete"
2. Confirm deletion
3. ✅ Should redirect to home page
4. ✅ Movie should be removed from list

---

### ✅ Review System

#### Test 9: Write Review
1. Go to a movie detail page
2. Click "Write a Review"
3. Select rating (e.g., 5 stars)
4. Write comment: "Amazing movie! Mind-bending plot."
5. Click "Submit Review"
6. ✅ Review form should disappear
7. ✅ Should see your review in the list
8. ✅ Movie rating should update

#### Test 10: Edit Review
1. Find your review on the movie page
2. Click "Edit" on your review
3. Change rating to 4 stars
4. Update comment
5. Click "Update Review"
6. ✅ Should see updated review
7. ✅ Movie average rating should update

#### Test 11: Delete Review
1. Find your review
2. Click "Delete"
3. Confirm deletion
4. ✅ Review should be removed
5. ✅ Movie rating should update

#### Test 12: Duplicate Review Prevention
1. Try to write a second review for the same movie
2. ✅ Should show error: "You have already reviewed this movie"

---

### ✅ Search & Filter

#### Test 13: Search Movies
1. Go to home page
2. Type "inception" in search bar
3. ✅ Should filter movies in real-time
4. ✅ Should show matching movies

#### Test 14: Filter by Genre
1. Select "Sci-Fi" from genre dropdown
2. ✅ Should show only Sci-Fi movies

#### Test 15: Filter by Year
1. Enter "2010" in year field
2. ✅ Should show only movies from 2010

#### Test 16: Combined Filters
1. Search "inception"
2. Select genre "Sci-Fi"
3. Enter year "2010"
4. ✅ Should show movies matching all criteria

#### Test 17: Clear Filters
1. Click "Clear Filters"
2. ✅ All filters should reset
3. ✅ Should show all movies

---

### ✅ User Profile

#### Test 18: View Own Profile
1. Click "Profile" in navbar
2. ✅ Should see your name and email
3. ✅ Should see review count
4. ✅ Should see average rating given
5. ✅ Should see list of your reviews
6. ✅ Should see "Edit Profile" and "Delete Account" buttons

#### Test 19: Edit Profile
1. Click "Edit Profile"
2. Change name to "Updated Name"
3. Click "Update Profile"
4. ✅ Should redirect to profile
5. ✅ Should see updated name
6. ✅ Navbar should show updated name

#### Test 20: View Other User's Profile
1. Create a second account
2. Write a review
3. Logout and login with first account
4. Click on the second user's name in a review
5. ✅ Should see their profile
6. ✅ Should NOT see "Edit" or "Delete" buttons

---

### ✅ Protected Routes

#### Test 21: Access Protected Pages Without Login
1. Logout
2. Try to access http://localhost:3000/movies/new
3. ✅ Should redirect to login page

#### Test 22: Edit Other User's Content
1. Try to edit another user's review via API
2. ✅ Should return 403 Forbidden

---

### ✅ Responsive Design

#### Test 23: Mobile View
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro"
4. ✅ Navbar should be responsive
5. ✅ Movie grid should stack vertically
6. ✅ Forms should be readable

#### Test 24: Tablet View
1. Select "iPad"
2. ✅ Should show 2 columns of movies
3. ✅ All elements should be properly sized

#### Test 25: Desktop View
1. Select "Responsive" and set to 1920x1080
2. ✅ Should show 3 columns of movies
3. ✅ Content should be centered with max-width

---

## 🔍 Edge Cases to Test

### Data Validation

#### Test 26: Invalid Email
1. Try to register with "notanemail"
2. ✅ Should show validation error

#### Test 27: Short Password
1. Try to register with password "12345"
2. ✅ Should show "Password must be at least 6 characters"

#### Test 28: Invalid Rating
1. Try to submit review with 0 stars
2. ✅ Should show "Please select a rating"

#### Test 29: Empty Fields
1. Try to create movie with empty title
2. ✅ Should show validation error

#### Test 30: Invalid Year
1. Try to create movie with year 1800
2. ✅ Should show validation error

---

## 🎯 User Flow Testing

### Complete User Journey

1. **New User Registration**
   - Register account
   - Verify email in navbar
   - ✅ Session persists on page refresh

2. **Browse and Search**
   - View movie list
   - Search for movies
   - Filter by genre/year
   - ✅ Results update correctly

3. **Create Content**
   - Add a new movie
   - Write a review
   - ✅ Content appears immediately

4. **Edit Content**
   - Edit movie details
   - Edit review
   - ✅ Changes save correctly

5. **Profile Management**
   - View profile
   - Check statistics
   - Edit profile
   - ✅ Updates reflect everywhere

6. **Cleanup**
   - Delete review
   - Delete movie
   - ✅ Cascade deletes work

---

## 🐛 Known Issues to Check

### Session Persistence
- [ ] Session survives page refresh
- [ ] Session survives browser close/reopen
- [ ] Logout clears session properly

### Data Consistency
- [ ] Average ratings calculate correctly
- [ ] Review counts are accurate
- [ ] Deleting movie deletes its reviews
- [ ] Deleting user deletes their reviews

### UI/UX
- [ ] Loading states show properly
- [ ] Error messages are clear
- [ ] Success feedback is visible
- [ ] Forms validate before submission

---

## 📊 Performance Testing

### Load Testing
1. Create 10+ movies
2. Add 5+ reviews per movie
3. ✅ Page should load quickly
4. ✅ Search should be responsive

### Browser Testing
Test in multiple browsers:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## 🔧 Debugging Tips

### Check MongoDB Data
```bash
mongosh

use moviebook

# View all movies
db.movies.find().pretty()

# View all users
db.users.find().pretty()

# View all reviews
db.reviews.find().pretty()

# Count documents
db.movies.countDocuments()
db.users.countDocuments()
db.reviews.countDocuments()
```

### Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors or warnings
4. Check Network tab for API calls

### Check Server Logs
Look at the terminal running `npm run dev` for:
- MongoDB connection status
- API request logs
- Error messages

---

## ✅ Final Checklist

Before considering the app complete:

### Functionality
- [ ] All CRUD operations work
- [ ] Authentication works
- [ ] Search and filter work
- [ ] Reviews can be created/edited/deleted
- [ ] Ratings calculate correctly
- [ ] Protected routes work

### UI/UX
- [ ] Responsive on all screen sizes
- [ ] Loading states show
- [ ] Error messages display
- [ ] Forms validate properly
- [ ] Navigation works smoothly

### Security
- [ ] Can't edit other users' content
- [ ] Protected routes redirect to login
- [ ] Sessions are secure
- [ ] Input validation works

### Performance
- [ ] Pages load quickly
- [ ] No console errors
- [ ] Images load properly
- [ ] Smooth animations

---

## 🎉 Success Criteria

Your app is ready when:
1. ✅ You can register and login
2. ✅ You can create, edit, and delete movies
3. ✅ You can write, edit, and delete reviews
4. ✅ Search and filter work correctly
5. ✅ Ratings display accurately
6. ✅ Profile pages work
7. ✅ Responsive design works
8. ✅ No critical bugs

---

**Happy Testing! 🚀**

If you find any issues, check the console logs and MongoDB data to debug.