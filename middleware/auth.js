// ══════════════════════════════════════════
// middleware/auth.js — Admin Authentication
// ══════════════════════════════════════════

const adminAuth = (req, res, next) => {
  const key = req.headers['x-admin-key'] || req.query.adminKey;

  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'غير مصرح — Admin key مطلوب' });
  }

  next();
};

module.exports = { adminAuth };
