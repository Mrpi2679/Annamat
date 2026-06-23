import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import FoodListing from '../models/FoodListing.js';
import Order from '../models/Order.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/annamat';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

let cachedDb = null;
let dbAttempted = false;
async function connectDB() {
  if (cachedDb) return;
  if (dbAttempted) throw new Error('MongoDB connection previously failed');
  dbAttempted = true;
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  cachedDb = mongoose.connection;
  console.log('MongoDB connected');
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// ─── Auth Routes ────────────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  try {
    await connectDB();
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, role });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Food Listing Routes ────────────────────────────────────────

app.post('/api/food', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== 'restaurant') return res.status(403).json({ message: 'Only restaurants can create listings' });
    const user = await User.findById(req.user.id);
    const listing = await FoodListing.create({ ...req.body, restaurant: req.user.id, restaurantName: user.name });
    res.status(201).json({ listing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/food', async (req, res) => {
  try {
    await connectDB();
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    const listings = await FoodListing.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json({ listings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/food/my', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== 'restaurant') return res.status(403).json({ message: 'Access denied' });
    const listings = await FoodListing.find({ restaurant: req.user.id }).sort({ createdAt: -1 });
    res.json({ listings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/food/:id', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    const listing = await FoodListing.findOneAndUpdate(
      { _id: req.params.id, restaurant: req.user.id },
      req.body,
      { new: true }
    );
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json({ listing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/food/:id', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    const listing = await FoodListing.findOneAndDelete({ _id: req.params.id, restaurant: req.user.id });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Order Routes ───────────────────────────────────────────────

app.post('/api/orders', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== 'customer') return res.status(403).json({ message: 'Only customers can place orders' });
    const listing = await FoodListing.findById(req.body.listingId);
    if (!listing || !listing.isActive) return res.status(400).json({ message: 'Listing not available' });
    const order = await Order.create({
      listing: listing._id,
      buyer: req.user.id,
      restaurant: listing.restaurant,
      quantity: req.body.quantity,
      totalPrice: listing.discountedPrice * req.body.quantity,
      status: 'pending'
    });
    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/orders', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    let orders;
    if (req.user.role === 'customer') {
      orders = await Order.find({ buyer: req.user.id }).populate('listing').sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ restaurant: req.user.id }).populate('listing').sort({ createdAt: -1 });
    }
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/orders/:id/status', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, restaurant: req.user.id },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Profile Routes ─────────────────────────────────────────────

app.put('/api/profile', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, phone, address }, { new: true });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Static files & SPA fallback (for Vercel) ───────────────────

app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ─── Start (for local dev) ──────────────────────────────────────

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  console.log('Starting Annamat server...');
  connectDB().catch(() => {});
  const server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = PORT + 1;
      console.log(`Port ${PORT} is busy, trying ${nextPort}...`);
      app.listen(nextPort, () => console.log(`Server running on http://localhost:${nextPort}`));
    }
  });
}

export default app;
