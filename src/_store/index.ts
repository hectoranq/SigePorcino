import { create } from 'zustand';

export interface UserFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  user_type: string;
  company_name: string;
  cif: string;
  province: string;
  locality: string;
  address: string;
  postal_code: string;
  phone_number: string;
  accept_terms: boolean;
  emailVisibility: boolean;
}

interface UserFormStore {
  formData: UserFormData;
  setFormData: (data: Partial<UserFormData>) => void;
  resetForm: () => void;
}

const useUserFormStore = create<UserFormStore>((set) => ({
  formData: {
    email: '',
    password: '',
    passwordConfirm: '',
    user_type: 'company',
    company_name: '',
    cif: '',
    province: '',
    locality: '',
    address: '',
    postal_code: '',
    phone_number: '',
    accept_terms: false,
    emailVisibility: true,
  },
  setFormData: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    })),
  resetForm: () =>
    set({
      formData: {
        email: '',
        password: '',
        passwordConfirm: '',
        user_type: 'company',
        company_name: '',
        cif: '',
        province: '',
        locality: '',
        address: '',
        postal_code: '',
        phone_number: '',
        accept_terms: false,
        emailVisibility: true,
      },
    }),
}));

export default useUserFormStore;



