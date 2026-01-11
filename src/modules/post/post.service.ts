
import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client"
import { prisma } from "../../../lib/prisma"
import { PostWhereInput } from "../../../generated/prisma/models";
import { userRole } from "../../middleware/middleware";

const createPost = async (data: Omit<Post, "post_id" | "createdAt" | "updatedAt" | "author_id">, user_id: string) => {

    const result = await prisma.post.create({
        data: {
            ...data,
            author_id: user_id
        }
    });

    return result

}

const getAllPost = async (payload: {
    searchtext?: string | undefined;
    tagsArray?: string[];
    statusText: PostStatus | undefined;
    isFeature: boolean | undefined;
    author_Id: string;
    page: number
    skip: number;
    limit: number;
    sortBy: string
    sorOrderBy: string
}) => {

    const { searchtext, tagsArray, statusText, isFeature, author_Id, skip, limit, sortBy, sorOrderBy, page } = payload;
    const wherConditions: PostWhereInput[] = []

    if (searchtext) {
        wherConditions.push(
            {
                OR: [

                    {
                        title: {
                            contains: searchtext as string,
                            mode: "insensitive"
                        }
                    },
                    {
                        content: {
                            contains: searchtext as string,
                            mode: "insensitive"
                        }
                    },

                    {
                        tags: {
                            has: searchtext as string
                        }
                    }

                ]
            },
        )
    };

    if (tagsArray && tagsArray.length > 0) {
        wherConditions.push(
            {
                tags: {
                    hasEvery: tagsArray as string[]
                }
            }
        )
    };

    // if (statusText === undefined) return [];
    if (statusText && statusText !== undefined) {
        wherConditions.push({
            status: statusText
        })
    }

    if (typeof isFeature === 'boolean') {
        wherConditions.push({
            isFeatured: isFeature
        })
    }

    if (author_Id) {
        wherConditions.push({
            author_id: author_Id
        })
    }

    const result = await prisma.post.findMany({
        take: limit,
        skip,
        where: {
            AND: wherConditions
        },
        include: {
            comment: {
                select: {
                    comment_id: true,
                    author_id: true,
                    content: true,
                    parent_id: true,
                    status: true,
                    replies: {
                        select: {
                            comment_id: true,
                            author_id: true,
                            content: true,
                            parent_id: true,
                            status: true
                        }
                    }
                },



            }
        },
        orderBy: {
            [sortBy]: sorOrderBy
        }
    });

    const total = await prisma.post.count({
        where: {
            AND: wherConditions
        }
    })

    return {
        result,
        pagination: {
            total,
            page,
            limit,
            totalpage: Math.floor(total / limit)
        }
    }
}
const deletedPost = async (id: string, authorId: string, isAdmin: boolean) => {
    // console.log("Author Id ***************", authorId)
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            post_id: id
        },
        select: {
            author_id: true,
            post_id: true
        }
    });

    if (!isAdmin && post.author_id !== authorId) {
        throw new Error("You are not deleted of this post because you are not owner of this post")
    }

    const result = await prisma.post.delete({
        where: {
            post_id: id
        }
    });

    return result
}

const getPostById = async (id: string) => {

    const postData = await prisma.post.findUniqueOrThrow({
        where: { post_id: id },
        include: {
            comment: {
                where: {
                    parent_id: null
                },
                orderBy: { createdAt: "desc" },
                include: {
                    replies: {
                        where: {
                            status: CommentStatus.APPROVED
                        },
                        orderBy: { createdAt: "asc" },
                        include: {
                            replies: {
                                where: {
                                    status: CommentStatus.APPROVED
                                },
                                orderBy: { createdAt: "asc" },
                            },

                        }
                    }
                }
            },
            _count: {
                select: { comment: true }
            }
        }
    });


    await prisma.post.update({
        where: { post_id: id },
        data: {
            view: {
                increment: 1
            }
        }
    })


    return postData;


}

const getMyPost = async (authorId: string) => {

    await prisma.user.findUniqueOrThrow({
        where: {
            id: authorId,
            status: "ACTIVE"
        }
    })
    const result = await prisma.post.findMany({
        where: {
            author_id: authorId
        },
        include: {
            _count: {
                select: {
                    comment: true
                }
            },
            comment: true
        },
        orderBy: { createdAt: "desc" },


    });

    const total = await prisma.post.aggregate({
        _count: {
            post_id: true
        },
        where: {
            author_id: authorId
        }
    })

    return { result, total }
};

const updateOwnPost = async (id: string, authorid: string, data: Partial<Post>, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: { post_id: id },
        select: { post_id: true, author_id: true }
    });

    if (!isAdmin && (post.author_id !== authorid)) {
        throw new Error("Your are not create/owner of this post. So Your not update of this post ")
    }

    if (!isAdmin) {
        delete data.isFeatured;
    }

    return await prisma.post.updateMany({
        where: {
            post_id: id
        },
        data
    })



}

const statistics = async () => {
    // totalPost, totalView, publishedPost, archivedPost, draftPost, totalComment, totalUser, totalAdmin

        const [totalPost, totalView, publishedPost, archivedPost, draftPost, totalComment, totalUser, totalAdmin] = await Promise.all([
            await prisma.post.count(),
            await prisma.post.aggregate({ _sum: { view: true } }),
            await prisma.post.count({ where: { status: PostStatus.PUBLISHED } }),
            await prisma.post.count({ where: { status: PostStatus.ARCHIVED } }),
            await prisma.post.count({ where: { status: PostStatus.DRAFT } }),
            await prisma.comment.count(),
            await prisma.user.count(),
            await prisma.user.count({ where: { role: userRole.ADMIN } })

        ])
        return {
            totalPost, totalView: totalView._sum.view , publishedPost, archivedPost, draftPost, totalComment, totalUser, totalAdmin
        }
   

}

export const postService = {
    createPost,
    getAllPost,
    deletedPost,
    getPostById,
    getMyPost,
    updateOwnPost,
    statistics
}