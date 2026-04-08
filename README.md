# Interactive Calendar Component

A responsive wall-style interactive calendar component built with React, TypeScript, and Vite.

## Features

- Day range selection
- Notes attached to selected date ranges
- Responsive layout for desktop and mobile
- Smooth UI interactions and animations
- Clean calendar interface

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- date-fns
- Zustand

## Run Locally

### Clone the repository
```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME

Install dependencies
npm install

Start Development server
npm run dev

Build for protection
npm run build

Preview Production Build
npm run preview

Project Structure
src/
 ├── components/     # UI components (calendar, notes panel, etc.)
 ├── store/          # Zustand state management
 ├── utils/          # helper functions (date handling)
 ├── App.tsx         # main app layout
 └── main.tsx        # entry point

How It Works- 

Date Range Selection
First click → selects start date
Second click → selects end date
Range is highlighted visually across the calendar
Hover interaction previews the range before final selection
Notes System
Notes can be attached to a selected date range
Stored in global state using Zustand
Each note includes:
text
start date
end date
color tag
State Management
Zustand is used for lightweight global state
Handles:
selected dates
hover state
notes
current month navigation
Styling & Animations
Tailwind CSS for layout and styling
Framer Motion for transitions and UI polish
Responsiveness
Desktop: full calendar grid with side panel
Mobile: stacked layout with optimized spacing
Touch-friendly interactions supported
Keyboard Support
Esc → clears current date selection

Deployment

The project can be deployed easily on:

Vercel
Netlify
GitHub Pages
Demo
Live Demo: https://YOUR-DEPLOYED-LINK
Video Walkthrough: https://YOUR-VIDEO-LINK
Author

Parkhi Agarwal
GitHub: https://github.com/parkhiag




