export interface Publication {
  id: string;
  slug: string;
  title: string;
  authors: string[];
  publisher: string;
  excerpt: string;
  keywords: string[];
  open_access: boolean;
  link: string;
}
