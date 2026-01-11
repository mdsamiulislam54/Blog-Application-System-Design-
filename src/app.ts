import express, { Application } from "express";
import dotenv from 'dotenv'
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";
import cors from 'cors'
import { commentRouter } from "./modules/comments/comment.router";
import { errorHandler } from "./middleware/errorHandlingGlobal";
import { notFound } from "./middleware/notFound";
dotenv.config();
const app:Application = express();
app.use(express.json())


app.use(cors({
    origin:process.env.BETTER_AUTH_URL || "http://localhost:5000",
    credentials: true
}))

app.use('/post', postRouter);
app.use('/comments', commentRouter);
app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(notFound);
app.use(errorHandler);

export default app;