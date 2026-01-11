import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma"

const createComment = async (payload: {
    content: string;
    author_id: string;
    post_id: string
    parent_id?: string
}) => {

    await prisma.post.findUniqueOrThrow({ where: { post_id: payload.post_id } });

    if (payload.parent_id) {
        await prisma.comment.findUniqueOrThrow({ where: { comment_id: payload.parent_id } })
    }

    return await prisma.comment.create({
        data: payload,
        include: {
            replies: true
        }
    })

}

const getCommentById = async (id: string) => {
    return await prisma.comment.findUniqueOrThrow({
        where: {
            comment_id: id
        },
        include: {
            post: {
                select: {
                    post_id: true,
                    title: true
                }
            },

        },

    })
}
const getCommentByAuthorId = async (id: string) => {


    return await prisma.comment.findMany({
        where: {
            author_id: id
        },
        orderBy: { createdAt: "desc" },
        include: {
            replies: {
                select: {
                    comment_id: true,
                    content: true
                }
            },
            post: {
                select: {
                    post_id: true,
                    title: true,
                }

            },

        }
    })
}

const deleteCommentById = async (id: string, authorId: string) => {

    const comment = await prisma.comment.findFirst({
        where: {
            comment_id: id,
            author_id: authorId
        },
        select: {
            comment_id: true
        }
    });

    if (!comment) {
        throw new Error("Comment not found!")
    }

    return await prisma.comment.delete({
        where: {
            comment_id: id,
            author_id: authorId
        }
    })

}

const updateComment = async (
    id: string,
    data: { content?: string; status?: CommentStatus },
    authorId: string
) => {

    const comment = await prisma.comment.findFirst({
        where: {
            comment_id: id,
            author_id: authorId
        },
        select: {
            comment_id: true
        }
    });

    if (!comment) {
        throw new Error("Comment not found!");
    }

    const updateData = {
        ...(data.content !== undefined && { content: data.content }),
        ...(data.status !== undefined && { status: data.status }),
    };

    return await prisma.comment.updateMany({
        where: {
            comment_id: id,
            author_id: authorId
        },
        data: updateData
    });
};

const moderateComment = async (id: string, data: { status: CommentStatus }) => {
    console.log("moderate", id, data)
    const comment = await prisma.comment.findUniqueOrThrow({
        where: {
            comment_id: id
        },
        select:{
            comment_id:true,
            status:true
        }
    });
    
    if(comment.status === data.status ){
        throw new Error(`You provided status(${data.status}) is a already up to date`)
    }
    return await prisma.comment.update({
        where: {
            comment_id: id
        },
        data
    })

}


export const commentService = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteCommentById,
    updateComment,
    moderateComment
}