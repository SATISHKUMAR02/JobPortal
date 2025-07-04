const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const ratelimit = require('express-rate-limit');

// IP Limiter
const limiter = ratelimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})



router.post('/register',limiter,authController.registerUser);
router.post('/login',limiter,authController.login);

 
module.exports = router;