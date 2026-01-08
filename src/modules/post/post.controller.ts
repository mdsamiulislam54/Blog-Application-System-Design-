import { Request, Response } from "express"
import { postService } from "./post.service"
import { PostStatus } from "../../../generated/prisma/client"
import { paginationSortingHelper } from "../../helper/paginationAndSortinghelper";
import { userRole } from "../../middleware/middleware";


const createPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const data = await postService.createPost(req.body, user.id as string);
        res.status(201).json({ message: "Post create Successfully", data })
    } catch (error) {
        res.status(404).json({ error: error instanceof Error ? error.message : "Post create failed" })
    }
}
const getPost = async (req: Request, res: Response) => {
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
        res.status(404).json({ error: error instanceof Error ? error.message : "Get Post  failed" })
    }
}
const deletedPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if(!user) throw new Error("You are unauthorized")
        const id = req.params.id as string;
        const authorId = user?.id as string;
        const isAdmin = user.role === userRole.ADMIN;

        const data = await postService.deletedPost(id, authorId, isAdmin);
        res.status(200).json({ message: " Deleted Post Successfully", data })
    } catch (error) {
        res.status(404).json({ error: error instanceof Error ? error.message : "Deleted Post  failed" })
    }
}
const getPostById = async (req: Request, res: Response) => {
    try {

        const id = req.params.id as string;
        if (!id) { throw new Error("Post_id is Required") }

        const data = await postService.getPostById(id);

        if (!data) {
            res.status(404).json({ success: false, message: "This PostId Post is not exists" })
        }
        res.status(200).json({ message: " Post Get Successfully", data })
    } catch (error) {
        res.status(404).json({ error: error instanceof Error ? error.message : "Post not found" })
    }
}
const getMyPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) throw new Error("Unauthorized User")
        const id = req.user?.id;
        const data = await postService.getMyPost(id);
        res.status(200).json({ message: " Your Post Get Successfully", data })
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: error instanceof Error ? error.message : " Your Post not found" })
    }
}

const updateOwnPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) throw new Error("Unauthorized User");
        const id = req.params.id as string;
        const isAdmin = user.role === userRole.ADMIN;
        const data = await postService.updateOwnPost(id, user.id, req.body, isAdmin);
        res.status(200).json({ message: " Your Post Update Successfully", });
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: error instanceof Error ? error.message : " Your Post update failed" })
    }
}
const statistices = async (req: Request, res: Response) => {
    try {
       
        const data = await postService.statistics();
        res.status(200).json({ message: " Get Statistices  Successfully",data });
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: error instanceof Error ? error.message : " Statisce data failed" })
    }
}

export const postController = {
    createPost,
    getPost,
    deletedPost,
    getPostById,
    getMyPost,
    updateOwnPost,
    statistices
}