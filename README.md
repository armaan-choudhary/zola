# ZOLA ✨

A beautiful, interactive New Year constellation of messages. ZOLA allows you to create your own digital sky, share it with friends, and watch as their messages form a unique celestial constellation.

![ZOLA Hero](https://zola-sky.vercel.app/og-image.png)

## 🌌 Features

-   **Celestial Constellations:** Every message you receive becomes a star. ZOLA's algorithm automatically connects them to form a stunning, unique constellation.
-   **Brand Identity:** Features a unique, interactive "Z" constellation logo mark that twinkles and pulses.
-   **The Global Cosmos:** A real-time home page counter showing how many "stars the universe is currently holding" across the entire world.
-   **Digital Time Capsule:** Messages are locked behind a "Locked" state until New Year's Day (Jan 1, 2026).
-   **Highly Customizable:** Senders can choose the star's shape (Circle, Star, Heart, etc.), color, and emoji.
- **Social-Ready Sharing:** Integrated with the **Native Web Share API**. Generate and share high-quality cards for Instagram Stories. Features an automatic "Link Sticker" clipboard hack for a better social loop.
- **Unified Visuals:** Seamless design consistency between the app's interactive modals and the generated shared images.
- **Immersive Atmosphere:** Features drifting background stars, shooting stars, organic nebula clouds, and snowfall.
- **Polished UI:** Perfectly centered "glassmorphism" aesthetic with responsive design using modern `100dvh` viewport units.

## 🛠️ Tech Stack

-   **Frontend:** React (Vite)
-   **Database & Realtime:** [Supabase](https://supabase.com/)
-   **Analytics:** Vercel Analytics & Speed Insights
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

### Deployment
The project is optimized for **Vercel**. Simply connect your GitHub repository and add your environment variables. The included `vercel.json` handles routing and analytics automatically.

## 🗄️ Database Setup
Create `skies` and `stars` tables in Supabase (see `context.md` for schema details).

## 📄 License
MIT License