import express, { Application, Router } from "express";
import { postController } from "./post.controller";
import { roleVerify, userRole } from "../../middleware/middleware";

const router = express.Router();

router.post('/create', roleVerify(userRole.ADMIN, userRole.USER), postController.createPost);
router.get('/my-posts', roleVerify(userRole.ADMIN, userRole.USER), postController.getMyPost);
router.get('/statis', postController.statistices);

router.get('/', postController.getPost);
router.get('/get-post/:id', postController.getPostById);

router.delete('/:id', roleVerify(userRole.ADMIN, userRole.USER), postController.deletedPost);

router.patch('/update-own-post/:id', roleVerify(userRole.ADMIN, userRole.USER), postController.updateOwnPost);

export const postRouter: Router = router