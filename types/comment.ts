export interface Comment {
  id: string;
  post_id: string;
  author: string;
  content: string;
  created_at?: number;
  likes?: number;
  replies?: Record<string, Comment>;
  liked_by?: Record<string, boolean>;
  path?: string;
  parent_id?: string;
  avatar?: string;
  avatar_url?: string;
}
