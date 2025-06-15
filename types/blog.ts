export interface Blog {
  id: string;
  blog_cover?: string;
  title: string;
  content?: any; // optional and can hold any JSON structure
  html?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
