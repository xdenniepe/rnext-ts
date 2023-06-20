import { api } from "~/utils/api"
import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs"
import { type NextPage } from "next"
import CreatePostWizard from "../components/post/wizard"
import Head from "next/head"
import LoadingPage from "./loading"
import PostView from "../components/post/view"
import PageLayout from "~/components/layout/Layout"

const Feed = () => {
    const { data, isLoading: postsLoading } = api.posts.getAll.useQuery()

    if (postsLoading) return <LoadingPage />
    if (!data) return <>Something went wrong.</>

    return (
        <div className="flex flex-col">
            {data.map((fullPost) => (
                <PostView key={fullPost.post.id} {...fullPost} />
            ))}
        </div>
    )
}

const Home: NextPage = () => {
    const { isLoaded: userLoaded, isSignedIn } = useUser()

    // Start fetching asap
    api.posts.getAll.useQuery()

    // return empty div if BOTH aren't loaded, since user tends to load faster
    if (!userLoaded) return <div />

    return (
        <>
            <Head>
                <title>HOME</title>
            </Head>
            <PageLayout>
                <div className="flex justify-end border-b border-slate-400 p-4">
                    {!isSignedIn && <SignInButton />}
                    {!!isSignedIn && <SignOutButton />}
                </div>
                <div className="flex border-b border-slate-400 p-4">
                    <SignIn
                        path="/sign-in"
                        routing="path"
                        signUpUrl="/sign-up"
                    />
                    <CreatePostWizard />
                </div>
                <Feed />
            </PageLayout>
        </>
    )
}

export default Home
