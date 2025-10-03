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

  // 2️⃣ Songs per genre with detailed breakdown
  const songsPerGenre = await Song.aggregate([
    {
      $group: {
        _id: "$genre",
        totalCount: { $sum: 1 },
        singleCount: {
          $sum: { $cond: [{ $eq: ["$songType", "single"] }, 1, 0] },
        },
        albumCount: {
          $sum: { $cond: [{ $eq: ["$songType", "album"] }, 1, 0] },
        },
        artists: { $addToSet: "$artist" },
      },
    },
    {
      $project: {
        genre: "$_id",
        totalCount: 1,
        singleCount: 1,
        albumCount: 1,
        uniqueArtists: { $size: "$artists" },
      },
    },
    { $sort: { totalCount: -1 } },
  ]);

  // 3️⃣ Songs per artist with detailed breakdown
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
        genres: { $addToSet: "$genre" },
        songs: {
          $push: { title: "$title", type: "$songType", genre: "$genre" },
        },
      },
    },
    {
      $project: {
        artist: "$_id",
        songCount: 1,
        singleCount: 1,
        albumCount: 1,
        uniqueGenres: { $size: "$genres" },
        songs: 1,
      },
    },
    { $sort: { songCount: -1 } },
  ]);

  // 4️⃣ Songs per type with genre breakdown
  const songsPerType = await Song.aggregate([
    {
      $group: {
        _id: "$songType",
        count: { $sum: 1 },
        genres: { $addToSet: "$genre" },
        artists: { $addToSet: "$artist" },
      },
    },
    {
      $project: {
        type: "$_id",
        count: 1,
        uniqueGenres: { $size: "$genres" },
        uniqueArtists: { $size: "$artists" },
      },
    },
    { $sort: { count: -1 } },
  ]);

  // 5️⃣ Genre distribution with percentages
  const genreDistribution = songsPerGenre.map((genre) => ({
    ...genre,
    percentage:
      totalSongs > 0 ? Math.round((genre.totalCount / totalSongs) * 100) : 0,
  }));

  // 6️⃣ Artist distribution with percentages
  const artistDistribution = songsPerArtist.map((artist) => ({
    ...artist,
    percentage:
      totalSongs > 0 ? Math.round((artist.songCount / totalSongs) * 100) : 0,
  }));

  // 7️⃣ Recent activity (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentActivity = await Song.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } },
    { $limit: 30 },
  ]);

  // 8️⃣ Top performing metrics
  const topGenre = songsPerGenre[0] || { genre: "N/A", totalCount: 0 };
  const topArtist = songsPerArtist[0] || { artist: "N/A", songCount: 0 };
  const averageSongsPerArtist =
    totalArtists > 0 ? Math.round(totalSongs / totalArtists) : 0;
  const averageSongsPerGenre =
    totalGenres > 0 ? Math.round(totalSongs / totalGenres) : 0;

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
      distribution: {
        songsPerGenre: genreDistribution,
        songsPerArtist: artistDistribution,
        songsPerType,
      },
      insights: {
        topGenre,
        topArtist,
        averageSongsPerArtist,
        averageSongsPerGenre,
        recentActivity,
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        dataRange: {
          from: await Song.findOne().sort({ createdAt: 1 }).select("createdAt"),
          to: await Song.findOne().sort({ createdAt: -1 }).select("createdAt"),
        },
      },
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
