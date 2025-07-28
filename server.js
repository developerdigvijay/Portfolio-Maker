const express = require('express');
const mongoose = require('mongoose');
// Import required modules
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = 3000;
// Create Express app and set port number

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/portfolio_auth', { useNewUrlParser: true, useUnifiedTopology: true });
// Connect to MongoDB database

// User Schema
// Define User schema for MongoDB
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  resetToken: String,
  resetTokenExpiry: Date,
}, { timestamps: true }); // adds createdAt and updatedAt
const User = mongoose.model('User', userSchema);

// Middleware to parse form data and JSON
// Middleware
app.use(express.urlencoded({ extended: true }));
// Set up session management with MongoDB store
app.use(express.json());
app.use(session({
  secret: 'portfolio_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/portfolio_auth' }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
// Middleware to protect routes (only logged-in users can access)

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session.userId) return next();
  res.redirect('/landing.html');
}

// Optionally, prevent authenticated users from accessing login/register pages
const disableAuthPages = (req, res, next) => {
  if (req.session.userId) return res.redirect('/index.html');
  next();
};

app.get('/login.html', disableAuthPages, (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});
// Registration route: create new user
app.get('/register.html', disableAuthPages, (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

// Routes

// Registration
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required.' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'Email already registered.' });
// Login route: check credentials
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  req.session.userId = user._id;
  req.session.userName = user.name;
  res.json({ success: true });
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
// Logout route: destroy session
  if (!user) return res.status(400).json({ error: 'Invalid credentials.' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: 'Invalid credentials.' });
  req.session.userId = user._id;
  req.session.userName = user.name;
  res.json({ success: true, name: user.name });
});
// Get current user info (for navbar, etc.)

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

// Get current user
app.get('/api/user', async (req, res) => {
  if (!req.session.userId) return res.json({ authenticated: false });
  // Fetch user from DB to get email and joining date
// Forgot password: generate reset link
  const user = await User.findById(req.session.userId);
  if (!user) return res.json({ authenticated: false });
  res.json({
    authenticated: true,
    name: user.name,
    email: user.email,
    joinedAt: user.createdAt
  });
});

// Forgot Password (send reset link)
app.post('/api/forgot', async (req, res) => {
  const { email } = req.body;
// Reset password: verify token and set new password
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'No user with that email.' });
  const token = Math.random().toString(36).substr(2);
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 min
  await user.save();

  // For demo: just return the reset link in response (replace with nodemailer in production)
  res.json({ success: true, resetLink: `http://localhost:${PORT}/reset.html?token=${token}&email=${email}` });
});

// Reset Password
app.post('/api/reset', async (req, res) => {
  let { email, token, password } = req.body;
  if (!email || !token || !password) return res.status(400).json({ error: 'Missing required fields.' });
  email = email.trim().toLowerCase();
  token = token.trim();
  // Find user by email and case-insensitive token, and check expiry
  const user = await User.findOne({
// Protect main form page (only logged-in users)
    email,
    resetToken: { $regex: new RegExp('^' + token + '$', 'i') },
    resetTokenExpiry: { $gt: Date.now() }
  });
// Delete account route
  if (!user) return res.status(400).json({ error: 'Invalid or expired token.' });
  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();
  res.json({ success: true });
});

// Protect main form/page
app.get('/form.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html'));
});

// Serve homepage at root URL
// Delete Account API
app.delete('/api/delete-account', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated.' });
  try {
// Serve static files (CSS, JS, images, etc.)
    await User.deleteOne({ _id: req.session.userId });
    req.session.destroy(() => {
// Start the server and listen for requests
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete account.' });
  }
});

// Serve landing page at root (should be after all other routes)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve static files (should be after the above routes)
app.use(express.static(path.join(__dirname)));

// Start the server and listen for requests
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));