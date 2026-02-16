import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FarmFormData {
  collectionId: string;
  collectionName: string;
  id: string;
  REGA: string;
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
  REGA: "",
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
      setFarms: (farms) => {
        console.log('🗄️ setFarms llamado con:', {
          count: farms.length,
          firstFarmId: farms[0]?.id,
          firstFarmName: farms[0]?.farm_name,
          hasId: !!farms[0]?.id
        });
        set({
          farms: farms,
        });
        console.log('✅ Granjas guardadas en store');
      },

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
      setCurrentFarm: (farm) => {
        console.log('🎯 setCurrentFarm llamado con:', {
          id: farm?.id,
          farm_name: farm?.farm_name,
          REGA: farm?.REGA,
          hasId: !!farm?.id,
          isNull: farm === null
        });
        set({
          currentFarm: farm,
        });
        console.log('✅ CurrentFarm guardado. Verificando store...');
        const state = get();
        console.log('🔍 CurrentFarm en store:', {
          id: state.currentFarm?.id,
          hasId: !!state.currentFarm?.id
        });
      },

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
        return get().farms.find((farm) => farm.REGA === rega);
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
      onRehydrateStorage: () => {
        console.log('💾 Rehydrating farm store from localStorage...');
        return (state, error) => {
          if (error) {
            console.error('❌ Error al rehydratar farm store:', error);
          } else {
            console.log('✅ Farm store rehydrated:', {
              farmsCount: state?.farms.length || 0,
              hasCurrentFarm: !!state?.currentFarm,
              currentFarmId: state?.currentFarm?.id,
              currentFarmName: state?.currentFarm?.farm_name
            });
          }
        };
      },
    }
  )
);

// Log inicial del estado
console.log('🏁 Farm store initialized:', {
  farmsCount: useFarmFormStore.getState().farms.length,
  hasCurrentFarm: !!useFarmFormStore.getState().currentFarm,
  currentFarmId: useFarmFormStore.getState().currentFarm?.id
});

export default useFarmFormStore;