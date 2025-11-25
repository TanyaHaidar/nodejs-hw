import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errors } from "celebrate";

import { connectMongoDB } from "./db/connectMongoDB.js";
import { logger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRouter from "./routes/authRoutes.js";
import notesRouter from "./routes/notesRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 3030;

app.use(logger);
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/notes", notesRouter);
app.use("/users", userRouter);

app.use(notFoundHandler);

app.use(errors());

app.use(errorHandler);

const start = async () => {
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`✅ Server started on port ${PORT}`);
  });
};

start();
