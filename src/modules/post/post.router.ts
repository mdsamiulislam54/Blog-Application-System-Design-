import express, { Application, Router } from "express";
import { postController } from "./post.controller";
import { roleVerify, userRole } from "../../middleware/middleware";

const router = express.Router();

router.post('/create', roleVerify(userRole.ADMIN, userRole.USER), postController.createPost) 
router.get('/', postController.gatePost) 
router.delete('/:id', postController.deletedPost) 
router.get('/:id', postController.getPostById) 



export const  postRouter:Router = router