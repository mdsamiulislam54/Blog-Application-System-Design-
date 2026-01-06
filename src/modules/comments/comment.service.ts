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
    console.log("commId", id)
    return await prisma.comment.findUnique({
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
    console.log(id, "authorId")

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
export const commentService = {
    createComment,
    getCommentById,
    getCommentByAuthorId
}