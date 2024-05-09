import Authenticated from "../middleware/Authenticated.js";
import express from "express";
const router = express.Router();
import {
  getAllManhua,
  getManhuaDetails,
  getManhuaChapter,
} from "../controllers/manhua.js";

router.get("/manhua", Authenticated, getAllManhua);
router.get("/details/:details_id", Authenticated, getManhuaDetails);
router.get("/chapter/:chapter_id", Authenticated, getManhuaChapter);
export default router;
