import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { Blog } from "@/features/api";
import { getBlogBySlug } from "@/features/api";
import Container from "@/components/layout/Container";

const BlogDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();

  const [blog, setBlog] = useState<Blog | null>(null);

  const languageId = i18n.language === "fa" ? 2 : 1;

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      const data = await getBlogBySlug(slug, languageId);
      setBlog(data);
    };

    fetchBlog();
  }, [slug, languageId]);

  if (!blog) {
    return (
      <main className="container mx-auto px-4 py-20">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  const translation = blog.blog_translations[0];

  if (!translation) {
    return null;
  }

  return (
    <Container className="z-4 text-text mt-25">
      <div className="rounded-3xl">
        <img
          src={blog.cover_image}
          alt={translation.title}
          className="md:h-130 w-full"
        />
      </div>

      {/* Meta */}
      <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
        <span>{blog.author}</span>

        <span>•</span>

        <time dateTime={blog.published_at}>
          {new Date(blog.published_at).toLocaleDateString(
            i18n.language === "fa" ? "fa-IR" : "en-US"
          )}
        </time>
      </div>

      <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
        {translation.title}
      </h1>

      {/* Excerpt */}
      {translation.excerpt && (
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          {translation.excerpt}
        </p>
      )}

      <div
        className="prose prose-lg mt-10 max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{
          __html: translation.content,
        }}
      />
    </Container>
  );
};

export default BlogDetails;
