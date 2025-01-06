import {Router} from "express";
import { postReviews, getAllReviewsForHostel, getAverageRating } from "../controllers/reviews.controllers.js";
import { isBuyerAuth } from "../middlewares/user.isBuyer.middleware.js";
import { verifyUser } from "../middlewares/user.auth.middleware.js";

const router = Router();

router.route("/post-reviews/:id").post(verifyUser, isBuyerAuth, postReviews);

router.route("/get-all-reviews/:id").get(verifyUser, getAllReviewsForHostel);

router.route("/get-average-rating/:id").get(verifyUser, getAverageRating);


export default router;