export interface Employment {
  id: string;
  organization: string;
  organizationIndustry?: string;
  jobTitle: string;
  jobType: string;
  responsibilities: string[];
  dateString: string;
  orgLogoSrc?: string;
  organizationLocation?: string;
}
