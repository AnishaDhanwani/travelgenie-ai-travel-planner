import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import aiRoutes from './routes/aiRoutes';
import tripRoutes from './routes/tripRoutes';
import weatherRoutes from './routes/weatherRoutes';
import placesRoutes from './routes/placesRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed localhost or production client URL
    const allowed = [
      config.clientUrl,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:4173',
    ];
    
    // Also allow any vercel.app domain for easy deployment previews
    if (allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    return callback(null, true); // Allow all during development/demo deployment
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'TravelGenie AI Itinerary API',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!config.geminiApiKey,
    supabaseConfigured: !!config.supabaseUrl,
    weatherConfigured: !!config.openWeatherApiKey,
  });
});

// Mount Routes
app.use('/api/ai', aiRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/places', placesRoutes);

// Error Handling
app.use(errorHandler);

export default app;

