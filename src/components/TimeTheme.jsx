import { useEffect } from 'react';

/**
 * TimeTheme dynamically updates CSS variables based on the time of day.
 * This shifts the celestial tint of the sky and the accent colors.
 */
export default function TimeTheme() {
  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      const root = document.documentElement;
      
      // Theme Phases (Optimized for Contrast)
      if (hour >= 5 && hour < 11) { // Dawn/Morning: Darker Indigo
        root.style.setProperty('--bg-light', '#1e1b4b');
        root.style.setProperty('--bg-dark', '#020617');
        root.style.setProperty('--accent', '#22d3ee');
        root.style.setProperty('--nebula-1', 'rgba(34, 211, 238, 0.06)');
        root.style.setProperty('--nebula-2', 'rgba(99, 102, 241, 0.06)');
      } 
      else if (hour >= 11 && hour < 17) { // Day: Darker Slate
        root.style.setProperty('--bg-light', '#1e293b');
        root.style.setProperty('--bg-dark', '#020617');
        root.style.setProperty('--accent', '#fbbf24');
        root.style.setProperty('--nebula-1', 'rgba(96, 165, 250, 0.06)');
        root.style.setProperty('--nebula-2', 'rgba(167, 139, 250, 0.06)');
      } 
      else if (hour >= 17 && hour < 21) { // Dusk/Evening: Darker Purple
        root.style.setProperty('--bg-light', '#2e1065');
        root.style.setProperty('--bg-dark', '#020617');
        root.style.setProperty('--accent', '#f472b6');
        root.style.setProperty('--nebula-1', 'rgba(244, 114, 182, 0.06)');
        root.style.setProperty('--nebula-2', 'rgba(139, 92, 246, 0.06)');
      } 
      else { // Night: Deepest Black/Navy
        root.style.setProperty('--bg-light', '#0f172a');
        root.style.setProperty('--bg-dark', '#020617');
        root.style.setProperty('--accent', '#f1f5f9');
        root.style.setProperty('--nebula-1', 'rgba(148, 163, 184, 0.06)');
        root.style.setProperty('--nebula-2', 'rgba(30, 41, 59, 0.06)');
      }
    };

    updateTheme();
    const timer = setInterval(updateTheme, 60000); // Sync every minute
    return () => clearInterval(timer);
  }, []);

  return null;
}
