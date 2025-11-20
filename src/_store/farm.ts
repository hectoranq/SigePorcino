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
  // Cambio principal: Array de granjas en lugar de una sola
  farms: FarmFormData[];
  
  // Granja actualmente seleccionada/en edición
  currentFarm: FarmFormData | null;
  
  // Métodos para manejar múltiples granjas
  setFarms: (farms: FarmFormData[]) => void;
  addFarm: (farm: FarmFormData) => void;
  updateFarm: (id: string, data: Partial<FarmFormData>) => void;
  deleteFarm: (id: string) => void;
  
  // Métodos para la granja actual (formulario)
  setCurrentFarm: (farm: FarmFormData | null) => void;
  setFormData: (data: Partial<FarmFormData>) => void;
  
  // Método para obtener una granja específica
  getFarmById: (id: string) => FarmFormData | undefined;
  getFarmByREGA: (rega: string) => FarmFormData | undefined;
  
  // Reset
  resetForm: () => void;
  resetAll: () => void;
}

const emptyFarm: FarmFormData = {
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
};

const useFarmFormStore = create<FarmFormStore>()(
  persist(
    (set, get) => ({
      farms: [],
      currentFarm: null,

      // Establecer todas las granjas (útil al cargar desde API)
      setFarms: (farms) =>
        set({
          farms: farms,
        }),

      // Agregar una nueva granja
      addFarm: (farm) =>
        set((state) => ({
          farms: [...state.farms, farm],
        })),

      // Actualizar una granja existente
      updateFarm: (id, data) =>
        set((state) => ({
          farms: state.farms.map((farm) =>
            farm.id === id ? { ...farm, ...data } : farm
          ),
          // Si la granja actual es la que se está actualizando, actualizarla también
          currentFarm:
            state.currentFarm?.id === id
              ? { ...state.currentFarm, ...data }
              : state.currentFarm,
        })),

      // Eliminar una granja
      deleteFarm: (id) =>
        set((state) => ({
          farms: state.farms.filter((farm) => farm.id !== id),
          // Si la granja eliminada era la actual, limpiar currentFarm
          currentFarm: state.currentFarm?.id === id ? null : state.currentFarm,
        })),

      // Establecer la granja actual (para edición/vista)
      setCurrentFarm: (farm) =>
        set({
          currentFarm: farm,
        }),

      // Actualizar datos del formulario (granja actual)
      setFormData: (data) =>
        set((state) => ({
          currentFarm: state.currentFarm
            ? { ...state.currentFarm, ...data }
            : { ...emptyFarm, ...data },
        })),

      // Obtener una granja por ID
      getFarmById: (id) => {
        return get().farms.find((farm) => farm.id === id);
      },

      // Obtener una granja por REGA
      getFarmByREGA: (rega) => {
        return get().farms.find((farm) => farm.rega === rega);
      },

      // Reset solo el formulario actual
      resetForm: () =>
        set({
          currentFarm: null,
        }),

      // Reset completo (todas las granjas y formulario)
      resetAll: () =>
        set({
          farms: [],
          currentFarm: null,
        }),
    }),
    {
      name: "farm-form-storage", // clave en localStorage
    }
  )
);

export default useFarmFormStore;