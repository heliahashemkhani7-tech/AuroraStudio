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
  slug: string;
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
      slug: project.slug,
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
export async function getAdminProjectById(projectId: number) {
  const [projectResult, translationsResult, cardsResult] = await Promise.all([
    supabase
      .from("projects")
      .select(
        `
          id,
          slug,
          category_id,
          live_url,
          name,
          technology,
          tech_stack,
          overview_button_link,
          highlight_links
        `
      )
      .eq("id", projectId)
      .single(),

    supabase
      .from("project_translations")
      .select(
        `
          id,
          project_id,
          language_id,
          description,
          detail,
          overview_paragraphs
        `
      )
      .eq("project_id", projectId),

    supabase
      .from("project_card")
      .select(
        `
          id,
          project_id,
          language_id,
          label,
          value
        `
      )
      .eq("project_id", projectId),
  ]);

  if (projectResult.error) throw projectResult.error;
  if (translationsResult.error) throw translationsResult.error;
  if (cardsResult.error) throw cardsResult.error;

  return {
    ...projectResult.data,
    project_translations: translationsResult.data ?? [],
    project_card: cardsResult.data ?? [],
  };
}

export async function deleteAdminProject(projectId: number) {
  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("live_url")
    .eq("id", projectId)
    .single();

  if (fetchError) {
    console.error("Error fetching project:", fetchError);
    throw fetchError;
  }

  const imagePath = project.live_url;

  if (imagePath) {
    const { error: storageError } = await supabase.storage
      .from("project-images")
      .remove([imagePath]);

    if (storageError) {
      console.error("Error deleting project image:", storageError);
      throw storageError;
    }
  }

  const { error: deleteError } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (deleteError) {
    console.error("Error deleting project:", deleteError);
    throw deleteError;
  }
}

export async function updateAdminProject(
  projectId: number,
  project: {
    slug: string;
    category_id: number;
    name: string;
    technology: string;
    live_url: string;
    tech_stack: string[];
    overview_button_link: string;
    highlight_links: string[];
  }
) {
  const { data, error } = await supabase
    .from("projects")
    .update({
      slug: project.slug,
      category_id: project.category_id,
      name: project.name,
      technology: project.technology,
      live_url: project.live_url,
      tech_stack: project.tech_stack,
      overview_button_link: project.overview_button_link,
      highlight_links: project.highlight_links,
    })
    .eq("id", projectId)
    .select()
    .single();

  if (error) {
    console.error("Error updating project:", error);
    throw error;
  }

  return data;
}

export async function uploadProjectImage(
  file: File,
  folder = "projects"
): Promise<{ path: string; publicUrl: string }> {
  const safeName = file.name.normalize("NFKD").replace(/[^a-zA-Z0-9.-]/g, "-");

  const filePath = `${folder}/${Date.now()}-${safeName}`;

  const { data, error } = await supabase.storage
    .from("project-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading project image:", error);
    throw error;
  }

  const { data: publicData } = supabase.storage
    .from("project-images")
    .getPublicUrl(data.path);

  return {
    path: data.path,
    publicUrl: publicData.publicUrl,
  };
}

export type AdminCategory = {
  id: number;
  slug: string;
  category_translations: {
    id: number;
    name: string;
    category_id: number;
    language_id: number;
  }[];
};

export async function getAdminCategoriesWithTranslations(): Promise<
  AdminCategory[]
> {
  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      id,
      slug,
      category_translations (
        id,
        name,
        category_id,
        language_id
      )
    `
    )
    .order("id", { ascending: true });

  if (error) {
    console.error("Category fetch error:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });

    throw error;
  }

  return data as AdminCategory[];
}

export async function createAdminCategory(category: {
  slug: string;
  nameEn: string;
  nameFa: string;
}) {
  const { data: createdCategory, error: categoryError } = await supabase
    .from("categories")
    .insert({ slug: category.slug })
    .select("id, slug")
    .single();

  if (categoryError) {
    throw categoryError;
  }

  const { error: translationsError } = await supabase
    .from("category_translations")
    .insert([
      {
        category_id: createdCategory.id,
        language_id: 1,
        name: category.nameEn,
      },
      {
        category_id: createdCategory.id,
        language_id: 2,
        name: category.nameFa,
      },
    ]);

  if (translationsError) {
    const { error: rollbackError } = await supabase
      .from("categories")
      .delete()
      .eq("id", createdCategory.id);

    if (rollbackError) {
      console.error("Failed to roll back category creation:", rollbackError);
    }

    throw translationsError;
  }

  return createdCategory;
}

export async function updateAdminCategory(category: {
  id: number;
  slug: string;
  nameEn: string;
  nameFa: string;
}) {
  const { error: categoryError } = await supabase
    .from("categories")
    .update({ slug: category.slug })
    .eq("id", category.id);

  if (categoryError) {
    throw categoryError;
  }

  for (const translation of [
    { language_id: 1, name: category.nameEn },
    { language_id: 2, name: category.nameFa },
  ]) {
    const { error } = await supabase
      .from("category_translations")
      .update({ name: translation.name })
      .eq("category_id", category.id)
      .eq("language_id", translation.language_id);

    if (error) {
      throw error;
    }
  }
}

export async function deleteAdminCategory(categoryId: number) {
  const { count, error: projectsError } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("category_id", categoryId);

  if (projectsError) {
    throw projectsError;
  }

  if ((count ?? 0) > 0) {
    throw new Error("CATEGORY_HAS_PROJECTS");
  }

  const { error: translationsError } = await supabase
    .from("category_translations")
    .delete()
    .eq("category_id", categoryId);

  if (translationsError) {
    throw translationsError;
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    throw error;
  }
}



export type ContactMessageInput = {
  name: string;
  email: string;
  project_type: string;
  message: string;
};

export async function submitContactMessage(
  contactMessage: ContactMessageInput
): Promise<void> {
  const { error } = await supabase.from("contact_messages").insert({
    name: contactMessage.name.trim(),
    email: contactMessage.email.trim(),
    project_type: contactMessage.project_type,
    message: contactMessage.message.trim(),
  });

  if (error) {
    console.error("Error submitting contact message:", error);
    throw error;
  }
}
