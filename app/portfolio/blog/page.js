import React from "react";
import BlogPage from "./Blog";
import { PortfolioApiService } from "@/services/PortfolioApiService";

export default async function BlogPostPage() {
  let blogPostData = null;
  let error = null;

  try {
    blogPostData = await PortfolioApiService.fetchBlog();
  } catch (err) {
    console.error("Error fetching blog data:", err);
    error = err;
  }

  if (error) {
    return (
      <div className="text-center text-red-400 mt-20">
        Failed to load blog posts.
      </div>
    );
  }

  return <BlogPage blogPostData={blogPostData} />;
}
