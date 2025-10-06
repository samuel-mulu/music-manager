import mongoose, { Schema, Document } from "mongoose";

export interface ISong extends Document {
  title: string;
  artist: string;
  songType: "single" | "album";
  genre: string;
  album?: string; // Optional album name for album type songs
  createdAt: Date;
  updatedAt: Date;
}

const SongSchema: Schema = new Schema<ISong>(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    songType: {
      type: String,
      enum: ["single", "album"],
      default: "single",
      required: true,
    },
    genre: { type: String, required: true, trim: true },
    album: { type: String, trim: true }, // Optional album name
  },
  { timestamps: true }
);

export default mongoose.model<ISong>("Song", SongSchema);
