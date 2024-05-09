import Authenticated from "../middleware/Authenticated.js";
import express from "express";
const router = express.Router();
import { searchAll, getSearchKomikDetail } from "../controllers/searchAll.js";
router.get("/search", Authenticated, searchAll);
router.get("/details/:details_id", Authenticated, getSearchKomikDetail);

export default router;
