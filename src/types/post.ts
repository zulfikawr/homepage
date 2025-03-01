export interface Post {
  id: string;
  type: 'text' | 'image' | 'audio';
  img?: string;
  title?: string;
  slug: string;
  excerpt?: string;
  categories?: string[];
  date?: string;
  content?: string;
  audioUrl?: string;
}
