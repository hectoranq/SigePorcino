import { create } from 'zustand';

interface FarmFormData {
  rega: string;
  farm_name: string;
  locality: string;
  province: string;
  address: string;
  species: string;
  group: string;
  zootechnical_classification: string;
  health_qualification: string;
}

interface FarmFormStore {
  formData: FarmFormData;
  setFormData: (data: Partial<FarmFormData>) => void;
  resetForm: () => void;
}

const useFarmFormStore = create<FarmFormStore>((set) => ({
  formData: {
    rega: "",
    farm_name: "",
    locality: "",
    province: "",
    address: "",
    species: "",
    group: "",
    zootechnical_classification: "",
    health_qualification: "",
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
        rega: "",
        farm_name: "",
        locality: "",
        province: "",
        address: "",
        species: "",
        group: "",
        zootechnical_classification: "",
        health_qualification: "",
      },
    }),
}));

export default useFarmFormStore;