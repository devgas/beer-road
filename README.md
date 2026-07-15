# 🍻 Beer Road Save

Discover, save, and plan your perfect brewery road trip.

## Features

- 🗺️ Interactive map of breweries worldwide
- 🍺 Browse and search breweries by city, state, or type
- ❤️ Save favorite breweries
- 🗓️ Plan brewery road trips with stops
- ⭐ Read and write reviews
- 🔐 User authentication

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + Leaflet
- **Backend:** Node.js + Express + SQLite
- **Maps:** React Leaflet + OpenStreetMap
- **Auth:** JWT + bcrypt

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/beer-road.git
cd beer-road

# Install dependencies for all packages
npm run install:all

# Start development servers (client + server)
npm run dev
```

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=3001
JWT_SECRET=your_jwt_secret_here
```

## Deployment

- **Frontend:** Deployed on Vercel
- **Backend:** Deploy the `server/` directory to your preferred Node.js hosting service

## License

MIT
