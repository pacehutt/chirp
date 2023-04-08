import { type NextPage } from "next";
import Head from "next/head";

const PostViewPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Chirp</title>
        <meta name="description" content="💭" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center ">Post View</main>
    </>
  );
};

export default PostViewPage;
