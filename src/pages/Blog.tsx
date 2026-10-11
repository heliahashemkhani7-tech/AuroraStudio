import Container from "@/components/layout/Container";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getBlogs, type Blog as BlogType } from "@/features/api";
import BlogCard from "@/components/blog/BlogCard";
import BlogSkeleton from "@/components/skeleton/BlogSkeleton";

const Blog = () => {
  const { t, i18n } = useTranslation();

  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadBlogs = async () => {
      setIsLoading(true);
      setError(false);

      try {
        const languageId = i18n.language === "fa" ? 2 : 1;
        const data = await getBlogs(languageId);

        if (isActive) {
          setBlogs(data);
        }
      } catch (error) {
        console.error("Error loading blogs:", error);

        if (isActive) {
          setError(true);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadBlogs();

    return () => {
      isActive = false;
    };
  }, [i18n.language]);

  if (isLoading) {
    return <BlogSkeleton />;
  }

  return (
    <Container className="z-4 text-text mt-30">
      <section>
        <p className="mb-3 text-sm uppercase">{t("blog.label")}</p>

        <h1 className="text-4xl font-semibold md:text-6xl">
          {t("blog.title")}
        </h1>

        <p className="mt-4 max-w-2xl">{t("blog.description")}</p>
      </section>

      {error ? (
        <p className="mt-12 text-center">
          {t(
            "blog.error",
            "مشکلی در دریافت مقالات پیش آمد. لطفاً دوباره تلاش کنید."
          )}
        </p>
      ) : (
        <section className="mt-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
};

export default Blog;
