export interface Post {
  id: string;
  image?: string;
  image_url?: string;
  title?: string;
  excerpt?: string;
  categories?: string[];
  dateString?: string;
  content?: string;
  audio?: string;
  audio_url?: string;
  slug?: string;
}
