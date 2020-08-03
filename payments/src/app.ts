import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@parkerco/common";

import { createChargeRouter } from "../src/routes/new";

const app = express();

app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    // Only displays cookie to HTTPS requests
    secure: false, //process.env.NODE_ENV !== "test",
  })
);

// Middleware that checks cookies for a JWT, and will attempt to verify if present
// It will simply pass on the request if no JWT is found and if verification fails
// If none found/fails then we will use requireAuth from @parckerco/common to restrict access to the route
app.use(currentUser);

app.use(createChargeRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
