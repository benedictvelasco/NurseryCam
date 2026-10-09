# NurseryCam

NurseryCam is a React dashboard preview for a privacy-focused baby monitor. It presents a local live-feed interface, safety checks, sleep activity, and room alarm controls.

## Features

- Live nursery camera dashboard
- Local safety checks for posture, crib environment, and airway status
- Sleep log and all-time sleep pattern summaries
- Local alarm mute control
- Responsive layout for desktop and mobile screens

## Requirements

- Node.js 18 or later
- npm

## Getting started

Clone the repository and install its dependencies:

```bash
git clone https://github.com/benedictvelasco/NurseryCam.git
cd NurseryCam
npm install
```

Start the development server:

```bash
npm run dev
```

Then open the local URL shown by Vite, usually `http://127.0.0.1:5173/`.

## Production build

Create an optimized production build:

```bash
npm run build
```

The generated files are written to the `dist/` directory.

## Project structure

```text
.
├── index.html
├── main.jsx
├── NurseryCamDashboard.jsx
├── package.json
└── vite.config.js
```

## Technology

- React
- Vite
- lucide-react
- Tailwind CSS via the CDN script included in `index.html`

## Disclaimer

This repository is a UI preview and does not connect to a real camera, perform medical monitoring, or replace caregiver supervision or professional medical advice.
