# TravelGenie – Personalized AI Travel Itinerary Planner

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Express.js](https://img.shields.io/badge/Express-4.21-black.svg?logo=express)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900.svg?logo=leaflet)](https://leafletjs.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-orange.svg?logo=google)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **TravelGenie** is a full-stack, responsive web application that leverages Generative AI to design intelligent, personalized, and budget-optimized travel itineraries. Built with a clean travel-tech design system inspired by Airbnb and modern SaaS products, it crafts day-by-day travel plans, maps routes on OpenStreetMap, monitors destination weather, and exports ready-to-print PDFs.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement & Solution](#-problem-statement--proposed-solution)
- [Core Features](#-core-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Database Schema (Supabase PostgreSQL)](#-database-schema-supabase-postgresql)
- [API Documentation](#-api-documentation)
- [Local Development Setup](#-local-development-setup)
- [Environment Variables](#-environment-variables)
- [Deployment Guide](#-deployment-guide)
  - [Backend on Render](#deploying-backend-on-render)
  - [Frontend on Vercel](#deploying-frontend-on-vercel)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)

---

## 🌍 Overview

Planning trips today involves tab overload across flights, hotel portals, review blogs, blogs, and map apps. **TravelGenie** turns this chaotic process into a single, cohesive planning experience. By considering destination, dates, budget constraints, travel styles, and specific interest tags, the platform produces structured, geographically coherent schedules with real coordinates, budget distribution analytics, and natural language modifications.

---

## 💡 Problem Statement & Proposed Solution

### The Problem
* **Information Fragmentation:** Travelers visit an average of 38 websites before booking a vacation.
* **Geographic Incoherence:** Manual itineraries often schedule far-apart attractions on the same day, causing fatigue and excessive transit expenses.
* **Budget Variance:** Lack of real-time category breakdown leads to overspending on cabs and admission fees.

### The TravelGenie Solution
* **Geographically Clustered AI Schedules:** Generative AI groups nearby attractions sequentially with realistic travel durations.
* **Dynamic Budget Optimization Engine:** Automatic detection of over-budget scenarios with 1-click alternative suggestions (free viewpoints, public transit passes, homestays).
* **Interactive Geographic Maps:** Every place is resolved with geocoded coordinates on OpenStreetMap.
* **Co-Pilot Natural Language Modification:** Travelers can chat in plain English (e.g., *"Make this trip cheaper"*, *"Include vegetarian restaurants"*, *"Add photography spots"*) and inspect a preview before confirming.

---

## ✨ Core Features

1. **Intelligent Multi-Step Planner Wizard:**
   - **Step 1:** Destination, starting point, dates, travelers (adults & children).
   - **Step 2:** Budget amount, currency (`INR ₹`, `USD $`, `EUR €`, `GBP £`), per-person vs group toggle, budget tier (*Budget*, *Moderate*, *Luxury*).
   - **Step 3:** Multi-select travel tags (*Adventure, Nature, Mountains, Beaches, Culture, Photography, Food, Nightlife, Spiritual, Relaxation*).
   - **Step 4:** Travel style (*Solo, Couple, Family, Friends*), pacing (*Relaxed, Balanced, Packed*), accommodation style, and transportation preference.
   - **Step 5:** Natural language requests (*"Avoid crowded spots", "Prefer vegetarian food"*) with review summary.

2. **Day-by-Day Interactive Schedule:**
   - Morning, Afternoon, and Evening activities with category badges, duration, transport suggestion, and ticket cost.
   - Dining recommendations for Lunch and Dinner featuring authentic local cuisine and signature dishes.

3. **OpenStreetMap & Leaflet Integration:**
   - Color-coded pins for Sightseeing, Adventure, Nature, and Dining.
   - Interactive popups with activity details.
   - Day-by-day filter pills and synchronized location sidebar.

4. **Visual Budget & Expense Dashboard:**
   - Breakdown across 5 categories: Accommodation, Transportation, Food, Activities, and Miscellaneous.
   - Real-time utilization bar with color-coded warnings (Green < 85%, Amber 85-100%, Red > 100%).
   - Dedicated **AI Budget Optimizer Modal** with 1-click alternative swaps.

5. **Climate & Weather Integration:**
   - Real-time OpenWeather integration with 5-day forecast.
   - Seasonal advisory engine with tailored packing recommendations.

6. **Natural Language AI Co-Pilot:**
   - Floating assistant panel for natural language modifications.
   - Live modification preview and **Undo/Restore** stack.

7. **My Trips Management:**
   - Dashboard to search, filter, duplicate, view, and delete saved itineraries.

8. **Professional PDF Export:**
   - Single-click export using `jspdf` and `jspdf-autotable` with summary tables, day schedules, budget breakdowns, and travel advisories.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, React Router 7 |
| **Maps & PDF** | Leaflet, OpenStreetMap, jsPDF, jsPDF-AutoTable |
| **Backend** | Node.js, Express.js, TypeScript, REST APIs |
| **AI Engine** | Google Gemini API (`@google/genai` 2.x / `gemini-2.5-flash`), Zod Validation |
| **Database & Auth** | Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS) |
| **Weather & Geo** | OpenWeatherMap API, OpenStreetMap Nominatim Geocoding |
| **Deployment** | Frontend on Vercel, Backend on Render |

---

## 📐 System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   TravelGenie Frontend                 │
│         (React 18 + Vite + Tailwind + Leaflet)         │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS / JSON REST API
┌──────────────────────────▼─────────────────────────────┐
│                   TravelGenie Backend                  │
│               (Node.js + Express + TypeScript)         │
├─────────────────┬───────────────────┬──────────────────┤
│  AI Controller  │  Trip Controller  │ Weather & Places │
└────────┬────────┴─────────┬─────────┴────────┬─────────┘
         │                  │                  │
┌────────▼────────┐ ┌───────▼────────┐ ┌───────▼─────────┐
│  Google Gemini  │ │    Supabase    │ │ OpenWeatherMap  │
│  2.5 Flash SDK  │ │   PostgreSQL   │ │ & OpenStreetMap │
└─────────────────┘ └────────────────┘ └─────────────────┘
```

---

## 🗄️ Database Schema (Supabase PostgreSQL)

Located in `supabase/migrations/`:

```sql
-- 1. Users Table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Trips Table
CREATE TABLE public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    destination TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    travelers INT DEFAULT 1,
    budget NUMERIC NOT NULL,
    budget_type TEXT DEFAULT 'per_person',
    currency TEXT DEFAULT 'INR',
    travel_style TEXT NOT NULL,
    travel_pace TEXT DEFAULT 'balanced',
    interests TEXT[] DEFAULT '{}',
    transportation TEXT,
    accommodation TEXT,
    status TEXT DEFAULT 'planned',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Itineraries Table (JSONB Storage for Structured AI Output)
CREATE TABLE public.itineraries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
    itinerary_json JSONB NOT NULL,
    total_estimated_budget NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

*Includes Row-Level Security (RLS) policies ensuring users can only read, update, and delete their own trips.*

---

## 📡 API Documentation

### Base URL: `http://localhost:5000/api` (or production Render URL)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server status and service integration check |
| `POST` | `/ai/generate-itinerary` | Generates a complete structured itinerary matching input preferences |
| `POST` | `/ai/modify-itinerary` | Modifies existing itinerary via natural language prompt |
| `POST` | `/ai/optimize-budget` | Analyzes budget variance and returns category optimization alternatives |
| `GET` | `/weather?destination=City` | Current conditions and 5-day climate outlook |
| `GET` | `/places/geocode?place=Name` | Resolves geographic coordinates for map pins |
| `GET` | `/trips` | Retrieves user's saved trips |
| `POST` | `/trips` | Saves a new trip and associated itinerary |
| `PUT` | `/trips/:id` | Updates an existing trip or itinerary version |
| `DELETE` | `/trips/:id` | Deletes a trip record |

---

## 💻 Local Development Setup

### Prerequisites
* **Node.js** (v20 or v22 LTS)
* **npm** (v10+)
* **Git**

### 1. Clone the repository
```bash
git clone https://github.com/dhanwanianisha0427-ai/travelgenie-ai-travel-planner.git
cd travelgenie-ai-travel-planner
```

### 2. Configure Environment Variables
Copy `.env.example` in both backend and frontend directories:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### 3. Run the Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on **`http://localhost:5000`**.

### 4. Run the Frontend (in a separate terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **`http://localhost:5173`**.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```ini
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Optional: Add your Google Gemini API key (https://aistudio.google.com)
GEMINI_API_KEY=

# Optional: Add your Supabase credentials (https://supabase.com)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Optional: Add OpenWeather API key (https://openweathermap.org)
OPENWEATHER_API_KEY=
```
> *Note: If external API keys are omitted, TravelGenie automatically runs using its built-in intelligent demo engine with real geocoding and authentic itinerary generation.*

### Frontend (`frontend/.env`)
```ini
# Production API endpoint (Render backend URL)
VITE_API_URL=http://localhost:5000
```

---

## 🚀 Deployment Guide

### Deploying Backend on Render
1. Log in to [Render](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set **Root Directory** to `backend`.
5. Configure:
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
6. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `CLIENT_URL` = `https://your-frontend-domain.vercel.app`
   - `GEMINI_API_KEY` (if using live API)
   - `SUPABASE_URL` and `SUPABASE_ANON_KEY` (if using Supabase)
7. Click **Create Web Service**. Your backend will be live at `https://travelgenie-backend.onrender.com`.

### Deploying Frontend on Vercel
1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project** and import your GitHub repository.
3. Set **Root Directory** to `frontend`.
4. Framework Preset: **Vite**.
5. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com`
6. Click **Deploy**. Vercel will build and serve your app globally with client-side SPA routing (`vercel.json`).

---

## 🔮 Future Enhancements

- [ ] Live Flight & Hotel price comparison via Amadeus/Skyscanner APIs
- [ ] Collaborative multi-user trip editing via WebSockets
- [ ] Offline PWA caching with Service Workers
- [ ] Export directly to Google Calendar & Apple Wallet
- [ ] Multi-currency real-time conversion via ExchangeRate API

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
