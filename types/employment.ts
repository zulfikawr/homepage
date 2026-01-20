export interface Employment {
  id: string;
  slug: string;
  organization: string;
  organizationIndustry?: string;
  jobTitle: string;
  jobType: 'fullTime' | 'partTime' | 'contract' | 'freelance' | 'internship';
  responsibilities: string[];
  dateString: string;
  orgLogoUrl?: string;
  orgLogo?: string;
  organizationLocation?: string;
}
