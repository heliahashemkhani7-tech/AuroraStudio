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

export async function getAdminProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      id,
      category_id,
      name,
      technology,
live_url,
      tech_stack,
      overview_button_link,
      highlight_links
    `
    )
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching admin projects:", error);
    throw error;
  }

  return data;
}

export async function getDashboardStats() {
  const [projectsResult, blogsResult, categoriesResult] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),

    supabase.from("blog").select("id", { count: "exact", head: true }),

    supabase.from("categories").select("id", { count: "exact", head: true }),
  ]);

  if (projectsResult.error) {
    throw projectsResult.error;
  }

  if (blogsResult.error) {
    throw blogsResult.error;
  }

  if (categoriesResult.error) {
    throw categoriesResult.error;
  }

  return {
    projects: projectsResult.count ?? 0,
    blogs: blogsResult.count ?? 0,
    categories: categoriesResult.count ?? 0,
  };
}

export async function createAdminProject(project: {
  category_id: number;
  name: string;
  technology: string;
  live_url: string;
  tech_stack: string[];
  overview_button_link: string;
  highlight_links: string[];
}) {
  const { data, error } = await supabase
    .from("projects")
    .insert({
      category_id: project.category_id,
      name: project.name,
      technology: project.technology,
      live_url: project.live_url,
      tech_stack: project.tech_stack,
      overview_button_link: project.overview_button_link,
      highlight_links: project.highlight_links,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating project:", error);
    throw error;
  }

  return data;
}

export async function getAdminCategories(languageId: number) {
  const { data, error } = await supabase
    .from("category_translations")
    .select(
      `
      category_id,
      name,
      categories (
        id,
        slug
      )
    `
    )
    .eq("language_id", languageId);

  if (error) {
    console.error("Error fetching admin categories:", error);
    throw error;
  }

  return data;
}