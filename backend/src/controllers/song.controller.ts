import type { Request, Response, NextFunction } from "express";
import Song from "../model/song.model.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import {
  buildSearchFilter,
  validateQueryParams,
} from "../utils/searchUtils.js";

// Create a new song
export const createSong = catchAsync(async (req: Request, res: Response) => {
  const { title, artist, songType, genre, album } = req.body;
  if (!title || !artist || !genre) {
    throw new AppError("Title, artist, and genre are required", 400);
  }

  // Validate album name for album type songs
  if (songType === "album" && (!album || album.trim() === "")) {
    throw new AppError("Album name is required when song type is 'album'", 400);
  }

  // Check if song title already exists
  const existingSong = await Song.findOne({
    title: { $regex: new RegExp(`^${title}$`, "i") },
  });
  if (existingSong) {
    throw new AppError("A song with this title already exists", 409);
  }

  const song = await Song.create({ title, artist, songType, genre, album });

  // Emit real-time event for new song
  const io = req.app.get("io");
  if (io) {
    io.to("songs").emit("song-created", {
      type: "created",
      song,
      timestamp: new Date().toISOString(),
    });
  }

  res.status(201).json({ success: true, data: song });
});

// Get all songs with advanced query features
export const getSongs = catchAsync(async (req: Request, res: Response) => {
  // Validate query parameters
  try {
    validateQueryParams(req);
  } catch (error: any) {
    throw new AppError(error.message, 400);
  }

  // Build search filter
  const searchFilter = buildSearchFilter(req);

  // Get query parameters
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const sort = (req.query.sort as string) || "-createdAt";
  const fields = req.query.fields as string;

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Build query
  let query = Song.find(searchFilter);

  // Apply sorting
  const sortBy = sort.split(",").join(" ");
  query = query.sort(sortBy);

  // Apply field selection
  if (fields) {
    const selectedFields = fields.split(",").join(" ");
    query = query.select(selectedFields);
  } else {
    query = query.select("-__v"); // Exclude version field by default
  }

  // Apply pagination
  query = query.skip(skip).limit(limit);

  // Execute query
  const songs = await query;

  // Get total count for pagination info
  const total = await Song.countDocuments(searchFilter);
  const totalPages = Math.ceil(total / limit);

  // Send response
  res.json({
    success: true,
    count: songs.length,
    total,
    pagination: {
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    data: songs,
  });
});

// Get one song
export const getSongById = catchAsync(async (req: Request, res: Response) => {
  const song = await Song.findById(req.params.id);
  if (!song) throw new AppError("Song not found", 404);
  res.json({ success: true, data: song });
});

// Update song
export const updateSong = catchAsync(async (req: Request, res: Response) => {
  const { title, songType, album } = req.body;

  // Validate songType if provided
  if (songType && !["single", "album"].includes(songType)) {
    throw new AppError("songType must be either 'single' or 'album'", 400);
  }

  // Validate album name for album type songs
  if (songType === "album" && (!album || album.trim() === "")) {
    throw new AppError("Album name is required when song type is 'album'", 400);
  }

  // If title is being updated, check for duplicates
  if (title) {
    const existingSong = await Song.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
      _id: { $ne: req.params.id }, // Exclude current song from check
    });
    if (existingSong) {
      throw new AppError("A song with this title already exists", 409);
    }
  }

  const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!song) throw new AppError("Song not found", 404);

  // Emit real-time event for updated song
  const io = req.app.get("io");
  if (io) {
    io.to("songs").emit("song-updated", {
      type: "updated",
      song,
      timestamp: new Date().toISOString(),
    });
  }

  res.json({ success: true, data: song });
});

// Delete song
export const deleteSong = catchAsync(async (req: Request, res: Response) => {
  const song = await Song.findByIdAndDelete(req.params.id);
  if (!song) throw new AppError("Song not found", 404);

  // Emit real-time event for deleted song
  const io = req.app.get("io");
  if (io) {
    io.to("songs").emit("song-deleted", {
      type: "deleted",
      songId: req.params.id,
      song,
      timestamp: new Date().toISOString(),
    });
  }

  res.json({ success: true, message: "Song deleted" });
});
