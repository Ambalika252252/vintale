# Vintale — Frontend Development Assignment

This repository contains the frontend implementation of the provided Figma design and prototype as part of a frontend development assignment. The goal was to build a pixel‑perfect, responsive UI and reproduce the scroll interactions using GSAP, closely following the prototype.

## Design References

- Design: [Figma (Design)](https://www.figma.com/design/KwQnZFdNRF3DaRmAVJzBsx/Dev-Assignment?node-id=1-7)
- Prototype: [Figma (Prototype)](https://www.figma.com/proto/KwQnZFdNRF3DaRmAVJzBsx/Dev-Assignment?node-id=1-50)

## Tech Stack

- Framework: **Next.js** (App Router)
- Styling: **Tailwind CSS**
- Animations: **GSAP** (ScrollTrigger)
- Deployment: **Vercel**

## Features

- Pixel‑perfect UI aligned with the Figma design
- Fully responsive layout across desktop, tablet, and mobile devices
- Scroll‑based animations implemented with GSAP (ScrollTrigger)
- Clean, reusable component structure
- Optimized image handling using `next/image`
- Smooth scroll interactions and transitions

## Animation & Interaction Details

- GSAP ScrollTrigger powers scroll‑based animations and pinning behavior.
- The hero visuals (bottle and background elements) are pinned while the text scrolls naturally.
- Animations are synchronized to scroll using `scrub` for smooth, frame‑accurate transitions.
- Transform/opacity‑based effects are used for performance.
- Desktop‑specific effects are applied where appropriate; simplified behavior is used on smaller devices.

## Responsive Behavior

- Desktop layout mirrors the prototype closely.
- On mobile/tablet, animations are tuned for usability and performance.
- Layout and animations were tested across common breakpoints.

## Project Setup

### Prerequisites

- Node.js **v18+** (recommended)

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd <project-folder>
npm install
```

### Run Locally

```bash
npm run dev
```

The app will be available at:

```
http://localhost:3000
```

## Deployment

The project is deployed on **Vercel**.

Live URL:

```

```

## Notes & Assumptions

- Animations were implemented to closely match the prototype; minor differences may occur due to browser scroll physics.
- Some animation values were tuned pragmatically for smooth performance and layout stability.
- This repository focuses on frontend implementation only; there is no backend/API integration.

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Lint the project (if configured)
```

## Assignment Checklist

- [x] Next.js used as the framework
- [x] Tailwind CSS used for styling
- [x] GSAP used for animations
- [x] Pixel‑perfect UI implementation
- [x] Fully responsive across devices
- [x] Clean and maintainable code structure
- [x] Deployed on Vercel
- [x] Clear setup and run instructions provided
