export type Availability = 'Ready Stock' | 'Made to Order';

export interface Product {
  id: string;
  name: string;
  category: string;
  style: string;
  metal: string;
  purity: string;
  weightMin: number;
  weightMax: number;
  images: string[];
  supplierId: string;
  availability: Availability;
  stone: string;
  size: string;
  moq: number;
  views: number;
  saves: number;
  isNew: boolean;
  trending: boolean;
  collection: string;
  description: string;
}

export interface Supplier {
  id: string;
  name: string;
  city: string;
  state: string;
  logo: string;
  verified: boolean;
  designs: number;
  categories: string[];
  rating: number;
  since: number;
  responseTime: string;
  about: string;
  cover: string;
}

export interface Category {
  slug: string;
  name: string;
  designs: number;
  image: string;
}

export interface CustomerCollection {
  id: string;
  name: string;
  customer: string;
  occasion: string;
  productIds: string[];
  note: string;
  updated: string;
  preference: string;
}

export type QuoteStatus =
'Sent' |
'Supplier Responded' |
'Negotiation' |
'Confirmed' |
'Cancelled';

export interface QuoteRequest {
  id: string;
  productId: string;
  supplierId: string;
  quantity: number;
  size: string;
  deliveryDate: string;
  notes: string;
  status: QuoteStatus;
  raised: string;
}

export type OrderStatus =
'Quote Pending' |
'Confirmed' |
'In Production' |
'Ready' |
'Shipped' |
'Delivered';

export interface Order {
  id: string;
  productId: string;
  supplierId: string;
  quantity: number;
  status: OrderStatus;
  placed: string;
  eta: string;
  value: string;
  stageIndex: number;
}