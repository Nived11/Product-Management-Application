import { Router } from "express";
import * as RH from "./RequestHandler/user.rh.js";
import Auth from "./middleware/Auth.js";

const router = Router();

router.route("/register").post(RH.registerUser);
router.route("/login").post(RH.loginUser);
router.route("/home").get(Auth, RH.Home);

export default router;