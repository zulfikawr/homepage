export interface Employment {
  id: string;
  slug: string;
  organization: string;
  organization_industry?: string;
  job_title: string;
  job_type: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';
  responsibilities: string[];
  date_string: string;
  organization_logo?: string;
  organization_logo_url?: string;
  organization_location?: string;
}
