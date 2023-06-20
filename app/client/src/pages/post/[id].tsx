import { api } from "~/utils/api"
import type { GetStaticPropsContext, NextPage } from "next"
import Head from "next/head"
import PageLayout from "~/components/layout/Layout"
import Image from "next/image"
import PostView from "~/components/post/view"
import { generateSSGHelper } from "~/server/helpers/ssgHelper"
import LoadingPage from "../loading"

export const getStaticProps = async (
    context: GetStaticPropsContext<{ id: string }>
) => {
    const ssg = generateSSGHelper()

    const id = context.params?.id as string

    if (typeof id !== "string") throw new Error("no id")

    await ssg.posts.getById.prefetch({ id })

    return {
        props: {
            trpcState: ssg.dehydrate(),
            id,
        },
    }
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking",
    }
}

const SinglePost: NextPage<{ id: string }> = ({ id }) => {
    const { data } = api.posts.getById.useQuery({
        id,
    })

    if (!data) return <div>404</div>

    return (
        <>
            <Head>
                <title>{`${data.post.content} - @${data.author.username}`}</title>
            </Head>
            <PageLayout>
                <PostView {...data} />
            </PageLayout>
        </>
    )
}

export default SinglePost
