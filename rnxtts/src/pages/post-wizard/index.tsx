import { useUser } from "@clerk/nextjs"
import Image from "next/image"

const CreatePostWizard = () => {
    const { user } = useUser()

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
            />
        </div>
    )
}

export default CreatePostWizard
