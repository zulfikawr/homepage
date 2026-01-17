export interface Certificate {
  id: string;
  slug: string;
  title: string;
  issuedBy: string;
  dateIssued: string;
  credentialId: string;
  image?: string;
  imageUrl: string;
  organizationLogo?: string;
  organizationLogoUrl?: string;
  link: string;
}
