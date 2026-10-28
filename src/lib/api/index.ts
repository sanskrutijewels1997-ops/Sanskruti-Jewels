import { createDemoBackend } from './demo';
import { createSupabaseBackend } from './supabase';
import type { Backend } from './types';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** The single backend instance for the app: Supabase when configured, demo otherwise. */
export const api: Backend = url && anonKey ? createSupabaseBackend(url, anonKey) : createDemoBackend();

export type { Backend, AuthUser, SignUpInput, ProfilePatch } from './types';
