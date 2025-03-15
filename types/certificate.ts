export interface Certificate {
  id: string;
  title: string;
  issuedBy: string;
  dateIssued: string;
  credentialId: string;
  imageUrl: string;
  organizationLogoUrl?: string;
  link: string;
}
