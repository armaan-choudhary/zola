# Zola Project Context (Final Polish)

Zola is an interactive New Year application designed for users to share and receive anonymous messages through a celestial, constellation-themed interface.

## Core Concept
- **The Sky:** Each user can create their own "Sky" (a personalized space).
- **Stars:** Each message sent to a user appears as an interactive star in their sky.
- **Constellations:** Stars are automatically connected using a Minimum Spanning Forest algorithm to form a beautiful, evolving constellation.

## Key Features
- **Interactive Sky View:** Pagination (12 stars per page), drifting background stars, shooting stars, and clickable interactive stars.
- **Unified Design System:** The in-app modals and shared story cards share identical styling, including background stars, tier-based vignettes, and bold "Zola" branding.
- **Global Social Proof:** A real-time global counter on the home page tracking "how many stars the universe is holding."
- **Message Locking:** Stars are locked and unreadable until New Year's Day (January 1, 2026).
- **Customizable Stars:** Senders can choose messages, emojis, colors, and shapes.
- **Pro Social Loop (Instagram Optimized):** 
    - **Invite Cards:** Sharing a link on mobile generates a high-impact "Add a Star" invite card.
    - **Sticker Hack:** The app automatically copies the sky link to the clipboard during sharing, prompting users to paste it as a link sticker on their stories.
    - **Natural Aspect Ratio:** Shared images are tightly cropped to the modal itself for a clean, consistent look across devices.
- **UI/UX Polish:**
    - Centered, mobile-first layouts using `100dvh` for perfect vertical alignment.
    - Minimalist "glassmorphism" aesthetic with atmospheric nebula background effects.
    - Variable-driven CSS architecture for easy maintainability.

## Tech Stack
- **Framework:** React (Vite)
- **Backend/Database:** Supabase (PostgreSQL + Realtime)
- **Analytics:** Vercel Analytics & Vercel Speed Insights
- **Animations:** Framer Motion, JS Confetti
- **Styling:** CSS Variables, Glassmorphism, Mobile-first
- **Visual Effects:** React Snowfall, Custom Nebula Gradients
- **Icons:** React Icons (FaIcons)

## Architecture & Structure
- `/src/components/Logo.jsx`: The core branding component featuring a twinkly SVG constellation.
- `/src/components/StoryCard.jsx`: Unified component for generating shareable assets (Star, Constellation, and Link Invite).
- `/src/pages/`: `Home.jsx` (Hero + Global Counter), `Sky.jsx` (Interactive Sky + Star Modal), `Send.jsx` (Wish form).
- `/src/index.css`: Refactored, variable-driven CSS design system.

## Data Model
- **Skies Table:** `id`, `slug` (unique), `creator_name`, `created_at`.
- **Stars Table:** `id`, `sky_slug`, `message`, `sender_name`, `emoji`, `pos_x`, `pos_y`, `style`, `shape`, `created_at`.

## Final Logic Polish
- **Vertical Centering:** Uses `100dvh` to ensure centering works across all mobile browsers regardless of dynamic toolbars.
- **Image Generation:** Uses `html-to-image` (`toBlob`) with an explicit processing delay and high `pixelRatio` for crisp shared assets.
- **Deployment:** Configured with `vercel.json` for SPA routing and native analytics.
