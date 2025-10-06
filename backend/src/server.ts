import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/addis_songs";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // Create HTTP server
    const httpServer = createServer(app);

    // Initialize Socket.IO
    const io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    // Make io available to the app
    app.set("io", io);

    // Socket.IO connection handling
    io.on("connection", (socket: any) => {
      console.log(`🔌 User connected: ${socket.id}`);

      // Join songs room for real-time updates
      socket.on("join-songs-room", () => {
        socket.join("songs");
        console.log(`👤 User ${socket.id} joined songs room`);
      });

      // Leave songs room
      socket.on("leave-songs-room", () => {
        socket.leave("songs");
        console.log(`👋 User ${socket.id} left songs room`);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`🔌 User disconnected: ${socket.id}`);
      });
    });

    // Start server
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔌 Socket.IO ready for real-time connections`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("🛑 SIGTERM received. Shutting down gracefully...");
      httpServer.close(() => {
        console.log("✅ Process terminated");
        mongoose.connection
          .close()
          .then(() => {
            console.log("✅ MongoDB connection closed");
            process.exit(0);
          })
          .catch((err) => {
            console.error("❌ Error closing MongoDB connection:", err);
            process.exit(0);
          });
      });
    });
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  });
