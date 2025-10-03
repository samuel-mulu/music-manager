import type { Request, Response, NextFunction } from "express";
import Song from "../model/song.model.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

// 📊 GET /api/v1/songs/stats
export const getSongStats = catchAsync(async (req: Request, res: Response) => {
  // 1️⃣ Total counts
  const totalSongs = await Song.countDocuments();
  const artists = await Song.distinct("artist");
  const genres = await Song.distinct("genre");

  const totalArtists = artists.length;
  const totalGenres = genres.length;

  // Count songs by type
  const singleSongs = await Song.countDocuments({ songType: "single" });
  const albumSongs = await Song.countDocuments({ songType: "album" });

  // 2️⃣ Songs per genre
  const songsPerGenre = await Song.aggregate([
    { $group: { _id: "$genre", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // 3️⃣ Songs per artist
  const songsPerArtist = await Song.aggregate([
    {
      $group: {
        _id: "$artist",
        songCount: { $sum: 1 },
        singleCount: {
          $sum: { $cond: [{ $eq: ["$songType", "single"] }, 1, 0] },
        },
        albumCount: {
          $sum: { $cond: [{ $eq: ["$songType", "album"] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        artist: "$_id",
        songCount: 1,
        singleCount: 1,
        albumCount: 1,
      },
    },
    { $sort: { songCount: -1 } },
  ]);

  // 4️⃣ Songs per type
  const songsPerType = await Song.aggregate([
    { $group: { _id: "$songType", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      totals: {
        songs: totalSongs,
        artists: totalArtists,
        genres: totalGenres,
        singleSongs,
        albumSongs,
      },
      songsPerGenre,
      songsPerArtist,
      songsPerType,
    },
  });
});

// 📊 GET /api/v1/songs/stats/recent - Get 5 most recent songs
export const getRecentSongs = catchAsync(
  async (req: Request, res: Response) => {
    const recentSongs = await Song.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-__v");

    res.status(200).json({
      success: true,
      count: recentSongs.length,
      data: recentSongs,
    });
  }
);
