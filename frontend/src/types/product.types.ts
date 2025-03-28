export interface ProductImage {
  image_id: number;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  display_order?: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  images?: ProductImage[];
}