import express from "express";
import cors from "cors";
import morgan from "morgan";
import songRoutes from "./routes/song.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import AppError from "./utils/AppError.js";

const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
      "http://localhost:3001",
      "https://music-manager-1.onrender.com",
      // Vercel domains (wildcard for flexibility)
      /^https:\/\/.*\.vercel\.app$/,
      /^https:\/\/.*\.vercel\.com$/,
    ];

    // Check if origin matches any allowed origin (string or regex)
    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      if (typeof allowedOrigin === "string") {
        return allowedOrigin === origin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.use(express.json());
// Logging middleware
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

// Root endpoint - API Documentation
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🎵 Music Manager API - Welcome!",
    version: "1.0.0",
    description:
      "A full-stack MERN application for managing your music collection",
    documentation: {
      baseUrl: `${req.protocol}://${req.get("host")}`,
      endpoints: {
        songs: {
          "GET /api/v1/songs": {
            description: "Get all songs with pagination, filtering & search",
            queryParams: {
              page: "Page number (default: 1)",
              limit: "Items per page (default: 10)",
              search: "Search term",
              searchType: "Search in: title, artist, album, genre",
              sort: "Sort by: title, artist, genre, -createdAt",
              genre: "Filter by genre",
              songType: "Filter by type: single, album",
              album: "Filter by album name",
            },
            example: "/api/v1/songs?page=1&limit=10&genre=Rock&sort=title",
          },
          "POST /api/v1/songs": {
            description: "Create a new song",
            body: {
              title: "Song title (required)",
              artist: "Artist name (required)",
              genre: "Music genre (required)",
              songType: "Type: 'single' or 'album' (default: 'single')",
              album: "Album name (required if songType is 'album')",
            },
            example: {
              title: "Bohemian Rhapsody",
              artist: "Queen",
              songType: "album",
              genre: "Rock",
              album: "A Night at the Opera",
            },
          },
          "GET /api/v1/songs/:id": {
            description: "Get a single song by ID",
            example: "/api/v1/songs/507f1f77bcf86cd799439011",
          },
          "PUT /api/v1/songs/:id": {
            description: "Update a song by ID",
            body: "Same as POST, all fields optional",
          },
          "DELETE /api/v1/songs/:id": {
            description: "Delete a song by ID",
          },
        },
        statistics: {
          "GET /api/v1/songs/stats": {
            description: "Get comprehensive statistics",
            returns: {
              totals: "Total songs, artists, genres, albums",
              distribution: "Songs per genre, artist, type",
              insights: "Top performers, averages, recent activity",
            },
          },
          "GET /api/v1/songs/stats/recent": {
            description: "Get 5 most recent songs",
          },
        },
        health: {
          "GET /health": "API health check",
          "GET /api/v1/health": "API health check (v1)",
        },
      },
      features: [
        "✅ Full CRUD operations for songs",
        "✅ Advanced search & filtering",
        "✅ Pagination support",
        "✅ Comprehensive statistics",
        "✅ Real-time updates via Socket.IO",
        "✅ RESTful API design",
      ],
      quickStart: {
        "1. Get All Songs": "GET /api/v1/songs",
        "2. Create a Song": "POST /api/v1/songs (with JSON body)",
        "3. Get Statistics": "GET /api/v1/songs/stats",
        "4. Search Songs": "GET /api/v1/songs?search=love&searchType=title",
      },
      socketIO: {
        events: {
          "join-songs-room": "Join for real-time song updates",
          "song-created": "Emitted when a new song is created",
          "song-updated": "Emitted when a song is updated",
          "song-deleted": "Emitted when a song is deleted",
        },
      },
    },
    links: {
      frontend: "https://your-app.vercel.app",
      github: "https://github.com/yourusername/music-manager",
      documentation: "/",
      health: "/health",
      songs: "/api/v1/songs",
      stats: "/api/v1/songs/stats",
    },
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

// Health Check endpoints
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "API is running 🚀",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok", message: "API is running 🚀" });
});

// API Routes
app.use("/api/v1/songs", songRoutes);

// Handle unknown routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

export default app;
