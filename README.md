# ZOLA ✨

A beautiful, interactive New Year constellation of messages. ZOLA allows you to create your own digital sky, share it with friends, and watch as their messages form a unique celestial constellation.

![ZOLA Hero](https://via.placeholder.com/1200x630.png?text=ZOLA+Constellation+Messages)

## 🌌 Features

-   **Celestial Constellations:** Every message you receive becomes a star. ZOLA's algorithm automatically connects them to form a stunning, unique constellation.
-   **Brand Identity:** Features a unique, interactive "Z" constellation logo mark that twinkles and pulses.
-   **The Global Cosmos:** A real-time home page counter showing how many "stars the universe is currently holding" across the entire world.
-   **Digital Time Capsule:** Messages are locked behind a "Locked" state until New Year's Day (Jan 1, 2026).
-   **Highly Customizable:** Senders can choose the star's shape (Circle, Star, Heart, etc.), color, and emoji.
- **Social-Ready Sharing:** Integrated with the **Native Web Share API**. Generate and share high-quality cards for Instagram Stories directly to your favorite apps.
- **Dedicated Download:** Separate download functionality for desktop users to save their constellation images.
- **Immersive Atmosphere:** Features drifting background stars, shooting stars, organic nebula clouds, and snowfall.
- **Polished UI:** Perfectly centered "glassmorphism" aesthetic with responsive design using modern `100dvh` viewport units.

## 🛠️ Tech Stack

-   **Frontend:** React (Vite)
-   **Database & Realtime:** [Supabase](https://supabase.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/) & [JS Confetti](https://github.com/loonywizard/js-confetti)
-   **Visuals:** [React Snowfall](https://github.com/cahilfoley/react-snowfall) & [React Icons](https://react-icons.github.io/react-icons/)
-   **Sharing:** [html-to-image](https://github.com/bubkoo/html-to-image) & [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A Supabase project

### Installation
1. `npm install`
2. Create `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. `npm run dev`

## 🗄️ Database Setup
Create `skies` and `stars` tables in Supabase (see `context.md` for schema details).

## 📐 Architecture
- `src/components/Logo.jsx`: Custom twinkly brand mark.
- `src/pages/Sky.jsx`: Core constellation logic and sharing.
- `src/index.css`: Variable-driven design system.
- `src/Star.jsx`: Individual interactive celestial objects.

## 📄 License
MIT License
