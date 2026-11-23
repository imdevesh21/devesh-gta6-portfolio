export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  videoUrl?: string;
  category: "Architecture" | "Backend" | "Frontend" | "DevOps" | "AI & ML" | "GTA Dev Logs";
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  status: "published" | "draft";
  readingTime: string;
  views: number;
  likes: number;
  featured?: boolean;
}
