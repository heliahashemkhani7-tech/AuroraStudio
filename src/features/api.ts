import { supabase } from "@/lib/supabace";

type Filter = {
  category_id: number;
  label: string;
  categories: {
    slug: string;
  }[];
};

export type BlogTranslation = {
  id: number;
  blog_id: number;
  language_id: number;
  title: string;
  excerpt: string;
  content: string;
};

export type Blog = {
  id: number;
  slug: string;
  cover_image: string;
  author: string;
  published_at: string;
  category_blog_id: number;
  blog_translations: BlogTranslation[];
};

export async function getCategories(languageId: number): Promise<Filter[]> {
  const { data, error } = await supabase
    .from("category_translations")
    .select(
      `      category_id,
      label:name,
      categories (
        slug
      )
    `
    )
    .eq("language_id", languageId);

  if (error) {
    throw error;
  }

  return data as Filter[];
}
export async function getProjects() {
  const { data, error } = await supabase.from("projects").select(`
      *,
      project_translations (*),
      categories (
        *,
        category_translations (*)
      )
    `);

  if (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }

  return data;
}

export function getProjectImage(path: string) {
  const { data } = supabase.storage.from("project-images").getPublicUrl(path);

  return data.publicUrl;
}

export async function getProjectBySlug(slug: string) {
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_translations (*),
      categories (
        *,
        category_translations (*)
      )
    `
    )
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    throw error;
  }

  return data;
}

export async function getProjectTitles(languageId: number) {
  const { data, error } = await supabase
    .from("project_titles")
    .select("*")
    .eq("language_id", languageId)
    .single();

  if (error) {
    console.error("Error fetching project titles:", error);
    throw error;
  }

  return data;
}

export async function getProjectCard(projectId: number, languageId: number) {
  const { data, error } = await supabase
    .from("project_card")
    .select("*")
    .eq("project_id", projectId)
    .eq("language_id", languageId)
    .order("id");

  if (error) {
    console.error("Error fetching project card:", error);
    throw error;
  }

  return data;
}

export async function getBlogs(languageId: number) {
  const { data, error } = await supabase
    .from("blog")
    .select(
      `
      id,
      slug,
      cover_image,
      author,
      published_at,
      category_blog_id,
      blog_translations (
        id,
        blog_id,
        language_id,
        title,
        excerpt,
        content
      )
    `
    )
    .eq("blog_translations.language_id", languageId);

  if (error) {
    throw error;
  }

  return data as Blog[];
}

export const getBlogBySlug = async (
  slug: string,
  languageId: number
): Promise<Blog | null> => {
  const { data, error } = await supabase
    .from("blog")
    .select(
      `
      id,
      slug,
      cover_image,
      author,
      published_at,
      category_blog_id,
      blog_translations (
        id,
        blog_id,
        language_id,
        title,
        excerpt,
        content
      )
    `
    )
    .eq("slug", slug)
    .eq("blog_translations.language_id", languageId)
    .single();

  if (error) {
    console.error("Error fetching blog:", error);
    return null;
  }

  return data;
};
