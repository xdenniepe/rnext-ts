import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


type User = {
  id   : string
  name : string
  image: string
  email: string
}

const filterUserForClient = (user: User) => {
  return {
    id      : user.id,
    username: user.name,
  }
}

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.prisma.post.findMany({
      take: 100,
    });

    // ** way to filter desired response from the api
    // const users = ( 
    //   await clerkClient.users.getUserList({
    //     userId: posts.map((post) => post.authorId),
    //     limit: 100
    //   })
    // ).map(filterUserForClient);

    return post;
  }),
});
