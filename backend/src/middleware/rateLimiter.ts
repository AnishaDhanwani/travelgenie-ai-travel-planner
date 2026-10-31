import rateLimit from 'express-rate-limit';

export const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Limit each IP to 60 AI generation requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many itinerary requests from this IP, please try again in a few minutes.',
  },
});

