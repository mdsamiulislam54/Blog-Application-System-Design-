import { prisma } from "../../../lib/prisma"

const createComment = async (payload: {
    content: string;
    author_id: string;
    post_id: string
    parent_id?: string
}) => {

    await prisma.post.findUniqueOrThrow({ where: { post_id: payload.post_id } });

    if(payload.parent_id){
        await prisma.comment.findUniqueOrThrow({where:{comment_id: payload.parent_id}})
    }

    return await prisma.comment.create({
        data: payload,
        include: {
            replies: true
        }
    })

}

const getCommentById = async(id:string)=>{
    console.log("commId", id)
    return await prisma.comment.findUnique({
        where:{
            comment_id: id
        },
        include:{
            post:true
        },
        
    })
}
const getCommentByAuthorId = async(id:string)=>{
    console.log("commId", id)
    return await prisma.comment.findUnique({
        where:{
            comment_id: id
        },
        include:{
            replies:true
        }
    })
}
export const commentService = {
    createComment,
    getCommentById
}