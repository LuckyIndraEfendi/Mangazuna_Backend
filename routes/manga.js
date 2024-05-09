import Authenticated from "../middleware/Authenticated.js";
import express from "express";
const router = express.Router();
import {
  getAllManga,
  getMangaDetails,
  getMangaChapter,
  getPopularManga,
} from "../controllers/manga.js";
router.get("/manga", Authenticated, getAllManga);
router.get("/manga/popular", Authenticated, getPopularManga);
router.get("/details/:details_id", Authenticated, getMangaDetails);
router.get("/chapter/:chapter_id", Authenticated, getMangaChapter);
export default router;
