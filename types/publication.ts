export interface Publication {
  id: string;
  title: string;
  authors: string[];
  publisher: string;
  excerpt: string;
  keywords: string[];
  openAccess: boolean;
  link: string;
}
