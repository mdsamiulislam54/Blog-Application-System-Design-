import { NextFunction, Request, Response } from "express"
import { postService } from "./post.service"
import { PostStatus } from "../../../generated/prisma/client"
import { paginationSortingHelper } from "../../helper/paginationAndSortinghelper";
import { userRole } from "../../middleware/middleware";


const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const data = await postService.createPost(req.body, user.id as string);
        res.status(201).json({ message: "Post create Successfully", data })
    } catch (error) {
        next(error)
    }
};
const getPost = async (req: Request, res: Response,  next: NextFunction) => {
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
        next(error)
    }
};
const deletedPost = async (req: Request, res: Response,  next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) throw new Error("You are unauthorized")
        const id = req.params.id as string;
        const authorId = user?.id as string;
        const isAdmin = user.role === userRole.ADMIN;

        const data = await postService.deletedPost(id, authorId, isAdmin);
        res.status(200).json({ message: " Deleted Post Successfully", data })
    } catch (error) {
        next(error)
    }
};

const getMyPost = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const user = req.user;
        if (!user) throw new Error("Unauthorized User")
        const authorId = req.user?.id;
        const data = await postService.getMyPost(authorId);
        res.status(200).json({ message: " Your Post Get Successfully", data })
    } catch (error) {
        next(error);
    }
};

const getPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const id = req.params.id as string;
        if (!id) { throw new Error("Post_id is Required") }

        const data = await postService.getPostById(id);
        res.status(200).json({ message: " Post Get Successfully", data })
    } catch (error) {
        next(error);
        
    }
};
const updateOwnPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) throw new Error("Unauthorized User");
        const id = req.params.id as string;
        const isAdmin = user.role === userRole.ADMIN;
        const data = await postService.updateOwnPost(id, user.id, req.body, isAdmin);
        res.status(200).json({ message: " Your Post Update Successfully", });
    } catch (error) {
        next(error);

    }
};
const statistices = async (req: Request, res: Response,  next: NextFunction) => {
    try {

        const data = await postService.statistics();
        res.status(200).json({ message: " Get Statistices  Successfully", data });
    } catch (error) {
        next(error)
    }
};

export const postController = {
    createPost,
    getPost,
    deletedPost,
    getPostById,
    getMyPost,
    updateOwnPost,
    statistices
}