import type { Request } from "express";

export interface SearchOptions {
  title?: string;
  artist?: string;
  songType?: string;
  genre?: string;
  album?: string;
  search?: string;
  searchType?: string;
}

export const buildSearchFilter = (req: Request) => {
  const { title, artist, songType, genre, album, search, searchType } =
    req.query;
  let filter: any = {};

  // Exact field matching
  if (title) filter.title = { $regex: title as string, $options: "i" };
  if (artist) filter.artist = { $regex: artist as string, $options: "i" };
  if (songType) filter.songType = songType as string;
  if (genre) filter.genre = { $regex: genre as string, $options: "i" };
  if (album) filter.album = { $regex: album as string, $options: "i" };

  // Search with specific field targeting - always search by specific field
  if (search) {
    const searchTerm = search as string;
    const type = searchType as string;

    // Always search in the specific field selected
    switch (type) {
      case "title":
        filter.title = { $regex: searchTerm, $options: "i" };
        break;
      case "artist":
        filter.artist = { $regex: searchTerm, $options: "i" };
        break;
      case "album":
        filter.album = { $regex: searchTerm, $options: "i" };
        break;
      case "genre":
        filter.genre = { $regex: searchTerm, $options: "i" };
        break;
      default:
        // Default to title search if no type specified
        filter.title = { $regex: searchTerm, $options: "i" };
    }
  }

  return filter;
};

export const validateQueryParams = (req: Request) => {
  const { page, limit, sort } = req.query;

  // Validate page
  if (page && (isNaN(Number(page)) || Number(page) < 1)) {
    throw new Error("Page must be a positive number");
  }

  // Validate limit
  if (
    limit &&
    (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)
  ) {
    throw new Error("Limit must be between 1 and 100");
  }

  // Validate sort fields
  const allowedSortFields = [
    "title",
    "artist",
    "songType",
    "genre",
    "album",
    "createdAt",
    "-title",
    "-artist",
    "-songType",
    "-genre",
    "-album",
    "-createdAt",
  ];
  if (sort && !allowedSortFields.includes(sort as string)) {
    throw new Error(
      `Invalid sort field. Allowed: ${allowedSortFields.join(", ")}`
    );
  }
};
