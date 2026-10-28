export type Availability = 'Ready Stock' | 'Made to Order';
export type Role = 'customer' | 'admin';
export type EnquiryStatus = 'New' | 'Contacted' | 'Closed';

export interface Spec {
  label: string;
  value: string;
}

export interface ProductImage {
  id: string;
  url: string;
  /** Path inside the product-images bucket; null for bundled seed images. */
  storagePath: string | null;
  sortOrder: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  sortOrder: number;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  imageUrl: string | null;
  sortOrder: number;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string;
  categoryId: string | null;
  collectionId: string | null;
  style: string;
  metal: string;
  purity: string;
  weightMin: number | null;
  weightMax: number | null;
  stone: string;
  size: string;
  availability: Availability;
  price: number | null;
  showPrice: boolean;
  specifications: Spec[];
  isNew: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  views: number;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

/** Shape the admin product form submits. Images are the final ordered list. */
export type ProductInput = Omit<Product, 'id' | 'views' | 'images' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  images: { url: string; storagePath: string | null }[];
};

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  city: string;
  role: Role;
  createdAt: string;
}

export interface SavedList {
  id: string;
  name: string;
  occasion: string;
  note: string;
  productIds: string[];
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  userId: string | null;
  productId: string | null;
  name: string;
  phone: string;
  email: string;
  size: string;
  quantity: number;
  message: string;
  status: EnquiryStatus;
  adminNote: string;
  createdAt: string;
}

export type EnquiryInput = Pick<
  Enquiry,
  'productId' | 'name' | 'phone' | 'email' | 'size' | 'quantity' | 'message'
>;

export interface AdminStats {
  products: number;
  published: number;
  customers: number;
  enquiriesOpen: number;
  wishlistAdds: number;
  totalViews: number;
  topWishlisted: { id: string; name: string; sku: string; count: number }[];
  byCategory: { name: string; count: number }[];
}
