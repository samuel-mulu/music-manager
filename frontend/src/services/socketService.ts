import { io, Socket } from "socket.io-client";
import { API_URL } from "../config/env";

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  // Initialize socket connection
  connect(): Socket {
    if (!this.socket) {
      this.socket = io(API_URL, {
        transports: ["websocket", "polling"],
        timeout: 20000,
        forceNew: true,
      });

      // Connection event handlers
      this.socket.on("connect", () => {
        console.log("🔌 Socket.IO connected:", this.socket?.id);
        this.isConnected = true;
      });

      this.socket.on("disconnect", (reason) => {
        console.log("🔌 Socket.IO disconnected:", reason);
        this.isConnected = false;
      });

      this.socket.on("connect_error", (error) => {
        console.error("🔌 Socket.IO connection error:", error);
        this.isConnected = false;
      });
    }

    return this.socket;
  }

  // Disconnect socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Get socket instance
  getSocket(): Socket | null {
    return this.socket;
  }

  // Check if connected
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Join songs room
  joinSongsRoom(): void {
    if (this.socket) {
      this.socket.emit("join-songs-room");
      console.log("👤 Joined songs room");
    }
  }

  // Leave songs room
  leaveSongsRoom(): void {
    if (this.socket) {
      this.socket.emit("leave-songs-room");
      console.log("👋 Left songs room");
    }
  }

  // Listen for song events
  onSongCreated(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on("song-created", callback);
    }
  }

  onSongUpdated(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on("song-updated", callback);
    }
  }

  onSongDeleted(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on("song-deleted", callback);
    }
  }

  // Remove event listeners
  offSongCreated(callback?: (data: any) => void): void {
    if (this.socket) {
      this.socket.off("song-created", callback);
    }
  }

  offSongUpdated(callback?: (data: any) => void): void {
    if (this.socket) {
      this.socket.off("song-updated", callback);
    }
  }

  offSongDeleted(callback?: (data: any) => void): void {
    if (this.socket) {
      this.socket.off("song-deleted", callback);
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
