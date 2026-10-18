import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { Blog } from "@/features/api";
import { getBlogBySlug, getBlogImage } from "@/features/api";
import Container from "@/components/layout/Container";
import BlogDetailsSkeleton from "@/components/skeleton/BlogDetailsSkeleton";

const BlogDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();

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
            {t("blogDetails.notFound")}
          </h1>

          <p className="mt-3 text-muted-foreground">
            {t("blogDetails.loadError")}
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
