// ══════════════════════════════════════════
// routes/subscribers.js
// ══════════════════════════════════════════

const express  = require('express');
const router   = express.Router();
const { adminAuth } = require('../middleware/auth');
const { subscribe, getSubscribers } = require('../controllers/subscribers');

router.post('/',  subscribe);                     // POST /api/subscribers
router.get('/',   adminAuth, getSubscribers);     // GET  /api/subscribers (أدمن)

module.exports = router;
