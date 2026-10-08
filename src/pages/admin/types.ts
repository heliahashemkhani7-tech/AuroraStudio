export type Category = {
  category_id: number;
  name: string;
};

export type ProjectFormData = {
  name: string;
  category_id: string;
  technology: string;
  live_url: string;
  tech_stack: string[];
  overview_button_link: string[];

  description_en: string;
  detail_en: string;
  overview_paragraphs_en: string;
  client_en: string;
  role_en: string;
  year_en: string;

  description_fa: string;
  detail_fa: string;
  overview_paragraphs_fa: string;
  client_fa: string;
  role_fa: string;
  year_fa: string;

  highlight_links: string[];
};
