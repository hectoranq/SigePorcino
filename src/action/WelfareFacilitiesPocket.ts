import PocketBase from 'pocketbase';

// Interfaz para Instalaciones de Bienestar
export interface WelfareFacility {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  evaluation_id: string; // ID de la evaluación relacionada
  facility_name: string; // Nombre de la instalación/nave
  phase: string; // gestacion, maternidad, transicion, cebo, reposicion
  num_naves?: number;
  num_plazas?: number;
  m2_superficie: number;
  animales_alojados: number;
  densidad: number; // Calculado: animales_alojados / m2_superficie
  sensor_temperatura: boolean;
  sensor_humedad: boolean;
  sensor_co2: boolean;
  sensor_nh3: boolean;
  sensor_velocidad_aire: boolean;
  sensor_flujo_agua: boolean;
  ventilacion: string; // natural, forzada, mixta
  tipo_comida: string; // manual, automatica, mixta
  tipo_agua: string; // tipo de suministro de agua
  tipo_enriquecimiento: string; // tipo de enriquecimiento ambiental
  caudofagia_records: boolean;
  created?: string;
  updated?: string;
}

export interface CreateWelfareFacilityData {
  evaluation_id: string;
  facility_name: string;
  phase: string;
  num_naves?: number;
  num_plazas?: number;
  m2_superficie: number;
  animales_alojados: number;
  densidad: number;
  sensor_temperatura: boolean;
  sensor_humedad: boolean;
  sensor_co2: boolean;
  sensor_nh3: boolean;
  sensor_velocidad_aire: boolean;
  sensor_flujo_agua: boolean;
  ventilacion: string;
  tipo_comida: string;
  tipo_agua: string;
  tipo_enriquecimiento: string;
  caudofagia_records: boolean;
}

export interface UpdateWelfareFacilityData {
  facility_name?: string;
  phase?: string;
  num_naves?: number;
  num_plazas?: number;
  m2_superficie?: number;
  animales_alojados?: number;
  densidad?: number;
  sensor_temperatura?: boolean;
  sensor_humedad?: boolean;
  sensor_co2?: boolean;
  sensor_nh3?: boolean;
  sensor_velocidad_aire?: boolean;
  sensor_flujo_agua?: boolean;
  ventilacion?: string;
  tipo_comida?: string;
  tipo_agua?: string;
  tipo_enriquecimiento?: string;
  caudofagia_records?: boolean;
}

/**
 * Obtener instalaciones por evaluación
 */
export async function getWelfareFacilitiesByEvaluationId(
  token: string,
  evaluationId: string
): Promise<WelfareFacility[]> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const result = await pb.collection('welfare_facilities').getList(1, 50, {
      filter: `evaluation_id="${evaluationId}"`,
      sort: 'created',
      expand: 'evaluation_id',
    });

    console.log(`✅ Se encontraron ${result.totalItems} instalación(es)`);
    return result.items as WelfareFacility[];
  } catch (error: any) {
    console.error("❌ Error al obtener instalaciones:", error.message);
    return [];
  }
}

/**
 * Crear instalación
 */
export async function createWelfareFacility(
  token: string,
  data: CreateWelfareFacilityData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const newFacility = await pb.collection('welfare_facilities').create(data);

    console.log(`✅ Instalación creada exitosamente: ${newFacility.id}`);
    return {
      success: true,
      data: newFacility as WelfareFacility,
      message: 'Instalación creada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear instalación:', error);
    throw {
      success: false,
      message: error?.message || 'Error al crear instalación',
      error,
    };
  }
}

/**
 * Actualizar instalación
 */
export async function updateWelfareFacility(
  token: string,
  id: string,
  data: UpdateWelfareFacilityData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const updatedFacility = await pb.collection('welfare_facilities').update(id, data);

    console.log(`✅ Instalación actualizada exitosamente: ${updatedFacility.id}`);
    return {
      success: true,
      data: updatedFacility as WelfareFacility,
      message: 'Instalación actualizada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar instalación:', error);
    throw {
      success: false,
      message: error?.message || 'Error al actualizar instalación',
      error,
    };
  }
}

/**
 * Eliminar instalación
 */
export async function deleteWelfareFacility(token: string, id: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    await pb.collection('welfare_facilities').delete(id);

    console.log(`✅ Instalación eliminada exitosamente`);
    return {
      success: true,
      message: 'Instalación eliminada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar instalación:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar instalación',
      error,
    };
  }
}
