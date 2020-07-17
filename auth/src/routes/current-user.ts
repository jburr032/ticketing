import express from "express";

const router = express.Router();

router.get("/api/v1/users/currentuser", (req, res) => {
  res.send("Hi there User_1!");
});

export { router as currentUserRouter };
