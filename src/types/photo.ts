export type PhotoCategory =
  | "Street"
  | "Sunset"
  | "Portraits"
  | "Travel"
  | "Tech"
  | "Nightlife";

export interface PhotoItem {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  category: PhotoCategory;
  location?: string;
  camera?: string;
  aspectRatio?: "portrait" | "landscape" | "square";
  likes: number;
  featured?: boolean;
  createdAt: string;
}
