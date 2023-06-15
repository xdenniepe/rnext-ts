import { clerkClient } from "@clerk/nextjs"
import { type User } from "@clerk/nextjs/dist/types/server/clerkClient"
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"

const filterUserForClient = (user: User) => {
    return {
        id: user.id,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
    }
}

export const postsRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const posts = await ctx.prisma.post.findMany({
            take: 100,
        })

        // ** way to filter desired response from the api
        const users = (
            await clerkClient.users.getUserList({
                userId: posts.map((post) => post.authorId),
                limit: 100,
            })
        ).map(filterUserForClient)

        console.log(users)

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
    }),
})
