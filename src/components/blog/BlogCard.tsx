import { Link } from "react-router-dom";

import type { Blog } from "@/features/api";

type BlogCardProps = {
  blog: Blog;
};

const BlogCard = ({ blog }: BlogCardProps) => {
  const translation = blog.blog_translations[0];

  if (!translation) return null;

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-background">
      <Link to={`/blog/${blog.slug}`} className="block">
        <div className="aspect-video overflow-hidden">
          <img
            src={blog.cover_image}
            alt={translation.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-5">
          <p className="mb-2 text-sm opacity-60">{blog.author}</p>

          <h2 className="text-xl font-semibold">{translation.title}</h2>

          <p className="mt-3 line-clamp-2 text-sm opacity-70">
            {translation.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
