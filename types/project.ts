export interface Project {
  id: string;
  name: string;
  dateString: string;
  image: string;
  image_url?: string;
  description: string;
  tools: string[];
  readme?: string;
  status: 'inProgress' | 'completed' | 'upcoming';
  link?: string;
  favicon?: string;
  favicon_url?: string;
  pinned?: boolean;
  slug: string;
  githubRepoUrl?: string;
}
