import { create } from 'zustand';
import { UserFormData } from '../types/UserFormData'; // ajusta la ruta si es necesario

interface UserFormStore {
  formData: UserFormData;
  setFormData: (data: Partial<UserFormData>) => void;
  resetForm: () => void;
}

const useUserFormStore = create<UserFormStore>((set) => ({
  formData: {
    email: '',
    password: '',
    companyName: '',
    cif: '',
    city: '',
    province: '',
    address: '',
    postalCode: '',
    phoneNumber: '',
    acceptTerms: false,
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
        companyName: '',
        cif: '',
        city: '',
        province: '',
        address: '',
        postalCode: '',
        phoneNumber: '',
        acceptTerms: false,
      },
    }),
}));

export default useUserFormStore;



