export interface Book {
  id: string;
  slug: string;
  type: 'currently_reading' | 'read' | 'to_read';
  title: string;
  author: string;
  image: string;
  image_url: string;
  link: string;
  date_added: string;
}
