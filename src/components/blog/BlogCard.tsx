import { Link } from "react-router-dom";

import type { Blog } from "@/features/api";

import { Card, CardContent } from "@/components/ui/card";

type BlogCardProps = {
  blog: Blog;
};

const BlogCard = ({ blog }: BlogCardProps) => {
  const translation = blog.blog_translations[0];

  if (!translation) return null;

  return (
    <Card className="group overflow-hidden p-0">
      <Link to={`/blog/${blog.slug}`}>
        <div className="aspect-video overflow-hidden">
          <img
            src={blog.cover_image}
            alt={translation.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <CardContent className="px-2 pb-2">
          <p className="mb-2 text-sm">{blog.author}</p>

          <h2 className="text-xl font-semibold">{translation.title}</h2>

          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
            {translation.excerpt}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
};

export default BlogCard;
