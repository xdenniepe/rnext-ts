import { api } from "~/utils/api"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"

const CreatePostWizard = () => {
    const { user } = useUser()
    const [input, setInput] = useState("")

    const ctx = api.useContext()

    const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
        onSuccess: () => {
            setInput("")
            void ctx.posts.getAll.invalidate()
        },
    })

    console.log(user)

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
            />
            <button onClick={() => mutate({ content: input })}>Post</button>
        </div>
    )
}

export default CreatePostWizard
