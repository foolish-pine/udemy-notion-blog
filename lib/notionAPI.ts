import { Client } from "@notionhq/client";

const DATABASE_ID = process.env.NOTION_DATABASE_ID as string;
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

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
