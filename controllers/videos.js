// ══════════════════════════════════════════
// controllers/videos.js
// ══════════════════════════════════════════

const path  = require('path');
const fs    = require('fs');
const Video = require('../models/Video');

// GET /api/videos
const getVideos = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const videos = await Video.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: videos, count: videos.length });
  } catch (err) {
    res.status(500).json({ error: 'خطأ في جلب الفيديوهات', details: err.message });
  }
};

// GET /api/videos/:id
const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'الفيديو غير موجود' });
    res.json({ success: true, data: video });
  } catch (err) {
    res.status(500).json({ error: 'خطأ', details: err.message });
  }
};

// POST /api/videos — إضافة بـ URL
const addVideo = async (req, res) => {
  try {
    const { title, video_url, category, duration, description, thumbnail, channel } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: 'العنوان مطلوب' });

    const video = await Video.create({
      title: title.trim(),
      videoUrl:    video_url   || '',
      category:    category    || '',
      duration:    duration    || '',
      description: description || '',
      thumbnail:   thumbnail   || '',
      channel:     channel     || ''
    });

    res.status(201).json({ success: true, data: video, message: '✓ تم إضافة الفيديو' });
  } catch (err) {
    res.status(500).json({ error: 'خطأ في إضافة الفيديو', details: err.message });
  }
};

// POST /api/videos/upload — رفع ملف فيديو مباشرة
const uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'لم يتم رفع أي ملف' });

    const { title, description, category, duration, channel } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: 'العنوان مطلوب' });

    const fileUrl = `/uploads/${req.file.filename}`;

    const video = await Video.create({
      title:       title.trim(),
      videoUrl:    fileUrl,
      filePath:    req.file.path,
      category:    category    || '',
      duration:    duration    || '',
      description: description || '',
      channel:     channel     || ''
    });

    res.status(201).json({ success: true, data: video, message: '✓ تم رفع الفيديو وحفظه' });
  } catch (err) {
    res.status(500).json({ error: 'خطأ في رفع الفيديو', details: err.message });
  }
};

// PUT /api/videos/:id
const updateVideo = async (req, res) => {
  try {
    const { title, video_url, category, duration, description, thumbnail, channel } = req.body;

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { title, videoUrl: video_url, category, duration, description, thumbnail, channel },
      { new: true, runValidators: true }
    );

    if (!video) return res.status(404).json({ error: 'الفيديو غير موجود' });
    res.json({ success: true, data: video, message: '✓ تم تعديل الفيديو' });
  } catch (err) {
    res.status(500).json({ error: 'خطأ في تعديل الفيديو', details: err.message });
  }
};

// DELETE /api/videos/:id
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ error: 'الفيديو غير موجود' });

    // احذف الملف من الديسك لو كان مرفوعاً محلياً
    if (video.filePath && fs.existsSync(video.filePath)) {
      fs.unlinkSync(video.filePath);
    }

    res.json({ success: true, message: '✓ تم حذف الفيديو' });
  } catch (err) {
    res.status(500).json({ error: 'خطأ في حذف الفيديو', details: err.message });
  }
};

// PATCH /api/videos/:id/view
const incrementView = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!video) return res.status(404).json({ error: 'الفيديو غير موجود' });
    res.json({ success: true, views: video.views });
  } catch (err) {
    res.status(500).json({ error: 'خطأ', details: err.message });
  }
};

// PUT /api/videos/:id/category — تحديث التصنيف فقط
const updateVideoCategory = async (req, res) => {
  try {
    const { category } = req.body;

    if (category === undefined) {
      return res.status(400).json({ error: 'حقل category مطلوب' });
    }

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { category: category.trim() },
      { new: true, runValidators: true }
    );

    if (!video) return res.status(404).json({ error: 'الفيديو غير موجود' });

    res.json({ success: true, data: video, message: '✓ تم تحديث التصنيف' });
  } catch (err) {
    res.status(500).json({ error: 'خطأ في تحديث التصنيف', details: err.message });
  }
};

module.exports = { getVideos, getVideo, addVideo, uploadVideo, updateVideo, deleteVideo, incrementView, updateVideoCategory };
