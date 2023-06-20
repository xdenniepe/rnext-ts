import { api } from "~/utils/api"
import { useUser } from "@clerk/nextjs"
import { type NextPage } from "next"
import Head from "next/head"

const SinglePost: NextPage = () => {
    const { isLoaded: userLoaded } = useUser()

    // Start fetching asap
    api.posts.getAll.useQuery()

    // return empty div if BOTH aren't loaded, since user tends to load faster
    if (!userLoaded) return <div />

    return (
        <>
            <Head>
                <title>SINGLE POST</title>
            </Head>
            <main className="flex h-screen justify-center">
                <div>SinglePost View</div>
            </main>
        </>
    )
}

export default SinglePost
