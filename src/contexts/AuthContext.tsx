import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api, type AuthUser, type ProfilePatch, type SignUpInput } from '../lib/api';
import type { Profile } from '../types';

interface AuthState {
  /** True until the stored session has been checked on startup. */
  loading: boolean;
  user: AuthUser | null;
  profile: Profile | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (patch: ProfilePatch) => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const queryClient = useQueryClient();
  const currentId = useRef<string | null>(null);

  const applyUser = useCallback(
    async (u: AuthUser | null) => {
      currentId.current = u?.id ?? null;
      setUser(u);
      setProfile(u ? await api.getProfile(u.id).catch(() => null) : null);
      // Product visibility depends on role (admins also see drafts), so refetch.
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    [queryClient]
  );

  useEffect(() => {
    let alive = true;
    api
      .getUser()
      .then((u) => (alive ? applyUser(u) : undefined))
      .finally(() => alive && setLoading(false));
    const unsubscribe = api.onAuthChange((u) => {
      // Supabase fires this for token refreshes too; only react to identity changes.
      // Deferred because Supabase calls made inside its auth callback can deadlock.
      window.setTimeout(() => {
        if (alive && (u?.id ?? null) !== currentId.current) void applyUser(u);
      }, 0);
    });
    return () => {
      alive = false;
      unsubscribe();
    };
  }, [applyUser]);

  const value = useMemo<AuthState>(
    () => ({
      loading,
      user,
      profile,
      isAdmin: profile?.role === 'admin',
      signIn: async (email, password) => {
        await api.signIn(email, password);
        await applyUser(await api.getUser());
      },
      signUp: async (input) => {
        const res = await api.signUp(input);
        if (!res.needsConfirmation) await applyUser(await api.getUser());
        return res;
      },
      signOut: async () => {
        await api.signOut();
        queryClient.removeQueries({ queryKey: ['wishlist'] });
        queryClient.removeQueries({ queryKey: ['lists'] });
        queryClient.removeQueries({ queryKey: ['enquiries'] });
        await applyUser(null);
      },
      updateProfile: async (patch) => {
        if (!user) throw new Error('Not signed in');
        setProfile(await api.updateProfile(user.id, patch));
      }
    }),
    [loading, user, profile, applyUser, queryClient]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
