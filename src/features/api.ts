import { supabase } from "@/hooks/lib/supabace";

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
      `
      category_id,
      label:name,
      categories!inner (
        slug,
        is_deleted
      )
    `
    )
    .eq("language_id", languageId)
    .eq("categories.is_deleted", false);

  if (error) throw error;

  return data as unknown as Filter[];
}

export async function getProjects() {
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
    .eq("is_deleted", false);

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
    .eq("is_deleted", false)
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

export async function getBlogs(languageId: number): Promise<Blog[]> {
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
    .eq("is_deleted", false)
    .eq("blog_translations.language_id", languageId);

  if (error) throw error;

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
    .eq("is_deleted", false)
    .eq("blog_translations.language_id", languageId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching blog:", error);
    return null;
  }

  return data as Blog | null;
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
    .eq("is_deleted", false)
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching admin projects:", error);
    throw error;
  }

  return data;
}

export async function getDashboardStats() {
  const [projectsResult, blogsResult, categoriesResult] = await Promise.all([
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("is_deleted", false),

    supabase
      .from("blog")
      .select("id", { count: "exact", head: true })
      .eq("is_deleted", false),

    supabase
      .from("categories")
      .select("id", { count: "exact", head: true })
      .eq("is_deleted", false),
  ]);

  if (projectsResult.error) throw projectsResult.error;
  if (blogsResult.error) throw blogsResult.error;
  if (categoriesResult.error) throw categoriesResult.error;

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
      categories!inner (
        slug,
        is_deleted
      )
    `
    )
    .eq("language_id", languageId)
    .eq("categories.is_deleted", false);

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
      .eq("is_deleted", false)
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

export async function deleteAdminProject(projectId: number): Promise<void> {
  const { data, error } = await supabase
    .from("projects")
    .update({ is_deleted: true })
    .eq("id", projectId)
    .eq("is_deleted", false)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Error soft deleting project:", error);
    throw error;
  }

  if (!data) {
    throw new Error("PROJECT_NOT_FOUND_OR_ALREADY_DELETED");
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
    .eq("is_deleted", false)
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
    .eq("is_deleted", false)
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

  if (categoryError) throw categoryError;

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
    .eq("id", category.id)
    .eq("is_deleted", false);

  if (categoryError) throw categoryError;

  for (const translation of [
    { language_id: 1, name: category.nameEn },
    { language_id: 2, name: category.nameFa },
  ]) {
    const { error } = await supabase
      .from("category_translations")
      .update({ name: translation.name })
      .eq("category_id", category.id)
      .eq("language_id", translation.language_id);

    if (error) throw error;
  }
}

export async function deleteAdminCategory(categoryId: number): Promise<void> {
  const { count, error: projectsError } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("category_id", categoryId)
    .eq("is_deleted", false);

  if (projectsError) throw projectsError;

  if ((count ?? 0) > 0) {
    throw new Error("CATEGORY_HAS_PROJECTS");
  }

  const { data, error } = await supabase
    .from("categories")
    .update({ is_deleted: true })
    .eq("id", categoryId)
    .eq("is_deleted", false)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    throw new Error("CATEGORY_NOT_FOUND_OR_ALREADY_DELETED");
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

export type AdminBlogCategory = {
  id: number;
  slug: string;
  blog_category_translations: {
    id: number;
    category_blog_id: number;
    language_id: number;
    name: string;
  }[];
};

export async function getAdminBlogCategories(): Promise<AdminBlogCategory[]> {
  const { data, error } = await supabase
    .from("blog_categories")
    .select(
      `
      id,
      slug,
      blog_category_translations (
        id,
        category_blog_id,
        language_id,
        name
      )
    `
    )
    .eq("is_deleted", false)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching blog categories:", error);
    throw error;
  }

  return data as AdminBlogCategory[];
}

export async function createAdminBlogCategory(category: {
  slug: string;
  nameEn: string;
  nameFa: string;
}) {
  const slug = category.slug.trim();
  const nameEn = category.nameEn.trim();
  const nameFa = category.nameFa.trim();

  if (!slug || !nameEn || !nameFa) {
    throw new Error("BLOG_CATEGORY_FIELDS_REQUIRED");
  }

  const { data: createdCategory, error: categoryError } = await supabase
    .from("blog_categories")
    .insert({ slug })
    .select("id, slug")
    .single();

  if (categoryError) throw categoryError;

  const { error: translationsError } = await supabase
    .from("blog_category_translations")
    .insert([
      {
        category_blog_id: createdCategory.id,
        language_id: 1,
        name: nameEn,
      },
      {
        category_blog_id: createdCategory.id,
        language_id: 2,
        name: nameFa,
      },
    ]);

  if (translationsError) {
    const { error: rollbackError } = await supabase
      .from("blog_categories")
      .delete()
      .eq("id", createdCategory.id);

    if (rollbackError) {
      console.error("Failed to roll back blog category:", rollbackError);
    }

    throw translationsError;
  }

  return createdCategory;
}

export async function updateAdminBlogCategory(category: {
  id: number;
  slug: string;
  nameEn: string;
  nameFa: string;
}) {
  const slug = category.slug.trim();
  const nameEn = category.nameEn.trim();
  const nameFa = category.nameFa.trim();

  if (!slug || !nameEn || !nameFa) {
    throw new Error("BLOG_CATEGORY_FIELDS_REQUIRED");
  }

  const { error: categoryError } = await supabase
    .from("blog_categories")
    .update({ slug })
    .eq("id", category.id)
    .eq("is_deleted", false);

  if (categoryError) throw categoryError;

  for (const translation of [
    { language_id: 1, name: nameEn },
    { language_id: 2, name: nameFa },
  ]) {
    const { data: existing, error: fetchError } = await supabase
      .from("blog_category_translations")
      .select("id")
      .eq("category_blog_id", category.id)
      .eq("language_id", translation.language_id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existing) {
      const { error } = await supabase
        .from("blog_category_translations")
        .update({ name: translation.name })
        .eq("id", existing.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("blog_category_translations")
        .insert({
          category_blog_id: category.id,
          language_id: translation.language_id,
          name: translation.name,
        });

      if (error) throw error;
    }
  }
}

export async function deleteAdminBlogCategory(
  categoryId: number
): Promise<void> {
  const { count, error: blogsError } = await supabase
    .from("blog")
    .select("id", { count: "exact", head: true })
    .eq("category_blog_id", categoryId)
    .eq("is_deleted", false);

  if (blogsError) throw blogsError;

  if ((count ?? 0) > 0) {
    throw new Error("BLOG_CATEGORY_HAS_POSTS");
  }

  const { data, error } = await supabase
    .from("blog_categories")
    .update({ is_deleted: true })
    .eq("id", categoryId)
    .eq("is_deleted", false)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    throw new Error("BLOG_CATEGORY_NOT_FOUND_OR_ALREADY_DELETED");
  }
}

export type AdminBlog = {
  id: number;
  slug: string;
  cover_image: string;
  author: string;
  published_at: string;
  category_blog_id: number;
  blog_translations: BlogTranslation[];
  blog_categories: {
    id: number;
    slug: string;
    blog_category_translations: {
      id: number;
      category_blog_id: number;
      language_id: number;
      name: string;
    }[];
  } | null;
};

export async function getAdminBlogs(): Promise<AdminBlog[]> {
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
      ),
      blog_categories (
        id,
        slug,
        blog_category_translations (
          id,
          category_blog_id,
          language_id,
          name
        )
      )
    `
    )
    .eq("is_deleted", false)
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching admin blogs:", error);
    throw error;
  }

  return data as unknown as AdminBlog[];
}

