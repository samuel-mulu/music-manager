import { Router } from "express";
import {
  createSong,
  getSongs,
  getSongById,
  updateSong,
  deleteSong,
} from "../controllers/song.controller.js";
import { getSongStats, getRecentSongs } from "../controllers/song.stats.js";

const router = Router();

router.post("/", createSong);
router.get("/", getSongs);
router.get("/stats", getSongStats);
router.get("/stats/recent", getRecentSongs);
router.get("/:id", getSongById);
router.put("/:id", updateSong);
router.delete("/:id", deleteSong);

export default router;
