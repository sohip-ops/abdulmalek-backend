// ══════════════════════════════════════════
// models/Settings.js — MongoDB Schema
// ══════════════════════════════════════════

const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key:   { type: String, default: 'main', unique: true },
  contact: {
    wa: { type: String, default: '' },
    ig: { type: String, default: '' },
    li: { type: String, default: '' }
  },
  bgVideoUrl: { type: String, default: '' },
  videoLoopUrl: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', settingsSchema);