export type AdminBlogTranslationInput = {
  title: string;
  excerpt: string;
  content: string;
};

export type AdminBlogInput = {
  slug: string;
  cover_image: string;
  author: string;
  published_at: string;
  category_blog_id: number;
  translations: {
    en: AdminBlogTranslationInput;
    fa: AdminBlogTranslationInput;
  };
};

export function getBlogImage(path: string) {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const { data } = supabase.storage.from("blog-images").getPublicUrl(path);

  return data.publicUrl;
}

export async function uploadBlogImage(
  file: File,
  slug = "blog"
): Promise<{ path: string; publicUrl: string }> {
  if (!file.type.startsWith("image/")) {
    throw new Error("INVALID_BLOG_IMAGE");
  }

  const safeName = file.name.normalize("NFKD").replace(/[^a-zA-Z0-9.-]/g, "-");

  const safeSlug = slug.trim().replace(/[^a-zA-Z0-9-]/g, "-") || "blog";

  const filePath = `${safeSlug}/${Date.now()}-${safeName}`;

  const { data, error } = await supabase.storage
    .from("blog-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading blog image:", error);
    throw error;
  }

  return {
    path: data.path,
    publicUrl: getBlogImage(data.path),
  };
}

export async function getAdminBlogById(blogId: number): Promise<AdminBlog> {
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
      ),
      blog_categories (
        id,
        slug,
        blog_category_translations (
          id,
          category_blog_id,
          language_id,
          name
        )
      )
    `
    )
    .eq("id", blogId)
    .eq("is_deleted", false)
    .single();

  if (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }

  return data as unknown as AdminBlog;
}

export async function createAdminBlog(blog: AdminBlogInput): Promise<number> {
  const { data: createdBlog, error: blogError } = await supabase
    .from("blog")
    .insert({
      slug: blog.slug,
      cover_image: blog.cover_image,
      author: blog.author,
      published_at: blog.published_at,
      category_blog_id: blog.category_blog_id,
    })
    .select("id")
    .single();

  if (blogError) {
    console.error("Error creating blog:", blogError);
    throw blogError;
  }

  const { error: translationsError } = await supabase
    .from("blog_translations")
    .insert([
      {
        blog_id: createdBlog.id,
        language_id: 1,
        title: blog.translations.en.title,
        excerpt: blog.translations.en.excerpt,
        content: blog.translations.en.content,
      },
      {
        blog_id: createdBlog.id,
        language_id: 2,
        title: blog.translations.fa.title,
        excerpt: blog.translations.fa.excerpt,
        content: blog.translations.fa.content,
      },
    ]);

  if (translationsError) {
    console.error("Error creating blog translations:", translationsError);

    // Rollback only because creation of the article was incomplete.
    const { error: rollbackError } = await supabase
      .from("blog")
      .delete()
      .eq("id", createdBlog.id);

    if (rollbackError) {
      console.error("Failed to roll back blog:", rollbackError);
    }

    throw translationsError;
  }

  return createdBlog.id;
}

export async function updateAdminBlog(
  blogId: number,
  blog: AdminBlogInput
): Promise<void> {
  const { data: updatedBlog, error: blogError } = await supabase
    .from("blog")
    .update({
      slug: blog.slug,
      cover_image: blog.cover_image,
      author: blog.author,
      published_at: blog.published_at,
      category_blog_id: blog.category_blog_id,
    })
    .eq("id", blogId)
    .eq("is_deleted", false)
    .select("id")
    .maybeSingle();

  if (blogError) {
    console.error("Error updating blog:", blogError);
    throw blogError;
  }

  if (!updatedBlog) {
    throw new Error("BLOG_NOT_FOUND_OR_ALREADY_DELETED");
  }

  for (const translation of [
    {
      language_id: 1,
      ...blog.translations.en,
    },
    {
      language_id: 2,
      ...blog.translations.fa,
    },
  ]) {
    const { data: existing, error: fetchError } = await supabase
      .from("blog_translations")
      .select("id")
      .eq("blog_id", blogId)
      .eq("language_id", translation.language_id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existing) {
      const { error } = await supabase
        .from("blog_translations")
        .update({
          title: translation.title,
          excerpt: translation.excerpt,
          content: translation.content,
        })
        .eq("id", existing.id);

      if (error) throw error;
    } else {
      const { error } = await supabase.from("blog_translations").insert({
        blog_id: blogId,
        language_id: translation.language_id,
        title: translation.title,
        excerpt: translation.excerpt,
        content: translation.content,
      });

      if (error) throw error;
    }
  }
}

export async function deleteAdminBlog(blogId: number): Promise<void> {
  const { data, error } = await supabase
    .from("blog")
    .update({ is_deleted: true })
    .eq("id", blogId)
    .eq("is_deleted", false)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Error soft deleting blog:", error);
    throw error;
  }

  if (!data) {
    throw new Error("BLOG_NOT_FOUND_OR_ALREADY_DELETED");
  }
}

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  project_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export async function getAdminContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from("contact_messages")
    .select(
      `
      id,
      name,
      email,
      project_type,
      message,
      is_read,
      created_at
    `
    )
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching contact messages:", error);
    throw error;
  }

  return data as ContactMessage[];
}

export async function markContactMessageAsRead(
  messageId: string,
  isRead: boolean
): Promise<void> {
  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: isRead })
    .eq("id", messageId)
    .eq("is_deleted", false);

  if (error) {
    console.error("Error updating contact message:", error);
    throw error;
  }
}

export async function deleteContactMessage(messageId: string): Promise<void> {
  const { data, error } = await supabase
    .from("contact_messages")
    .update({ is_deleted: true })
    .eq("id", messageId)
    .eq("is_deleted", false)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Error soft deleting contact message:", error);
    throw error;
  }

  if (!data) {
    throw new Error("CONTACT_MESSAGE_NOT_FOUND_OR_ALREADY_DELETED");
  }
}
