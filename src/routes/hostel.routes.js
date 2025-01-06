import { Router } from "express";
import upload from "../middlewares/imageUpload.middleware.js";
import { postHostelRoom, getAllHostelPostedBySeller, getSingleHostelPosted, getAllHostels, getSingleHostel, uploadPhotos} from "../controllers/hostel.controllers.js";
import { verifyUser } from "../middlewares/user.auth.middleware.js";
import { isSellerAuth } from "../middlewares/user.isSeller.middleware.js";

const router = Router();

router.route("/post-hostel").post(verifyUser, isSellerAuth, upload.array('photos', 5), postHostelRoom);

router.route("/get-all-posted-hostels").get(verifyUser, isSellerAuth, getAllHostelPostedBySeller);

router.route("/get-single-posted-hostel/:id").get(verifyUser, isSellerAuth, getSingleHostelPosted);

router.route("/get-all-hostels").get(verifyUser, getAllHostels);

router.route("/get-single-hostel/:id").get(verifyUser, getSingleHostel);

router.route('/:hostelId/photos').post(verifyUser, isSellerAuth, upload.array('photos', 5), uploadPhotos);


export default router;