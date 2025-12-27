# Zola Project Context (Final Polish)

Zola is an interactive New Year application designed for users to share and receive anonymous messages through a celestial, constellation-themed interface.

## Core Concept
- **The Sky:** Each user can create their own "Sky" (a personalized space).
- **Stars:** Each message sent to a user appears as an interactive star in their sky.
- **Constellations:** Stars are connected using a specialized Single-Hub tree expansion algorithm. The oldest star acts as the central hub (max 4 connections), ensuring a fully connected, loop-free structure.

## Key Features
- **Adaptive Tier Evolution:**
    - **Phase 01 (First Spark):** 0-4 stars. Gray theme, minimal and matte.
    - **Phase 02 (Astral Awakening):** 5-14 stars. Bold white typography with blue atmospheric accents.
    - **Phase 03 (Supernova Bloom):** 15-29 stars. Golden theme with glowing lines and a warm amber wash.
    - **Phase 04 (Infinite Galaxy):** 30+ stars. Multi-layered vibrant pulsating gradients (Cyan, Purple, Pink, Gold, Blue), rotating star arcs, and energy-flowing gradient constellation lines.
- **Interactive Sky View:** Responsive star sizing (8-14px on mobile, 10-20px on desktop), precision line rendering, and high-frequency shooting stars at higher tiers.
- **Unified Artifact System:**
    - Shared images follow a sharp aesthetic: **6px black borders**, **no rounded corners**, and **centered footers** ("From [User]'s Sky").
    - **Fixed Aspect Ratio:** Social sharing cards are locked to **500x750**.
    - **Dynamic Narratives:** Cards randomly select from 10 tier-appropriate poetic phrases based on a user-specific hash.
- **Session Persistence:** Uses `localStorage` to save the creator's sky slug, enabling a "Welcome Back" flow for users in restrictive in-app browsers (Instagram/TikTok).
- **Global Social Proof:** A real-time global counter on the home page tracking total stars across the universe.
- **Message Locking:** Stars are locked and unreadable until New Year's Day (January 1, 2026).
- **Customizable Stars:** Senders can choose messages, emojis, colors, and shapes.
- **UI/UX Polish:**
    - Centered, mobile-first layouts using `100dvh`.
    - Optimized performance via static CSS gradients and refined animation logic.
    - Bolder brand identity with weight-weighted ZOLA logo.

## Tech Stack
- **Framework:** React (Vite)
- **Backend/Database:** Supabase (PostgreSQL + Realtime)
- **Analytics:** Vercel Analytics & Vercel Speed Insights
- **Animations:** Framer Motion
- **Styling:** CSS Variables, Glassmorphism, Mobile-first
- **Visual Effects:** React Snowfall, Custom Nebula Gradients
- **Icons:** React Icons (FaIcons)

## Architecture & Structure
- `/src/components/Logo.jsx`: The core branding component featuring a twinkly SVG constellation.
- `/src/components/StoryCard.jsx`: Unified component for generating shareable assets (Star, Constellation, and Link Invite).
- `/src/pages/`: `Home.jsx` (Hero), `Sky.jsx` (Interactive Sky), `Send.jsx` (Wish form), `Debug.jsx` (Engine Demos), `CardsPreview.jsx` (Artifact Gallery).
- `/src/index.css`: Refactored, variable-driven CSS design system.

## Data Model
- **Skies Table:** `id`, `slug` (unique), `creator_name`, `created_at`.
- **Stars Table:** `id`, `sky_slug`, `message`, `sender_name`, `emoji`, `pos_x`, `pos_y`, `style`, `shape`, `created_at`.

## Final Logic Polish
- **Vertical Centering:** Uses `100dvh` to ensure centering works across all mobile browsers regardless of dynamic toolbars.
- **Image Generation:** Uses `html-to-image` (`toBlob`) with an explicit processing delay and high `pixelRatio` for crisp shared assets.
- **Deployment:** Configured with `vercel.json` for SPA routing and native analytics.
