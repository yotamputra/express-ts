import express from "express";
import { publicRouter } from "../route/public-api";
import { errorHandler } from "../middleware/errorHandler";

export const app = express();

app.use(express.json());

app.use(publicRouter);

app.use(errorHandler);
