import { Post } from "../../../generated/prisma/client"
import { prisma } from "../../../lib/prisma"

const createPost = async (data: Omit<Post, "post_id" |"createdAt" | "updatedAt"| "author_id" >,  user_id: string)=>{

    const result = await prisma.post.create({
        data: {
            ...data,
            author_id: user_id
        }
    });

    return result

}

const getAllPost = async (payload: Record<string, unknown>)=>{
    const {search} = payload;
    const result = await prisma.post.findMany({
        where:{
            title:{
                contains : search as string,
                mode: "insensitive"
            }
        }
    });

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