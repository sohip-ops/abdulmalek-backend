// ══════════════════════════════════════════
// routes/settings.js
// ══════════════════════════════════════════

const express  = require('express');
const router   = express.Router();
const { adminAuth } = require('../middleware/auth');
const Settings = require('../models/Settings');

// GET /api/settings — جلب الإعدادات
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: 'main' });
    if (!settings) settings = await Settings.create({ key: 'main' });
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ error: 'خطأ', details: err.message });
  }
});

// POST /api/settings — حفظ الإعدادات (أدمن)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { contact, bgVideoUrl } = req.body;
    const update = { updatedAt: new Date() };
    if (contact)    update.contact    = contact;
    if (bgVideoUrl !== undefined) update.bgVideoUrl = bgVideoUrl;

    const settings = await Settings.findOneAndUpdate(
      { key: 'main' },
      { $set: update },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: settings, message: '✓ تم حفظ الإعدادات' });
  } catch (err) {
    res.status(500).json({ error: 'خطأ', details: err.message });
  }
});

module.exports = router;
