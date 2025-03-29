export interface ProductImage {
  image_id: number;
  image_url: string;
  alt_text?: string;
  image_type: 'primary' | 'secondary' | 'additional';
  display_order: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;  // Primary image URL
  secondaryImage?: string;  // Secondary image URL (back view)
  category: string;
  description?: string;
  images?: ProductImage[];
}

export interface StoreGridProps {
  products?: Product[];
  title?: string;
  fetchUrl?: string;
  filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  };
  loading?: boolean;
  onAddToCart?: (product: Product) => void;
}