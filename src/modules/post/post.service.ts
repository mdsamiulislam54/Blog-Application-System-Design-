import { Post } from "../../../generated/prisma/client"
import { prisma } from "../../../lib/prisma"

const createPost = async (data: Omit<Post, "post_id" |"createdAt" | "updatedAt">)=>{

    const result = await prisma.post.create({
        data
    });

    return result

}

const getAllPost = async ()=>{
    const result = await prisma.post.findMany();

    return result
}
const deletedPost = async (id:string)=>{
    const result = await prisma.post.delete({
        where:{
            post_id: id
        }
    });

    return result
}


export const postService = {
    createPost,
    getAllPost,
    deletedPost
}