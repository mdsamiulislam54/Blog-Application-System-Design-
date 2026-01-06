import { Request, Response } from "express"
import { postService } from "./post.service"
import { PostStatus } from "../../../generated/prisma/client"
import { paginationSortingHelper } from "../../helper/paginationAndSortinghelper";


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
        const { search, tags, statusParam, isFeatured, authorId, } = req.query;
        const searchtext = typeof search === 'string' ? search : undefined;
        const tagsArray = typeof tags === 'string' ? (tags as string).split(",") : [];
        const author_Id = authorId as string
        const statusText = typeof statusParam === "string" && Object.values(PostStatus).includes(statusParam as PostStatus) ? statusParam as PostStatus : undefined;
        const isFeature = isFeatured
            ? isFeatured === 'true'
                ? true
                : isFeatured === 'false'
                    ? false
                    : undefined
            : undefined;


        const { skip, limit, sorOrderBy, sortBy, page } = paginationSortingHelper(req.query);


        const data = await postService.getAllPost({ searchtext, tagsArray, statusText, isFeature, author_Id, skip, limit, sortBy, sorOrderBy, page });
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
const getPostById = async (req: Request, res: Response) => {
    try {

        const id = req.params.id as string;
        if (!id) { throw new Error("Post_id is Required") }
        
        const data = await postService.getPostById(id);
   
        if (!data) {
            res.status(404).json({ success: false ,message: "This PostId Post is not exists"  })
        }
        res.status(200).json({ message: " Post Get Successfully", data })
    } catch (error) {
        res.status(404).json({ success: false ,message: "Post not found" })
    }
}

export const postController = {
    createPost,
    gatePost,
    deletedPost,
    getPostById
}