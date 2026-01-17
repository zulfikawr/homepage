export interface Book {
  id: string;
  slug: string;
  type: 'currentlyReading' | 'read' | 'toRead';
  title: string;
  author: string;
  imageURL: string;
  link: string;
  dateAdded: string;
}
