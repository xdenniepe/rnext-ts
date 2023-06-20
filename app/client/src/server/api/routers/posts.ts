import { clerkClient } from "@clerk/nextjs"
import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure,
} from "~/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { filterUserForClient } from "~/server/helpers/filterUserForClients"
import { type Post } from "@prisma/client"

const addUserDataToPosts = async (posts: Post[]) => {
    // ** way to filter desired response from the api
    const users = (
        await clerkClient.users.getUserList({
            userId: posts.map((post) => post.authorId),
            limit: 100,
        })
    ).map(filterUserForClient)

    return posts.map((post) => {
        const author = users.find((u) => u.id === post.authorId)

        if (!author || !author.username) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Author for post not found",
            })
        }

        return {
            post,
            author: {
                ...author,
                username: author.username,
            },
        }
    })
}

export const postsRouter = createTRPCRouter({

    getById: publicProcedure.input(z.object({
        id: z.string()
    })).query(async ({ctx, input}) => {
        const post = await ctx.prisma.post.findUnique({
            where: {
                id: input.id,
            }
        })

        if (!post) throw new TRPCError({code: "NOT_FOUND"}) 

        return (await addUserDataToPosts([post]))[0]
    }),

    getAll: publicProcedure.query(async ({ ctx }) => {
        const posts = await ctx.prisma.post.findMany({
            take: 100,
            orderBy: [{ createdAt: "desc" }],
        })

        return addUserDataToPosts(posts);
        
    }),

    getPostsByUserId: publicProcedure
        .input(
            z.object({
                userId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const posts = await ctx.prisma.post.findMany({
                where: {
                    authorId: input.userId,
                },
                take: 100,
                orderBy: [
                    {
                        createdAt: "desc",
                    },
                ],
            })

            return addUserDataToPosts(posts)
        }),

    create: privateProcedure
        .input(
            z.object({
                content: z
                    .string()
                    .emoji("Only emojis are allowed.")
                    .min(1)
                    .max(280),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const authorId = ctx.userId

            const post = await ctx.prisma.post.create({
                data: {
                    authorId: !authorId ? "" : authorId,
                    content: input.content,
                },
            })

            return post
        }),
})
