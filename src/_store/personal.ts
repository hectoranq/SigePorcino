import { create } from 'zustand';

interface PersonalInfoData {
  dni: string;
  name: string;
  surname: string;
  locality: string;
  province: string;
  address: string;
  postal_code: string;
  phone_code: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface PersonalInfoStore {
  formData: PersonalInfoData;
  setFormData: (data: Partial<PersonalInfoData>) => void;
  resetForm: () => void;
}

const usePersonalInfoStore = create<PersonalInfoStore>((set) => ({
  formData: {
    dni: '',
    name: '',
    surname: '',
    locality: '',
    province: '',
    address: '',
    postal_code: '',
    phone_code: '',
    email: '',
    password: '',
    passwordConfirm: '',
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
        dni: '',
        name: '',
        surname: '',
        locality: '',
        province: '',
        address: '',
        postal_code: '',
        phone_code: '',
        email: '',
        password: '',
        passwordConfirm: '',
      },
    }),
}));

export default usePersonalInfoStore;