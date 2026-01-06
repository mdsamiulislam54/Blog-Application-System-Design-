import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        req.body.author_id = user?.id;
        const data = await commentService.createComment(req.body);
        res.status(201).json({ message: "Comment create Successfully", data })
    } catch (error) {
        res.status(404).json({ error: "Comment create failed" })
    }
}
const getCommentById = async (req: Request, res: Response) => {
    try {
       
        const commentId = req.params.commentId as string
        const data = await commentService.getCommentById(commentId);
        res.status(201).json({ message: "Comment Get Successfully", data })
    } catch (error) {
        res.status(404).json({ error: "Coment Get failed" })
    }
}


export const commentController = {
    createComment,
    getCommentById
}