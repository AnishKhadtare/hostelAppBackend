import { Router } from "express";
import { verifyUser } from "../middlewares/user.auth.middleware.js";
import { createBookmark, getUserBookmarks } from "../controllers/bookmark.controller.js";

const router = Router();

router.route("/create-bookmark/:id").post(verifyUser, createBookmark);

router.route("/get-bookmark").get(verifyUser, getUserBookmarks);

export default router;