import { Request, Response } from "express"
import { postService } from "./post.service"
const createPost = async (req:Request,res:Response)=>{
    try {
        const data = await postService.createPost(req.body);
        res.status(201).json({message:"Post create Successfully", data})
    } catch (error) {
        res.status(404).json({error: "Post create failed"})
    }
}
const gatePost = async (req:Request,res:Response)=>{
    try {
        console.log("get")
        const data = await postService.getAllPost();
        res.status(201).json({message:" Get Post Successfully", data})
    } catch (error) {
        res.status(404).json({error: "Get Post  failed"})
    }
}
const deletedPost = async (req:Request,res:Response)=>{
    try {
        
        const id = req.params.id as string;
        console.log(id)
        const data = await postService.deletedPost(id);
        res.status(200).json({message:" Deleted Post Successfully", data})
    } catch (error) {
        res.status(404).json({error: "Deleted Post  failed"})
    }
}

export const postController = {
    createPost,
    gatePost,
    deletedPost
}