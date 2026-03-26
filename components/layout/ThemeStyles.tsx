
import React from 'react';

const ThemeStyles = () => (
  <style>{`
    /* Note: Fonts are imported in index.html to ensure reliable loading */

    /* --- BASE STYLES (Applies to all themes unless overridden) --- */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
      padding: 1rem;
    }
    
    .modal-content {
      background: white;
      padding: 2rem;
      max-width: 450px;
      width: 100%;
      position: relative;
    }
    
    /* Utility to hide scrollbar but allow scrolling */
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    /* --- THEME: COMIC --- */
    body.theme-comic {
      --paper-color: #f0ede5;
      --ink-color: #2c2c2c;
      --dot-color: #e0dccd;
      
      background-color: var(--paper-color);
      background-image: radial-gradient(var(--dot-color) 1px, transparent 0);
      background-size: 10px 10px;
      color: var(--ink-color);
      font-family: 'Comic Neue', cursive;
      font-weight: 700;
    }

    body.theme-comic h1, body.theme-comic h2, body.theme-comic h3, body.theme-comic h4, body.theme-comic .font-bangers {
      font-family: 'Bangers', cursive;
      letter-spacing: 2px;
    }

    body.theme-comic * {
      border-radius: 0 !important;
      text-shadow: none !important;
      box-shadow: none !important;
      transition: none !important;
    }

    body.theme-comic .bg-white, 
    body.theme-comic .bg-gray-50,
    body.theme-comic .bg-gray-100 {
      background-color: var(--paper-color) !important;
      border: 4px solid var(--ink-color);
      box-shadow: 8px 8px 0px var(--ink-color) !important;
    }

    body.theme-comic .modal-content {
      border: 4px solid var(--ink-color);
      box-shadow: 10px 10px 0px var(--ink-color) !important;
    }

    body.theme-comic button, body.theme-comic input, body.theme-comic textarea, body.theme-comic select {
      border: 3px solid var(--ink-color);
      background: var(--paper-color);
      color: var(--ink-color);
      font-family: 'Comic Neue', cursive;
      font-weight: 700;
      text-transform: uppercase;
    }

    body.theme-comic button:hover {
       background: var(--ink-color) !important;
       color: var(--paper-color) !important;
    }

    body.theme-comic header, body.theme-comic footer {
        background-color: var(--ink-color) !important;
        color: var(--paper-color) !important;
        border-bottom: 4px solid var(--ink-color);
    }
    body.theme-comic header span, body.theme-comic header .font-bold {
        font-family: 'Bangers', cursive;
    }
    
    body.theme-comic .bg-blue-500, body.theme-comic .bg-green-500, body.theme-comic .bg-red-500 {
        background: var(--paper-color) !important;
        color: var(--ink-color) !important;
        border: 3px solid var(--ink-color);
    }
    
    /* Comic Tab Styles */
    body.theme-comic .tab-btn {
        border: 4px solid transparent;
        background: transparent;
        color: var(--ink-color);
        opacity: 0.6;
    }
    body.theme-comic .tab-btn-active {
        border-bottom: 4px solid var(--ink-color) !important;
        opacity: 1;
    }


    /* --- THEME: COLOUR (Responsive, Interactive, Harmonious) --- */
    body.theme-colour {
      --edu-bg: #F8F9FA; /* Lightest gray/white background */
      --edu-primary: #FF6584; /* The Pink from the 'Get Started' button */
      --edu-secondary: #3B82F6; /* The Blue from selected items */
      --edu-text: #2D3748;
      
      background-color: var(--edu-bg);
      color: var(--edu-text);
      font-family: 'Quicksand', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -webkit-tap-highlight-color: transparent;
    }

    /* Fluid Typography: Scales smoothly between screen sizes */
    body.theme-colour h1 { font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.1; font-weight: 700; letter-spacing: -0.02em; }
    body.theme-colour h2 { font-size: clamp(1.5rem, 4vw, 2.25rem); font-weight: 700; }
    body.theme-colour h3 { font-size: clamp(1.25rem, 3vw, 1.75rem); font-weight: 600; }
    body.theme-colour h4 { font-weight: 600; }
    
    body.theme-colour .font-bangers {
        font-family: 'Quicksand', sans-serif !important; 
        font-weight: 800;
    }

    /* Card styling - Harmonious Rounded Look */
    body.theme-colour .bg-white,
    body.theme-colour .bg-gray-50,
    body.theme-colour .bg-gray-100 {
        background-color: #ffffff !important;
        border-radius: 24px !important;
        box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08); /* Soft ambient shadow */
        border: 2px solid transparent;
        transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease;
    }

    /* Mobile Layout Adjustments */
    @media (max-width: 640px) {
        body.theme-colour .bg-white,
        body.theme-colour .bg-gray-50,
        body.theme-colour .bg-gray-100 {
            border-radius: 16px !important; /* Smaller radius on mobile for more space */
            box-shadow: 0 4px 12px -2px rgba(0,0,0,0.05); /* Lighter shadow on mobile */
        }
        body.theme-colour header {
            margin-bottom: 1rem;
        }
    }

    /* Header styling */
    body.theme-colour header {
        background-color: transparent !important;
        color: #111827 !important;
        border-bottom: none;
        margin-bottom: 2rem;
        padding-top: 1rem;
    }
    
    body.theme-colour footer {
        color: #A0AEC0 !important;
        font-weight: 600;
        text-align: center;
        border-top: none;
    }

    /* Button styling - Highly Reactive Pill Shapes */
    body.theme-colour button {
        border-radius: 9999px !important;
        font-weight: 700;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        text-transform: none;
        border: none;
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        padding-left: 1.5rem;
        padding-right: 1.5rem;
        position: relative;
        overflow: hidden;
    }
    
    body.theme-colour button:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px -5px rgba(255, 101, 132, 0.4);
        filter: brightness(1.02);
    }

    body.theme-colour button:active {
        transform: translateY(1px) scale(0.97); /* Satisfying click press */
        box-shadow: 0 2px 10px rgba(255, 101, 132, 0.2);
    }

    /* Inputs - Clean, Readable, Touch-Friendly */
    body.theme-colour input, body.theme-colour textarea, body.theme-colour select {
        border-radius: 16px;
        border: 2px solid #E2E8F0;
        padding: 1rem; /* Large touch target */
        background: #FFFFFF;
        transition: all 0.2s ease;
        font-family: 'Quicksand', sans-serif;
        font-size: 1rem; /* Prevents zoom on iOS */
    }
    
    body.theme-colour input:focus, body.theme-colour textarea:focus {
        border-color: var(--edu-primary);
        box-shadow: 0 0 0 4px rgba(255, 101, 132, 0.15); /* Soft focus ring */
        outline: none;
        background: #fff;
    }

    /* Colour Theme Tabs (Pills) */
    body.theme-colour .tab-nav-container {
        /* Add background and blur to make sticky tabs clearly visible over content */
        background-color: rgba(248, 249, 250, 0.95);
        backdrop-filter: blur(8px);
        margin-left: -1rem; /* Stretch edge-to-edge on mobile (undoing parent padding) */
        margin-right: -1rem;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid rgba(0,0,0,0.05);
        display: flex; /* Ensure proper stacking context */
    }
    
    body.theme-colour .tab-btn {
        border-radius: 9999px !important;
        background-color: transparent;
        color: #718096;
        padding: 0.75rem 1.5rem !important;
    }
    body.theme-colour .tab-btn:hover {
        background-color: #EDF2F7 !important;
        color: #2D3748 !important;
        box-shadow: none;
        transform: none;
    }
    body.theme-colour .tab-btn-active {
        background-color: var(--edu-primary) !important;
        color: white !important;
        box-shadow: 0 4px 15px rgba(255, 101, 132, 0.4) !important;
    }
    body.theme-colour .tab-btn-active:hover {
        background-color: var(--edu-primary) !important;
        color: white !important;
    }

    /* Color Mapping */
    body.theme-colour .bg-green-500 { background-color: var(--edu-primary) !important; color: white !important; }
    body.theme-colour .bg-blue-500 { background-color: var(--edu-secondary) !important; color: white !important; }
    body.theme-colour .bg-red-500 { background-color: #EF5350 !important; color: white !important; }
    
    body.theme-colour img {
        border-radius: 16px;
        transition: transform 0.3s ease;
    }
    
    /* Overrides to clean up comic utility classes */
    body.theme-colour .border-4, 
    body.theme-colour .border-t-4,
    body.theme-colour .border-b-4 {
        border-width: 0 !important; 
    }
    
    body.theme-colour .border-t-4, body.theme-colour .border-b-4 {
        border-width: 1px !important;
        border-color: #EDF2F7 !important;
    }
    
    /* Responsive Modal for Colour Theme */
    body.theme-colour .modal-content {
        border: none;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        border-radius: 32px;
    }
    @media (max-width: 640px) {
        body.theme-colour .modal-content {
            border-radius: 24px;
            padding: 1.5rem;
        }
    }
    
    /* Custom Scrollbar for horizontal tabs */
    body.theme-colour ::-webkit-scrollbar {
        height: 6px;
        width: 6px;
    }
    body.theme-colour ::-webkit-scrollbar-track {
        background: transparent;
    }
    body.theme-colour ::-webkit-scrollbar-thumb {
        background: #CBD5E0;
        border-radius: 10px;
    }
    body.theme-colour ::-webkit-scrollbar-thumb:hover {
        background: #A0AEC0;
    }


    /* --- THEME: MODERN (Sleek, SaaS) --- */
    body.theme-modern {
      background-color: #f3f4f6;
      color: #1f2937;
      font-family: 'Inter', sans-serif;
    }

    body.theme-modern h1, body.theme-modern h2, body.theme-modern h3 {
        font-weight: 600;
        letter-spacing: -0.025em;
    }
    
    body.theme-modern .font-bangers {
        font-family: 'Inter', sans-serif !important;
        font-weight: 800;
    }

    body.theme-modern .bg-white {
        background-color: white !important;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }

    body.theme-modern header {
        background-color: white !important;
        border-bottom: 1px solid #e5e7eb;
        color: #111827;
        margin-bottom: 1rem;
    }

    body.theme-modern button {
        border-radius: 6px;
        font-weight: 500;
        transition: all 0.2s;
    }
    body.theme-modern button:hover {
        transform: translateY(-1px);
    }

    body.theme-modern input, body.theme-modern textarea, body.theme-modern select {
        border-radius: 6px;
        border: 1px solid #d1d5db;
        background-color: #fff;
    }
    
    body.theme-modern footer {
        color: #6b7280;
        border-top: 1px solid #e5e7eb;
        margin-top: 2rem;
    }
    
    body.theme-modern img {
        border-radius: 4px;
    }
    
    body.theme-modern .border-4,
    body.theme-modern .border-t-4,
    body.theme-modern .border-b-4 {
        border-width: 0 !important; 
    }
    
    body.theme-modern .border-t-4 {
        border-top-width: 1px !important;
        border-color: #e5e7eb !important;
    }
    
    body.theme-modern .modal-content {
        border: none;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
        border-radius: 8px;
    }

    /* Modern Tabs */
    body.theme-modern .tab-btn {
        border-bottom: 2px solid transparent;
        border-radius: 0;
        color: #6b7280;
    }
    body.theme-modern .tab-btn-active {
        border-bottom: 2px solid #2563EB;
        color: #2563EB;
    }
  `}</style>
);

export default ThemeStyles;
