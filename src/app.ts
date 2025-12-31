import express, { Application } from "express";
import dotenv from 'dotenv'
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";
import cors from 'cors'
dotenv.config();
const app:Application = express();
app.use(express.json())

app.use(cors({
    origin:process.env.BETTER_AUTH_URL || "http://localhost:5000",
    credentials: true
}))

app.use('/post', postRouter)
app.all('/api/auth/*splat', toNodeHandler(auth));

export default app;