import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { Blog } from "@/features/api";
import { getBlogBySlug, getBlogImage } from "@/features/api";
import Container from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

const BlogDetailsSkeleton = () => (
  <Container className="z-4 mt-25 text-text">
    <div className="space-y-8">
      {/* Cover */}
      <Skeleton className="aspect-video w-full rounded-3xl md:aspect-[16/7]" />

      {/* Author and date */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-1 w-1 rounded-full" />
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Title */}
      <div className="space-y-3">
        <Skeleton className="h-9 w-full md:h-12" />
        <Skeleton className="h-9 w-4/5 md:h-12" />
      </div>

      {/* Excerpt */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-5 w-3/4" />
      </div>

      {/* Article content */}
      <div className="space-y-4 pt-4">
        <Skeleton className="h-7 w-2/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-4/5" />

        <Skeleton className="mt-6 h-7 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  </Container>
);

const BlogDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const languageId = i18n.language.startsWith("fa") ? 2 : 1;
  const isPersian = languageId === 2;

  useEffect(() => {
    let cancelled = false;

    const fetchBlog = async () => {
      setLoading(true);
      setError(false);
      setBlog(null);

      if (!slug) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const data = await getBlogBySlug(slug, languageId);

        if (cancelled) return;

        if (!data) {
          setError(true);
          return;
        }

        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog:", error);

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchBlog();

    return () => {
      cancelled = true;
    };
  }, [slug, languageId]);

  if (loading) {
    return <BlogDetailsSkeleton />;
  }

  if (error || !blog) {
    return (
      <Container className="z-4 mt-25 text-text">
        <div className="py-20 text-center">
          <h1 className="text-2xl font-semibold">
            {isPersian ? "مقاله پیدا نشد" : "Article not found"}
          </h1>

          <p className="mt-3 text-muted-foreground">
            {isPersian
              ? "دریافت مقاله با خطا مواجه شد یا این مقاله وجود ندارد."
              : "We couldn't load this article, or it doesn't exist."}
          </p>
        </div>
      </Container>
    );
  }

  const translation = blog.blog_translations[0];

  if (!translation) {
    return null;
  }

  return (
    <Container className="z-4 mt-25 text-text">
      <article>
        <div className="overflow-hidden rounded-3xl">
          <img
            src={getBlogImage(blog.cover_image)}
            alt={translation.title}
            className="max-h-[650px] min-h-[220px] w-full object-cover md:min-h-[400px]"
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{blog.author}</span>
          <span aria-hidden="true">•</span>

          <time dateTime={blog.published_at}>
            {new Date(blog.published_at).toLocaleDateString(
              isPersian ? "fa-IR" : "en-US"
            )}
          </time>
        </div>

        <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
          {translation.title}
        </h1>

        {translation.excerpt && (
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {translation.excerpt}
          </p>
        )}

        <div
          dir={isPersian ? "rtl" : "ltr"}
          className="blog-content mt-8"
          dangerouslySetInnerHTML={{
            __html: translation.content,
          }}
        />
      </article>
    </Container>
  );
};

export default BlogDetails;
