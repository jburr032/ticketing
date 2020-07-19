import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/api/v1/users/currentuser", (req, res) => {
  // Equivalent to (req.session || req.session.jwt)
  if (!req.session!.jwt) {
    return res.send({ currentUser: null });
  }

  try {
    const payload = jwt.verify(req.session!.jwt, process.env.JWT_KEY!);
    res.send({ currentUser: payload });
  } catch (err) {
    res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };
