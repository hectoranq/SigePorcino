import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FarmFormData {
  collectionId: string;
  collectionName: string;
  id: string;
  rega: string;
  farm_name: string;
  locality: string;
  province: string;
  address: string;
  groups: string;
  species: string;
  zootechnical_classification: string;
  health_qualification: string;
  user: string;
  created: string;
  updated: string;
}

interface FarmFormStore {
  formData: FarmFormData;
  setFormData: (data: Partial<FarmFormData>) => void;
  resetForm: () => void;
}

const useFarmFormStore = create<FarmFormStore>()(
  persist(
    (set) => ({
      formData: {
        collectionId: "",
        collectionName: "",
        id: "",
        rega: "",
        farm_name: "",
        locality: "",
        province: "",
        address: "",
        groups: "",
        species: "",
        zootechnical_classification: "",
        health_qualification: "",
        user: "",
        created: "",
        updated: "",
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
            collectionId: "",
            collectionName: "",
            id: "",
            rega: "",
            farm_name: "",
            locality: "",
            province: "",
            address: "",
            groups: "",
            species: "",
            zootechnical_classification: "",
            health_qualification: "",
            user: "",
            created: "",
            updated: "",
          },
        }),
    }),
    {
      name: "farm-form-storage", // clave en localStorage
    }
  )
);

export default useFarmFormStore;