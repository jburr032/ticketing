import express from "express";
import { currentUser } from "@parkerco/common";

const router = express.Router();

router.get("/api/v1/users/currentuser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
