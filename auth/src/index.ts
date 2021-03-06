import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
  console.log("Starting up....");
  if (!process.env.JWT_KEY) {
    throw new Error(
      "JWT needs to be defined. Check the variable is set in Kubernetes."
    );
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI needs to be set");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to Mongo DB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => console.log("Listening on port 3000!"));
};

start();
