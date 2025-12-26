# ZOLA ✨

A beautiful, interactive New Year constellation of messages. ZOLA allows you to create your own digital sky, share it with friends, and watch as their messages form a unique celestial constellation.

![ZOLA Hero](https://zola-sky.vercel.app/og-image.png)

## 🌌 Features

- **Celestial Constellations:** Every message becomes a star. ZOLA uses a robust, single-hub tree expansion algorithm (starting from the oldest star) to form a unique, loop-free constellation.
- **Adaptive Tier Evolution:** The sky evolves through 4 distinct phases. Phase 04 (Infinite Galaxy) features a vibrant multi-colored pulsating atmosphere, energy-pulsing gradient lines, and rotating celestial arcs around stars.
- **Session Persistence:** Integrated `localStorage` allows users visiting from Instagram/TikTok in-app browsers to easily return to their created sky via a "Welcome Back" recovery button.
- **Brand Identity:** Bold, interactive branding with high-contrast, standardized footers across all shared artifacts.
- **Digital Time Capsule:** Messages are locked behind a "Locked" state until New Year's Day (Jan 1, 2026).
- **Highly Customizable:** Senders choose star shape, color, and emoji.
- **Social-Ready Sharing:** Optimized 500x750 high-quality artifact cards for Instagram Stories with 6px sharp borders and standardized branding.
- **Polished UI:** Mobile-first design using `100dvh`, responsive star sizing, and optimized static gradients for smooth performance on all devices.

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