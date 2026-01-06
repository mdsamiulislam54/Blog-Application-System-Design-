
import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client"
import { prisma } from "../../../lib/prisma"
import { PostWhereInput } from "../../../generated/prisma/models";

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
    console.log("Author_id", author_Id)
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
                    replies: {
                        select: {
                            comment_id: true,
                            author_id: true,
                            content: true,
                            parent_id: true
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
const deletedPost = async (id: string) => {
    const result = await prisma.post.delete({

        where: {
            post_id: id
        }
    });

    return result
}

const getPostById = async (id: string) => {
    console.log(id)
    const result = await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: { post_id: id },
            data: {
                view: {
                    increment: 1
                }
            }
        })
        const postData = await tx.post.findUnique({
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

        return postData;
    })
    return result
}

export const postService = {
    createPost,
    getAllPost,
    deletedPost,
    getPostById
}