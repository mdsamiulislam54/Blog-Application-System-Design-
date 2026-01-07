import express, { Application, Router } from "express";
import { postController } from "./post.controller";
import { roleVerify, userRole } from "../../middleware/middleware";

const router = express.Router();

router.post('/create', roleVerify(userRole.ADMIN, userRole.USER), postController.createPost);
router.get('/my-posts', roleVerify(userRole.ADMIN, userRole.USER), postController.getMyPost)
router.get('/', postController.getPost)
router.get('/:id', postController.getPostById);

router.delete('/:id', postController.deletedPost);



export const postRouter: Router = router