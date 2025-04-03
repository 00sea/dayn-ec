export interface ProductImage {
  image_id: number;
  image_url: string;
  alt_text?: string;
  image_type: 'primary' | 'secondary' | 'additional';
  display_order: number;
}

export interface ProductSize {
  size_id: number;
  size_name: string;
  size_code: string;
  display_order: number;
}

export interface ProductVariant {
  variant_id: number;
  size: ProductSize;
  price_adjustment: number;
  stock_quantity: number;
  is_active: boolean;
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
  sizePolicy: 'single' | 'multiple';
  stockQuantity: number; // Only used for single-size products
  variants?: ProductVariant[]; // Only used for multiple-size products
  hasSizes: boolean;
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
  onAddToCart?: (product: Product, size?: ProductSize) => void;
}