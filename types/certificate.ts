export interface Certificate {
  id: string;
  slug: string;
  title: string;
  issued_by: string;
  date_issued: string;
  credential_id: string;
  image?: string;
  image_url: string;
  organization_logo?: string;
  organization_logo_url?: string;
  link: string;
}
