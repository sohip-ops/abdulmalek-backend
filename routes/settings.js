// ══════════════════════════════════════════
// routes/settings.js
// ══════════════════════════════════════════

const express  = require('express');
const router   = express.Router();
const { adminAuth } = require('../middleware/auth');
const upload   = require('../middleware/upload');
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

// ══════════════════════════════════════════
// POST /api/settings/video-loop — رفع فيديو اللوب (نفس أسلوب رفع باقي الفيديوهات)
// ══════════════════════════════════════════
router.post('/video-loop', adminAuth, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'لم يتم إرفاق أي ملف فيديو' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const settings = await Settings.findOneAndUpdate(
      { key: 'main' },
      {
        $set: {
          videoLoopUrl: fileUrl,
          updatedAt: new Date()
        }
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      data: settings,
      message: '✓ تم رفع فيديو اللوب وحفظه'
    });
  } catch (err) {
    res.status(500).json({ error: 'خطأ في رفع الفيديو', details: err.message });
  }
});

module.exports = router;
