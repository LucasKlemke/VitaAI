// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

type Extra = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
};

// ⚠️ Durante build/SSR (Node), window não existe.
const isServer = typeof window === 'undefined';

// Storage "no-op" para Node/SSR (evita acessar window/AsyncStorage)
const noopStorage = {
  getItem: async (_key: string) => null as string | null,
  setItem: async (_key: string, _value: string) => {},
  removeItem: async (_key: string) => {},
};

// Carrega AsyncStorage só no cliente
let storage: any = noopStorage;
if (!isServer) {
  // import dinâmico evita crash no Node
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  storage = require('@react-native-async-storage/async-storage').default;
}

// Pega as variáveis (usei extra para ser consistente no Expo)
const extra = (Constants.expoConfig?.extra ?? {}) as Partial<Extra>;

const supabaseUrl =
  extra.SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey =
  extra.SUPABASE_ANON_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    persistSession: !isServer,     // desliga no build/SSR
    autoRefreshToken: !isServer,   // desliga no build/SSR
    detectSessionInUrl: false,     // RN não usa callback URL
  },
});
