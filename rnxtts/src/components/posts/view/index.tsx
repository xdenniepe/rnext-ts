import { type RouterOutputs } from "~/utils/api"

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Image from "next/image"

export type PostWithUser = RouterOutputs["posts"]["getAll"][number]

dayjs.extend(relativeTime)

const PostView = (props: PostWithUser) => {
    const { post, author } = props

    return (
        <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
            <Image
                src={author.profileImageUrl}
                alt={`@${author.username}'s profile picture`}
                className="h-14 w-14 rounded-full"
                width={56}
                height={56}
            />
            <div className="flex flex-col">
                <div className="flex gap-1 text-sm font-bold text-slate-300">
                    <span>{`@${author.username}`}</span> {"·"}
                    <span className="font-thin">
                        {dayjs(post.createdAt).fromNow()}
                    </span>
                </div>
                <span>{post.content}</span>
            </div>
        </div>
    )
}

export default PostView
