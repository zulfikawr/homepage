export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: number;
  likes?: number;
  replies?: Record<string, Comment>;
  parentId?: string; // ID of parent comment if this is a reply
}
