import express from "express";
import cors from "cors";
import morgan from "morgan";
import songRoutes from "./routes/song.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import AppError from "./utils/AppError.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health Check
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
