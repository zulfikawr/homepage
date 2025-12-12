export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt?: number;
  likes?: number;
  replies?: Record<string, Comment>;
  likedBy?: Record<string, boolean>;
  path?: string; // Full database path for replies or actions
  parentId?: string; // ID of parent comment if this is a reply
  avatarUrl?: string;
}
