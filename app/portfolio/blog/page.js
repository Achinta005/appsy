import React from "react";
import BlogPage from "./Blog";
import { PortfolioApiService } from "@/services/PortfolioApiService";

export const revalidate = 86400;

export default async function BlogPostPage() {

  try {
    const blogPostData = await PortfolioApiService.fetchBlog();

    return <BlogPage blogPostData={blogPostData} />;
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return (
      <div className="text-center text-red-400 mt-20">
        Failed to load blog posts.
      </div>
    );
  }
}
