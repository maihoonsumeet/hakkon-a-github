import React from 'react';

const ComicBookStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap');

    :root {
      --paper-color: #f0ede5; /* A less intense, off-white for paper */
      --ink-color: #2c2c2c; /* A darker charcoal for ink */
      --dot-color: #e0dccd; /* Adjusted dots for the new paper color */
    }

    .comic-book-style {
      background-color: var(--paper-color);
      background-image: radial-gradient(var(--dot-color) 1px, transparent 0);
      background-size: 10px 10px;
      color: var(--ink-color);
      font-family: 'Comic Neue', cursive;
      font-weight: 700;
    }

    .comic-book-style h1,
    .comic-book-style h2,
    .comic-book-style h3,
    .comic-book-style h4,
    .comic-book-style .font-bangers {
      font-family: 'Bangers', cursive;
      letter-spacing: 2px;
      color: var(--ink-color);
    }

    .comic-book-style * {
      border-radius: 0 !important;
      text-shadow: none !important;
      box-shadow: none !important;
      transition: none !important;
    }

    .comic-panel {
      background-color: var(--paper-color);
      border: 4px solid var(--ink-color);
      box-shadow: 8px 8px 0px var(--ink-color) !important;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .comic-book-style .bg-white,
    .comic-book-style .bg-gray-50,
    .comic-book-style .bg-gray-100 {
      background-color: var(--paper-color) !important;
      border: 4px solid var(--ink-color);
      box-shadow: 8px 8px 0px var(--ink-color) !important;
      padding: 1.5rem;
    }
    
    .comic-book-style .bg-gray-50,
    .comic-book-style .bg-gray-100 {
       border-width: 2px;
       box-shadow: 4px 4px 0px var(--ink-color) !important;
    }

    .comic-book-style header,
    .comic-book-style footer {
      background-color: var(--ink-color) !important;
      color: var(--paper-color) !important;
      border-bottom: 4px solid var(--ink-color);
      padding: 0.5rem 0 !important;
      position: static !important;
    }

    .comic-book-style header span,
    .comic-book-style header .font-bold {
      color: var(--paper-color) !important;
      font-family: 'Bangers', cursive;
    }

    .comic-book-style header button:hover {
        background: var(--paper-color) !important;
        color: var(--ink-color) !important;
    }
    .comic-book-style header button.bg-red-500:hover {
        background: var(--dot-color) !important;
    }
    .comic-book-style header button:hover svg {
        stroke: var(--ink-color) !important;
    }

    .comic-book-style footer p {
        color: var(--paper-color) !important;
        font-size: 1.1rem;
    }

    .comic-book-style button,
    .comic-book-style input,
    .comic-book-style textarea {
      border: 3px solid var(--ink-color);
      background: var(--paper-color);
      color: var(--ink-color);
      padding: 0.5rem 1rem;
      font-family: 'Comic Neue', cursive;
      font-weight: 700;
      text-transform: uppercase;
    }

    .comic-book-style button:hover,
    .comic-book-style button[type="submit"]:hover {
      background: var(--ink-color) !important;
      color: var(--paper-color) !important;
      cursor: pointer;
    }

    .comic-book-style button:hover svg {
        stroke: var(--paper-color);
    }

    .comic-book-style input:focus,
    .comic-book-style textarea:focus {
      outline: 3px solid var(--ink-color);
    }

    .comic-book-style .bg-blue-500,
    .comic-book-style .bg-green-500,
    .comic-book-style .bg-red-500 {
      background: var(--paper-color) !important;
      color: var(--ink-color) !important;
      border: 3px solid var(--ink-color);
    }
    .comic-book-style .bg-blue-500:hover,
    .comic-book-style .bg-green-500:hover,
    .comic-book-style .bg-red-500:hover {
      background: var(--ink-color) !important;
      color: var(--paper-color) !important;
    }
    
    .comic-book-style .text-blue-500 {
        color: var(--ink-color) !important;
        background: transparent !important;
        border: none;
        text-decoration: underline;
        padding: 0;
    }

    .comic-book-style img {
      border: 3px solid var(--ink-color);
    }

    .comic-book-style svg {
      stroke: var(--ink-color);
    }
    
    .comic-book-style header svg, .comic-book-style footer svg {
      stroke: var(--paper-color);
    }
    
    .comic-book-style button.bg-red-500 svg {
        stroke: var(--ink-color);
    }
     .comic-book-style button.bg-red-500:hover svg {
        stroke: var(--paper-color);
    }

    .comic-book-style path {
        fill: var(--ink-color) !important;
    }
    .comic-book-style .google-btn path {
        fill: #757575 !important; /* Grayscale Google colors */
    }

    .comic-book-style .border-t,
    .comic-book-style .border-b,
    .comic-book-style .border-2,
    .comic-book-style .border-t-4,
    .comic-book-style .border-b-4 {
      border-color: var(--ink-color) !important;
    }

    .comic-book-style .border-t { border-top-width: 3px !important; }
    .comic-book-style .border-b { border-bottom-width: 3px !important; }
    .comic-book-style .border-2 { border-width: 3px !important; }
    .comic-book-style .border-t-4 { border-top-width: 4px !important; }
    .comic-book-style .border-b-4 { border-bottom-width: 4px !important; }

    .comic-book-style .relative.my-4 .absolute {
        display: none;
    }
    .comic-book-style .relative.my-4 .relative span {
        background: var(--paper-color) !important;
        padding: 0 1rem;
    }

    .comic-book-style .bg-gray-200.rounded-full {
      background: var(--paper-color) !important;
      border: 2px solid var(--ink-color);
      height: 2.5rem !important;
      padding: 4px;
    }
    .comic-book-style .bg-green-500.h-4.rounded-full {
      background: var(--ink-color) !important;
      height: 100% !important;
    }
    
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: var(--paper-color);
      border: 4px solid var(--ink-color);
      box-shadow: 10px 10px 0px var(--ink-color) !important;
      padding: 2rem;
      text-align: center;
      max-width: 400px;
      width: 90%;
    }
    
    .modal-content h2 {
      font-family: 'Bangers', cursive;
      font-size: 2.5rem;
      margin-bottom: 1rem;
      letter-spacing: 2px;
    }
    
    .modal-content p {
      font-family: 'Comic Neue', cursive;
      font-weight: 700;
      margin-bottom: 2rem;
    }
  `}</style>
);

export default ComicBookStyles;
