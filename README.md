# Music Manager

A full-stack music management application built with React, Node.js, Express, MongoDB, and Socket.IO for real-time updates.

## Features

- 🎵 **Song Management**: Add, edit, delete, and view songs
- 📊 **Statistics Dashboard**: Real-time analytics and insights
- 🔄 **Real-time Updates**: Live updates using Socket.IO
- 🎨 **Modern UI**: Clean and responsive design
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend

- React 18 with TypeScript
- Redux Toolkit with Redux Saga
- Socket.IO Client
- Custom UI Components
- Vercel Deployment

### Backend

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Socket.IO Server
- Docker Support
- Render Deployment

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/music-manager.git
   cd music-manager
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**

   Create environment files:

   **Backend** (`backend/.env`):

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/music-manager
   FRONTEND_URL=http://localhost:3000
   ```

   **Frontend** (`frontend/.env`):

   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

4. **Start the application**

   **Development mode:**

   ```bash
   # Start backend (from backend directory)
   cd backend
   npm run dev

   # Start frontend (from frontend directory)
   cd frontend
   npm start
   ```

   **Using Docker:**

   ```bash
   # From backend directory
   cd backend
   docker-compose up
   ```

## Project Structure

```
music-manager/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Custom middlewares
│   │   ├── model/          # Database models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── docker-compose.yml  # Docker configuration
│   ├── Dockerfile          # Docker image
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── features/       # Feature-based modules
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   └── types/          # TypeScript types
│   └── package.json
└── README.md
```

## API Endpoints

### Songs

- `GET /api/songs` - Get all songs (with pagination, filtering, sorting)
- `POST /api/songs` - Create a new song
- `GET /api/songs/:id` - Get song by ID
- `PUT /api/songs/:id` - Update song
- `DELETE /api/songs/:id` - Delete song

### Statistics

- `GET /api/stats` - Get music statistics
- `GET /api/stats/recent` - Get recent songs

## Socket.IO Events

### Client → Server

- `join-songs-room` - Join songs room for real-time updates

### Server → Client

- `song-created` - New song created
- `song-updated` - Song updated
- `song-deleted` - Song deleted

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render)

1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy automatically on push to main branch

### Docker

```bash
# Build and run with Docker Compose
cd backend
docker-compose up --build
```

## Development

### Available Scripts

**Backend:**

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests

**Frontend:**

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Code Style

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React team for the amazing framework
- Redux team for state management
- Socket.IO for real-time communication
- MongoDB for the database
- All contributors and users
