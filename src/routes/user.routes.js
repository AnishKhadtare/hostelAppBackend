import { Router } from "express";
import { registerUser, loginUser, logoutUser, changeCurrentPassword, getCurrentUser} from "../controllers/user.controllers.js";
import { verifyUser } from "../middlewares/user.auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyUser, logoutUser);

router.route("/change-password").post(verifyUser, changeCurrentPassword);

router.route("/get-current-user").get(verifyUser, getCurrentUser);

export default router;