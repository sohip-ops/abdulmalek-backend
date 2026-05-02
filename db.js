// ══════════════════════════════════════════
// db.js — MongoDB Connection
// ══════════════════════════════════════════
require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ متصل بقاعدة البيانات');
  } catch (err) {
    console.error('❌ فشل الاتصال بقاعدة البيانات:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
