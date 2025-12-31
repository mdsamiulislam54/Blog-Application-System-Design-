import express, { Application } from "express";
import { postRouter } from "./modules/post/post.router";


const app:Application = express();
app.use(express.json())

app.use('/post', postRouter)

export default app;