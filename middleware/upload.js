// ══════════════════════════════════════════
// middleware/upload.js — Multer File Upload
// ══════════════════════════════════════════

const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

// تأكد من وجود مجلد الرفع
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext      = path.extname(file.originalname);
    const safeName = Date.now() + '-' + Math.round(Math.random() * 1e5) + ext;
    cb(null, safeName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /mp4|mov|webm|mkv|avi/i;
  const ext = path.extname(file.originalname);
  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('نوع الملف غير مدعوم — يُسمح بـ MP4, MOV, WEBM فقط'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB حد أقصى
});

module.exports = upload;
