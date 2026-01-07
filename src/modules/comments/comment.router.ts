import express, { Router } from "express";
import { commentController } from "./comment.controller";
import { roleVerify, userRole } from "../../middleware/middleware";

const router = express.Router();
router.post('/', roleVerify(userRole.ADMIN, userRole.USER), commentController.createComment);
router.get('/:commentId', commentController.getCommentById);
router.get('/author/:authorId', commentController.getCommentByAuthorId);
router.delete('/:id', roleVerify(userRole.ADMIN, userRole.USER), commentController.deleteCommentById);
router.patch('/:id', roleVerify(userRole.ADMIN, userRole.USER), commentController.updateComment);
router.patch('/moderate/:id', roleVerify(userRole.ADMIN), commentController.moderateComment);


export const commentRouter: Router = router