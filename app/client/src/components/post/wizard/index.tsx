import { api } from "~/utils/api"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import { toast } from "react-hot-toast"
import LoadingSpinner from "~/components/loading/loading"

const CreatePostWizard = () => {
    const { user } = useUser()
    const [input, setInput] = useState("")

    const ctx = api.useContext()

    const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
        onSuccess: () => {
            setInput("")
            void ctx.posts.getAll.invalidate()
        },
        onError: (e) => {
            const errorMessage = e.data?.zodError?.fieldErrors?.content
            if (errorMessage && errorMessage[0]) {
                toast.error(errorMessage[0])
            } else {
                toast.error("Failed to post. Please try again later.")
            }
        },
    })

    return (
        <div className="flex w-full gap-3">
            <Image
                src={!user?.profileImageUrl ? "" : user.profileImageUrl}
                alt="Profile Image"
                className="h-14 w-14 rounded-full"
                width={56}
                height={56}
            />
            <input
                placeholder="Type some emojis!"
                className="grow bg-transparent outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isPosting}
                onKeyDown={(e) => {
                    if (e.key === "enter") {
                        e.preventDefault()
                        if (input != "") {
                            mutate({ content: input })
                        }
                    }
                }}
            />
            {input != "" && !isPosting && (
                <button onClick={() => mutate({ content: input })}>Post</button>
            )}

            {isPosting && (
                <div className="flex items-center justify-center">
                    <LoadingSpinner size={20} />
                </div>
            )}
        </div>
    )
}

export default CreatePostWizard
