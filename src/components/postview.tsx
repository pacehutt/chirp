import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { RouterOutputs } from "~/utils/api";

import relativeTime from "dayjs/plugin/relativeTime";

type PostWithUSer = RouterOutputs["posts"]["getAll"][number];

dayjs.extend(relativeTime);
const PostView = ({ post, author }: PostWithUSer) => {
  return (
    <div key={post.id} className="flex gap-4 border-b border-slate-400 p-5">
      <Link href={`/@${author?.username || author.id}`}>
        <Image
          height={40}
          width={40}
          src={author.profileImageUrl}
          alt="profile image"
          className="h-12 w-12 rounded-full"
        />
      </Link>

      <div className="flex flex-col gap-1">
        <div className="font-bold-500 text-slate-500">
          <Link href={`/@${author?.username || author.id}`}>
            <span>@{author?.username || author.id}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span>· {dayjs(post.createdAt).fromNow()} </span>
          </Link>
        </div>
        <Link href={`/post/${post.id}`}>
          <div className="text-xl">{post.content}</div>
        </Link>
      </div>
    </div>
  );
};

export default PostView;
