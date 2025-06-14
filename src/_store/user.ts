import { create } from 'zustand';

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
  setUser: (record: Partial<UserRecord>, token: string) => void;
  resetUser: () => void;
}

const useUserStore = create<UserStore>((set) => ({
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
  setUser: (record, token) =>
    set((state) => ({
      record: { ...state.record, ...record },
      token,
    })),
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
    }),
}));

export default useUserStore;