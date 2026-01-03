import { number } from "better-auth/*";
import { Post } from "../../../generated/prisma/client"
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
}) => {

    const { searchtext, tagsArray } = payload;
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


    const result = await prisma.post.findMany({
        where:{
            AND: wherConditions
        }
    });

    return result
}
const deletedPost = async (id: string) => {
    const result = await prisma.post.delete({
        where: {
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