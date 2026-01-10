import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserRecord {
  accept_terms: boolean;
  address: string;
  avatar: string;
  cif: string;
  collectionId: string;
  collectionName: string;
  company_name: string;
  created: string;
  dni: string;
  email: string;
  emailVisibility: boolean;
  first_name: string;
  id: string;
  last_name: string;
  locality: string;
  phone_number: string;
  postal_code: string;
  province: string;
  type_user: string;
  updated: string;
  verified: boolean;
}

interface UserStore {
  record: UserRecord;
  token: string;
  tokenExpiration: number; // Timestamp de expiración del token
  setUser: (record: Partial<UserRecord>, token: string) => void;
  resetUser: () => void;
  isTokenValid: () => boolean;
}

const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      record: {
        accept_terms: false,
        address: '',
        avatar: '',
        cif: '',
        collectionId: '',
        collectionName: '',
        company_name: '',
        created: '',
        dni: '',
        email: '',
        emailVisibility: false,
        first_name: '',
        id: '',
        last_name: '',
        locality: '',
        phone_number: '',
        postal_code: '',
        province: '',
        type_user: '',
        updated: '',
        verified: false,
      },
      token: '',
      tokenExpiration: 0,
      setUser: (record, token) => {
        // Establecer expiración del token a 24 horas desde ahora
        const expirationTime = Date.now() + (24 * 60 * 60 * 1000); // 24 horas en milisegundos
        set((state) => ({
          record: { ...state.record, ...record },
          token,
          tokenExpiration: expirationTime,
        }));
      },
      isTokenValid: () => {
        const state = get();
        return state.token !== '' && Date.now() < state.tokenExpiration;
      },
      resetUser: () =>
        set({
          record: {
            accept_terms: false,
            address: '',
            avatar: '',
            cif: '',
            collectionId: '',
            collectionName: '',
            company_name: '',
            created: '',
            dni: '',
            email: '',
            emailVisibility: false,
            first_name: '',
            id: '',
            last_name: '',
            locality: '',
            phone_number: '',
            postal_code: '',
            province: '',
            type_user: '',
            updated: '',
            verified: false,
          },
          token: '',
          tokenExpiration: 0,
        }),
    }),
    {
      name: "user-storage", // clave en localStorage
    }
  )
);

export default useUserStore;