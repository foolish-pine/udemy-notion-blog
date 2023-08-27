import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const DATABASE_ID = process.env.NOTION_DATABASE_ID as string;
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export const getAllPosts = async () => {
  const posts = await notion.databases.query({
    database_id: DATABASE_ID,
  });

  return posts.results.map((post) => {
    return getPageMetaData(post);
  });
};

const getPageMetaData = (post: any) => {
  const getTags = (tags: any) => tags.map((tag: any) => tag.name);

  return {
    id: post.id,
    title: post.properties.Title.title[0]?.plain_text || "",
    description: post.properties.Description.rich_text[0]?.plain_text || "",
    date: post.properties.Date.date?.start || "",
    slug: post.properties.Slug.rich_text[0]?.plain_text || "",
    tags: getTags(post.properties.Tags.multi_select),
  };
};

export const getSinglePost = async (slug: string) => {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: "Slug",
      formula: {
        string: {
          equals: slug,
        },
      },
    },
  });

  const page = response.results[0];
  const metadata = getPageMetaData(page);

  const mdblocks = await n2m.pageToMarkdown(metadata.id);
  const mdString = n2m.toMarkdownString(mdblocks).parent;

  return { metadata, markdown: mdString };
};
