import express, { Application, Router } from "express";
import { postController } from "./post.controller";

const router = express.Router();

router.post('/create', postController.createPost) 
router.get('/', postController.gatePost) 
router.delete('/:id', postController.deletedPost) 



export const  postRouter:Router = router