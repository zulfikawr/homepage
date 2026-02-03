export interface Project {
  id: string;
  name: string;
  date_string: string;
  image: string;
  image_url?: string;
  description: string;
  tools: string[];
  readme?: string;
  status: 'in_progress' | 'completed' | 'upcoming';
  link?: string;
  favicon?: string;
  favicon_url?: string;
  pinned?: boolean;
  slug: string;
  github_repo_url?: string;
}
