import React from "react";

type Props = {
  title: string;
  description: string;
  data: string;
  slug: string;
  tags: string[];
};

export const SinglePost = ({
  post: { title, description, data, slug, tags },
}) => {
  return <div>{title}</div>;
};
