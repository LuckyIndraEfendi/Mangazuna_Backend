import Authenticated from "../middleware/Authenticated.js";
import express from "express";
const router = express.Router();
import {
  getAllManhwa,
  getmanhwaDetails,
  getManhwaChapter,
} from "../controllers/manhwa.js";
router.get("/manhwa", Authenticated, getAllManhwa);
router.get("/details/:details_id", Authenticated, getmanhwaDetails);
router.get("/chapter/:chapter_id", Authenticated, getManhwaChapter);
export default router;
