import { Request, Response } from "express"
import { postService } from "./post.service"
const createPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const data = await postService.createPost(req.body, user.id as string);
        res.status(201).json({ message: "Post create Successfully", data })
    } catch (error) {
        res.status(404).json({ error: "Post create failed" })
    }
}
const gatePost = async (req: Request, res: Response) => {
    try {
        const { search, tags } = req.query;
        const searchtext = typeof search === 'string'? search: undefined;
        const tagsArray = typeof tags === 'string'? (tags as string).split(","): [];
        
       
        const data = await postService.getAllPost({ searchtext, tagsArray });
        res.status(201).json({ message: " Get Post Successfully", data })
    } catch (error) {
        res.status(404).json({ error: "Get Post  failed" })
    }
}
const deletedPost = async (req: Request, res: Response) => {
    try {

        const id = req.params.id as string;
        console.log(id)
        const data = await postService.deletedPost(id);
        res.status(200).json({ message: " Deleted Post Successfully", data })
    } catch (error) {
        res.status(404).json({ error: "Deleted Post  failed" })
    }
}

export const postController = {
    createPost,
    gatePost,
    deletedPost
}