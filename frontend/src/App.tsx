import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { PlannerPage } from './pages/PlannerPage';
import { ItineraryResultPage } from './pages/ItineraryResultPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { AuthPage } from './pages/AuthPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <TripProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/plan" element={<PlannerPage />} />
                <Route path="/itinerary" element={<ItineraryResultPage />} />
                <Route path="/my-trips" element={<MyTripsPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TripProvider>
    </AuthProvider>
  );
};

export default App;

