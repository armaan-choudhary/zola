# Zola Project Context (Final Build)

Zola is an interactive New Year application designed for users to share and receive anonymous messages through a celestial, constellation-themed interface.

## Core Concept
- **The Sky:** Each user can create their own "Sky" (a personalized space).
- **Stars:** Each message sent to a user appears as an interactive star in their sky.
- **Constellations:** Stars are automatically connected using a Minimum Spanning Forest algorithm to form a beautiful, evolving constellation.

## Key Features
- **Interactive Sky View:** Pagination (12 stars per page), drifting background stars, shooting stars, and clickable interactive stars.
- **Brand Identity:** Custom "Z" constellation logo integrated into the "Zola" wordmark.
- **Global Social Proof:** A real-time global counter on the home page tracking "how many stars the universe is holding."
- **Message Locking:** Stars are locked and unreadable until New Year's Day (January 1, 2026).
- **Customizable Stars:** Senders can choose messages, emojis, colors, and shapes (Circle, Square, Triangle, Star, Heart, Gem).
- **Robust Sharing:** 
    - **Native Sharing:** Uses the Web Share API (`toBlob`) for mobile devices to share images directly to stories.
    - **Direct Download:** Dedicated download buttons for desktop users or manual sharing.
    - **Story Card Generation:** High-quality PNG generation using `html-to-image`.
- **UI/UX Polish:**
    - Centered, mobile-first layouts using `100dvh` for perfect vertical alignment.
    - Minimalist "glassmorphism" aesthetic with atmospheric nebula background effects.
    - Variable-driven CSS architecture for easy maintainability.

## Tech Stack
- **Framework:** React (Vite)
- **Backend/Database:** Supabase (PostgreSQL + Realtime)
- **Animations:** Framer Motion, JS Confetti
- **Styling:** CSS Variables, Glassmorphism, Mobile-first
- **Visual Effects:** React Snowfall, Custom Nebula Gradients
- **Icons:** React Icons (FaIcons)

## Architecture & Structure
- `/src/components/Logo.jsx`: The core branding component featuring a twinkly SVG constellation.
- `/src/pages/`: `Home.jsx` (Hero + Global Counter), `Sky.jsx` (Interactive Sky), `Send.jsx` (Wish form).
- `/src/Star.jsx`: Individual interactive star logic with memoized twinkle and size properties.
- `/src/index.css`: Refactored, variable-driven CSS containing the entire design system.

## Data Model
- **Skies Table:** `id`, `slug` (unique), `creator_name`, `created_at`.
- **Stars Table:** `id`, `sky_slug`, `message`, `sender_name`, `emoji`, `pos_x`, `pos_y`, `style`, `shape`, `created_at`.

## Final Logic Polish
- **Vertical Centering:** Uses `100dvh` to ensure centering works across all mobile browsers regardless of dynamic toolbars.
- **Sharing Separation:** Explicit separation between "Share to Story" (Native API) and "Download" to prevent UX confusion on non-supported browsers.
- **Performance:** Extensive use of `useMemo` in `Star` components to prevent flickering during sky-wide re-renders.