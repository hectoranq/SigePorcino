import PocketBase from 'pocketbase';

// Interfaz para Factores de Riesgo
export interface RiskFactor {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  evaluation_id: string;
  facility_id: string;
  // Datos ambientales
  temperatura?: number;
  humedad?: number;
  co2?: number;
  nh3?: number;
  velocidad_aire?: number;
  flujo_agua?: number;
  // Evaluación de animales
  comportamiento_inactivo?: boolean;
  cojeras?: boolean;
  tos?: boolean;
  estereotipias?: boolean;
  desuniformidad?: boolean;
  lesiones_piel?: boolean;
  heridas?: boolean;
  diarrea?: boolean;
  cola_mordida?: boolean;
  orejas_mordidas?: boolean;
  // Densidad y material manipulable
  cumple_densidad?: boolean;
  material_manipulable?: boolean;
  // Estado de las instalaciones
  aspecto_estructural?: string;
  sistema_climatizacion?: string;
  limpieza_general?: string;
  // Sistemas y equipamiento
  calidad_bebederos?: string;
  calidad_comederos?: string;
  agua_disponibilidad?: string;
  // Estado sanitario
  bajas_ultimo_mes?: number;
  tratamientos_grupales_ultimo_mes?: number;
  tratamientos_individuales_ultimo_mes?: number;
  // Alimentación
  tipo_pienso?: string;
  frecuencia_suministro?: string;
  forma_suministro?: string;
  // Genética materna
  genetica_materna?: string;
  // Observaciones y cálculo
  valor_a?: number;
  valor_b?: number;
  interaction_level?: number; // Calculado: 100 * A / (A + B)
  created?: string;
  updated?: string;
}

export interface CreateRiskFactorData {
  evaluation_id: string;
  facility_id: string;
  temperatura?: number;
  humedad?: number;
  co2?: number;
  nh3?: number;
  velocidad_aire?: number;
  flujo_agua?: number;
  comportamiento_inactivo?: boolean;
  cojeras?: boolean;
  tos?: boolean;
  estereotipias?: boolean;
  desuniformidad?: boolean;
  lesiones_piel?: boolean;
  heridas?: boolean;
  diarrea?: boolean;
  cola_mordida?: boolean;
  orejas_mordidas?: boolean;
  cumple_densidad?: boolean;
  material_manipulable?: boolean;
  aspecto_estructural?: string;
  sistema_climatizacion?: string;
  limpieza_general?: string;
  calidad_bebederos?: string;
  calidad_comederos?: string;
  agua_disponibilidad?: string;
  bajas_ultimo_mes?: number;
  tratamientos_grupales_ultimo_mes?: number;
  tratamientos_individuales_ultimo_mes?: number;
  tipo_pienso?: string;
  frecuencia_suministro?: string;
  forma_suministro?: string;
  genetica_materna?: string;
  valor_a?: number;
  valor_b?: number;
  interaction_level?: number;
}

export type UpdateRiskFactorData = Partial<CreateRiskFactorData>;

/**
 * Obtener factores de riesgo por evaluación
 */
export async function getRiskFactorsByEvaluationId(
  token: string,
  evaluationId: string
): Promise<RiskFactor[]> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const result = await pb.collection('risk_factors').getList(1, 50, {
      filter: `evaluation_id="${evaluationId}"`,
      expand: 'facility_id',
    });

    console.log(`✅ Se encontraron ${result.totalItems} factor(es) de riesgo`);
    return result.items as RiskFactor[];
  } catch (error: any) {
    console.error("❌ Error al obtener factores de riesgo:", error.message);
    return [];
  }
}

/**
 * Obtener factor de riesgo por instalación
 */
export async function getRiskFactorByFacilityId(
  token: string,
  facilityId: string
): Promise<RiskFactor | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const result = await pb.collection('risk_factors').getList(1, 1, {
      filter: `facility_id="${facilityId}"`,
    });

    if (result.totalItems === 0) {
      return null;
    }

    return result.items[0] as RiskFactor;
  } catch (error: any) {
    console.error("❌ Error al obtener factor de riesgo:", error.message);
    return null;
  }
}

/**
 * Crear factor de riesgo
 */
export async function createRiskFactor(
  token: string,
  data: CreateRiskFactorData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const newRiskFactor = await pb.collection('risk_factors').create(data);

    console.log(`✅ Factor de riesgo creado exitosamente: ${newRiskFactor.id}`);
    return {
      success: true,
      data: newRiskFactor as RiskFactor,
      message: 'Factor de riesgo creado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear factor de riesgo:', error);
    throw {
      success: false,
      message: error?.message || 'Error al crear factor de riesgo',
      error,
    };
  }
}

/**
 * Actualizar factor de riesgo
 */
export async function updateRiskFactor(
  token: string,
  id: string,
  data: UpdateRiskFactorData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const updatedRiskFactor = await pb.collection('risk_factors').update(id, data);

    console.log(`✅ Factor de riesgo actualizado exitosamente: ${updatedRiskFactor.id}`);
    return {
      success: true,
      data: updatedRiskFactor as RiskFactor,
      message: 'Factor de riesgo actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar factor de riesgo:', error);
    throw {
      success: false,
      message: error?.message || 'Error al actualizar factor de riesgo',
      error,
    };
  }
}

/**
 * Eliminar factor de riesgo
 */
export async function deleteRiskFactor(token: string, id: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    await pb.collection('risk_factors').delete(id);

    console.log(`✅ Factor de riesgo eliminado exitosamente`);
    return {
      success: true,
      message: 'Factor de riesgo eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar factor de riesgo:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar factor de riesgo',
      error,
    };
  }
}
