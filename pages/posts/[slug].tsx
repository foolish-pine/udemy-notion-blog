import { getAllPosts, getSinglePost } from "@/lib/notionAPI";
import { GetStaticPropsContext } from "next";
import ReactMarkdown from "react-markdown";

export const getStaticPaths = async () => {
  const allPosts = await getAllPosts();
  const paths = allPosts.map(({ slug }) => ({
    params: {
      slug,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const post = await getSinglePost(params!.slug as string);

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};

type Props = {
  post: any;
};

export default function Post({ post: { metadata, markdown } }: Props) {
  return (
    <section className="container lg:px-2 px-5 h-screen lg:w-2/5 mx-auto mt-20">
      <h2 className="w-full text-2xl font-medium">{metadata.title}</h2>
      <div className="border-b-2 w-1/3 mt-1 border-sky-900"></div>
      <span className="text-gray-500">Posted at {metadata.date}</span>
      <br />
      {metadata.tags.map((tag: string) => (
        <p
          key={tag}
          className="text-white bg-sky-900 rounded-xl font-medium mt-2 px-2 inline-block mr-2"
        >
          {tag}
        </p>
      ))}
      <div className="mt-10 font-medium">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </section>
  );
}
