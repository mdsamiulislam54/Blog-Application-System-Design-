import express, { Application, Router } from "express";
import { postController } from "./post.controller";
import { roleVerify, userRole } from "../../middleware/middleware";

const router = express.Router();

router.post('/create', roleVerify(userRole.ADMIN, userRole.USER), postController.createPost) 
router.get('/', roleVerify(userRole.ADMIN, userRole.USER ), postController.gatePost) 
router.delete('/:id', postController.deletedPost) 



export const  postRouter:Router = router