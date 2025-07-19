import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const response = await fetch('https://api.sms-man.com/v1/guest/getServices');
    if (!response.ok) {
      const errorBody = await response.text();
      return res.status(response.status).json({
        error: 'Failed to fetch from SMS-Man API',
        body: errorBody,
        status: response.status
      });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

export default router;
