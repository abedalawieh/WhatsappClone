import express from "express";
import {
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/auth.controller.js";

import trimRequest from "trim-request";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();
router.route("/register").post(trimRequest.all, register);
router.route("/login").post(trimRequest.all, login);
router.route("/logout").post(trimRequest.all, logout);
router.route("/refreshtoken").post(trimRequest.all, refreshToken);
router
  .route("/refreshtokentest")
  .get(trimRequest.all, authMiddleware, async (req, res) => {
    res.send(req.user);
  });

export default router;
