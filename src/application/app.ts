import express from "express";
import { publicRouter } from "../route/public-api";
import { errorHandler } from "../middleware/errorHandler";
import { apiRouter } from "../route/api";

export const app = express();

app.use(express.json());

app.use(publicRouter);
app.use(apiRouter);

app.use(errorHandler);
