import app from './app';
import { config } from './config/env';
import { SupabaseService } from './services/supabaseService';

const PORT = config.port;

// Initialize Supabase if configured
SupabaseService.initialize();

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 TravelGenie Backend Server running on port ${PORT}`);
  console.log(`🌐 Health check available at: http://localhost:${PORT}/api/health`);
  console.log(`🤖 Gemini AI Mode: ${config.geminiApiKey ? 'LIVE (Gemini 2.5 Flash)' : 'INTELLIGENT LOCAL DEMO ENGINE'}`);
  console.log(`🗄️  Supabase Mode: ${config.supabaseUrl ? 'CONNECTED (Cloud Postgres)' : 'LOCAL IN-MEMORY DEMO STORE'}`);
  console.log(`⛅ Weather Mode: ${config.openWeatherApiKey ? 'OPENWEATHER API' : 'INTELLIGENT CLIMATE ADVISORY ENGINE'}`);
  console.log(`===============================================`);
});

