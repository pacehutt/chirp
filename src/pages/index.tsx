import {
  SignIn,
  SignInButton,
  SignOutButton,
  SignUp,
  useUser,
} from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage } from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import PostView from "~/components/postview";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();
  let toastId: string | undefined;
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
      toast.dismiss(toastId);
      toast.success("Posted!🪄", {
        style: {
          background: "rgb(31 41 55)",
          color: "white",
        },
      });
    },
    onError(error, variables, context) {
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      toast.dismiss(toastId);
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0] + "😐", {
          style: {
            background: "rgb(31 41 55)",
            color: "white",
          },
        });
      } else {
        toast.error("Failed to post, try again later 🛠️", {
          style: {
            background: "rgb(31 41 55)",
            color: "white",
          },
        });
      }
    },
  });
  console.log(user);

  if (!user) return null;

  return (
    <div className="my-2 flex w-full items-center justify-center gap-4">
      <Image
        src={user.profileImageUrl}
        alt="Profile Img"
        className="h-12 w-12 rounded-full"
        width={40}
        height={40}
      />
      <input
        type="text"
        placeholder="Type some emojis.."
        className="grow bg-transparent p-2 outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        disabled={isPosting}
        onClick={() => {
          mutate({ content: input });
          setInput("");
          toastId = toast.loading("Posting... 🔃", {
            style: {
              background: "rgb(31 41 55)",
              color: "white",
            },
          });
        }}
        className="h-8 rounded-md bg-gray-800 px-3 text-sm text-white"
      >
        Post
      </button>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  // start fetching ASAP as once fetched it will be cached by react query
  api.posts.getAll.useQuery();

  //  return empty div is user not loaded
  if (!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>Chirp</title>
        <meta name="description" content="💭" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <div
          className="border-b border-slate-400 p-5"
          style={{
            color: "white",
          }}
        >
          {isSignedIn && <CreatePostWizard />}
          {!isSignedIn && <SignInButton />}
          {!!isSignedIn && (
            <div className="relative top-1 flex w-20 justify-center border border-slate-600 p-1">
              <SignOutButton />
            </div>
          )}
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        </div>

        <Feed />
      </PageLayout>
    </>
  );
};

export default Home;
