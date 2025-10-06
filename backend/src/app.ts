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
      "https://addis-software-frontend.onrender.com", // Update with your frontend URL
    ];

    if (allowedOrigins.includes(origin)) {
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
