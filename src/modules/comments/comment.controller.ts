import { NextFunction, Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response ,  next: NextFunction) => {
    try {
        const user = req.user;
        req.body.author_id = user?.id;
        const data = await commentService.createComment(req.body);
        res.status(201).json({ message: "Comment create Successfully", data })
    } catch (error) {
        next(error)
    }
}
const getCommentById = async (req: Request, res: Response ,  next: NextFunction) => {
    try {

        const commentId = req.params.commentId as string
        const data = await commentService.getCommentById(commentId);
        res.status(201).json({ message: "Comment Get Successfully", data })
    } catch (error) {
        next(error)
    }
}
const getCommentByAuthorId = async (req: Request, res: Response ,  next: NextFunction) => {
    try {

        const id = req.params.authorId as string
        const data = await commentService.getCommentByAuthorId(id);
        res.status(201).json({ message: "Comment Get Successfully", data })
    } catch (error) {
       next(error)
    }
}
const deleteCommentById = async (req: Request, res: Response ,  next: NextFunction) => {
    try {
        const user = req.user;
        const id = req.params.id as string

        const data = await commentService.deleteCommentById(id, user?.id);
        res.status(201).json({ message: "Comment Delete Successfully", data })
    } catch (error) {
        next(error)
    }
}
const updateComment = async (req: Request, res: Response ,  next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const UpdateData = req.body;
        const user = req.user;
        const data = await commentService.updateComment(id, UpdateData, user?.id);
        res.status(201).json({ message: "Comment Update Successfully", data })
    } catch (error) {
        next(error)
    }
}
const moderateComment = async (req: Request, res: Response ,  next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const data = await commentService.moderateComment(id, req.body);
        res.status(201).json({ message: "Comment Update Successfully", data })
    } catch (error) {
        next(error)
    }
}


export const commentController = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteCommentById,
    updateComment,
    moderateComment
}