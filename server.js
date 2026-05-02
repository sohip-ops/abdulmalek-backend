// ══════════════════════════════════════════
// server.js — ABDULMALEK Portfolio Backend
// ══════════════════════════════════════════
require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const { MongoClient } = require('mongodb');
const connectDB = require('./db');

const videosRouter      = require('./routes/videos');
const subscribersRouter = require('./routes/subscribers');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Connect MongoDB ───────────────────────
connectDB();

// اتصال إضافي بـ MongoClient (كما طلبت)
const client = new MongoClient(process.env.MONGO_URI);
async function connectClient() {
  try {
    await client.connect();
    console.log('✅ متصل بقاعدة البيانات');
  } catch (err) {
    console.error(err);
  }
}
connectClient();

// ─── Middleware ────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-admin-key']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Static uploads ───────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ───────────────────────────────
app.use('/api/videos',      videosRouter);
app.use('/api/subscribers', subscribersRouter);

// ─── Health Check ─────────────────────────
app.get('/', (req, res) => {
  res.json({
    status:  '✅ Server is running',
    name:    'ABDULMALEK Portfolio API',
    version: '2.0.0',
    db:      'MongoDB Atlas',
    endpoints: {
      videos:      'GET|POST /api/videos',
      videoUpload: 'POST /api/videos/upload/file',
      videoById:   'GET|PUT|DELETE /api/videos/:id',
      subscribers: 'GET|POST /api/subscribers'
    }
  });
});

// ─── 404 ──────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'المسار غير موجود' });
});

// ─── Error Handler ────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ error: 'خطأ في السيرفر', details: err.message });
});

// ─── Start ────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`  ├─ Videos API:   /api/videos`);
  console.log(`  ├─ File Upload:  /api/videos/upload/file`);
  console.log(`  └─ Subscribers:  /api/subscribers\n`);
});
