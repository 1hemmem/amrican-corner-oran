export interface Blog {
  id: string;
  blog_cover_url?: string;
  title: string;
  content?: any; // optional and can hold any JSON structure
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
