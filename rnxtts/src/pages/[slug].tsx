import { api } from "~/utils/api"
import { appRouter } from "~/server/api/root"
import { createServerSideHelpers } from "@trpc/react-query/server"
import type { GetStaticPropsContext, NextPage } from "next"
import { prisma } from "~/server/db"
import Head from "next/head"
import superjson from "superjson"
import PageLayout from "~/components/layout/Layout"
import Image from "next/image"

export const getStaticProps = async (
    context: GetStaticPropsContext<{ slug: string }>
) => {
    const ssg = createServerSideHelpers({
        router: appRouter,
        ctx: { prisma, userId: null },
        transformer: superjson, // optional - adds superjson serialization
    })

    const slug = context.params?.slug as string

    if (typeof slug !== "string") throw new Error("no slug")

    const username = slug.replace("@", "")
    console.log("username :", username)

    await ssg.profile.getUserByUsername.prefetch({ username })

    return {
        props: {
            trpcState: ssg.dehydrate(),
            username,
        },
    }
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking",
    }
}

const SlugProfile: NextPage<{ username: string }> = ({ username }) => {
    const { data } = api.profile.getUserByUsername.useQuery({
        username,
    })

    console.log(username)

    if (!data) return <div>404</div>

    return (
        <>
            <Head>
                <title>{data.username}</title>
            </Head>
            <PageLayout>
                <div className="relative h-36 border-b border-slate-400 bg-slate-600">
                    <Image
                        src={data.profileImageUrl}
                        alt={`${data.username ?? ""}'s profile pic`}
                        width={128}
                        height={128}
                        className="absolute bottom-0 left-0 -mb-[48px] ml-4 rounded-full border-4 border-black bg-black"
                    />
                </div>
                <div className="h-[36px]" />
                <div className="p-4 text-2xl font-semibold">{`@${
                    data.username ?? ""
                }`}</div>
                <div className="w-full border-b border-slate-400" />
            </PageLayout>
        </>
    )
}

export default SlugProfile
