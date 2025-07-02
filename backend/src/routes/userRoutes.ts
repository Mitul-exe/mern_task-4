import express from 'express';
import  verifyToken  from '../middleware/auth.js';

const router = express.Router();

// ...existing code...

// Add new token validation endpoint
router.post("/validate-token", verifyToken, (req, res) => {
  try {
    res.json({ success: true, valid: true });
  } catch (error) {
    console.error("Token validation error:", error);
    res.json({ success: false, valid: false });
  }
});

// ...existing code...

export default router;
