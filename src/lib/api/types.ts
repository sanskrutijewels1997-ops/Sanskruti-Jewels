import type {
  AdminStats,
  Category,
  Enquiry,
  EnquiryInput,
  EnquiryStatus,
  Product,
  ProductInput,
  Profile,
  SavedList
} from '../../types';

export interface AuthUser {
  id: string;
  email: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export type ProfilePatch = Partial<Pick<Profile, 'fullName' | 'phone' | 'city'>>;

/**
 * Everything the UI needs from a backend. Two implementations exist:
 * - supabase.ts: the real thing (Postgres + Auth + Storage, enforced by RLS)
 * - demo.ts: a browser-local stand-in used when Supabase isn't configured
 */
export interface Backend {
  mode: 'supabase' | 'demo';

  // auth
  getUser(): Promise<AuthUser | null>;
  onAuthChange(cb: (user: AuthUser | null) => void): () => void;
  signIn(email: string, password: string): Promise<void>;
  signUp(input: SignUpInput): Promise<{ needsConfirmation: boolean }>;
  signOut(): Promise<void>;
  sendPasswordReset(email: string): Promise<void>;
  updatePassword(password: string): Promise<void>;

  // profiles
  getProfile(userId: string): Promise<Profile | null>;
  updateProfile(userId: string, patch: ProfilePatch): Promise<Profile>;
  listCustomers(): Promise<Profile[]>;
  setRole(userId: string, role: Profile['role']): Promise<void>;

  // catalogue (published only, unless the caller is an admin)
  listProducts(): Promise<Product[]>;
  listCategories(): Promise<Category[]>;
  recordView(productId: string): Promise<void>;

  // admin catalogue management
  saveProduct(input: ProductInput): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  saveCategory(input: Omit<Category, 'id'> & { id?: string }): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  uploadImage(file: Blob, folder: string): Promise<{ url: string; storagePath: string | null }>;
  removeImages(storagePaths: string[]): Promise<void>;
  adminStats(): Promise<AdminStats>;

  // wishlist
  listWishlist(userId: string): Promise<string[]>;
  setWishlisted(userId: string, productId: string, on: boolean): Promise<void>;

  // saved lists
  listSavedLists(userId: string): Promise<SavedList[]>;
  createSavedList(userId: string, name: string, occasion: string): Promise<SavedList>;
  updateSavedList(id: string, patch: Partial<Pick<SavedList, 'name' | 'occasion' | 'note'>>): Promise<void>;
  deleteSavedList(id: string): Promise<void>;
  setListItem(listId: string, productId: string, on: boolean): Promise<void>;

  // enquiries
  createEnquiry(userId: string | null, input: EnquiryInput): Promise<void>;
  listMyEnquiries(userId: string): Promise<Enquiry[]>;
  listAllEnquiries(): Promise<Enquiry[]>;
  updateEnquiry(id: string, patch: { status?: EnquiryStatus; adminNote?: string }): Promise<void>;
}
