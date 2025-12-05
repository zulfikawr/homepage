export interface Project {
  id: string;
  name: string;
  dateString: string;
  image: string;
  description: string;
  tools: string[];
  readme?: string;
  status: 'inProgress' | 'completed' | 'upcoming';
  link?: string;
  favicon?: string;
  pinned?: boolean;
}
