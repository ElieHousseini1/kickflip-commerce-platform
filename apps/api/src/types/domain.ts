export interface ProductDto {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  description: string;
  image: string;
  variantName: string;
  variantOptions: string[];
  colors: string[];
  variants: ProductVariantDto[];
  badge?: string;
}

export interface ProductVariantDto {
  id: string;
  name: string;
  color: string;
}

export interface CartLineDto {
  productId: string;
  variantId: string;
  quantity: number;
  selectedVariant: ProductVariantDto;
  product: ProductDto;
}

export interface SessionUserDto {
  id: string;
  name: string;
  email: string;
}
