import { api } from "~/utils/api"
import type { GetStaticPropsContext, NextPage } from "next"
import Head from "next/head"
import PageLayout from "~/components/layout/Layout"
import Image from "next/image"
import LoadingPage from "./loading"
import PostView from "~/components/post/view"
import { generateSSGHelper } from "~/server/helpers/ssgHelper"

export const getStaticProps = async (
    context: GetStaticPropsContext<{ slug: string }>
) => {
    const ssg = generateSSGHelper()

    const slug = context.params?.slug as string

    if (typeof slug !== "string") throw new Error("no slug")

    const username = slug.replace("@", "")

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

const ProfileFeed = (props: { userId: string }) => {
    const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
        userId: props.userId,
    })

    if (isLoading) return <LoadingPage />

    if (!data) return <div>User has not posted</div>

    return (
        <div className="flex flex-col">
            {data.map((fullPost) => (
                <PostView key={fullPost.post.id} {...fullPost} />
            ))}
        </div> 
    )
}

const Profile: NextPage<{ username: string }> = ({ username }) => {
    const { data } = api.profile.getUserByUsername.useQuery({
        username,
    })

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
                <ProfileFeed userId={data.id} />
            </PageLayout>
        </>
    )
}

export default Profile
