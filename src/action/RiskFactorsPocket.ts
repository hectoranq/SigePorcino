import PocketBase from 'pocketbase';

// Interfaz para Factores de Riesgo
export interface RiskFactor {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  evaluation_id: string;
  facility_id: string;
  
  // Datos de la visita
  fecha_hora?: string;
  temperatura_exterior?: number;
  humedad_exterior?: number;
  nave_evaluada?: string;
  
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
  
  // Animales evaluados - Estado de raboteo
  raboteados?: number;
  sin_rabotear?: number;
  
  // Animales evaluados - Reproductoras
  cerdas_gestantes?: number;
  cerdas_gestantes_raboteadas?: number;
  cerdas_gestantes_sin_rabotear?: number;
  cerdas_parideras?: number;
  cerdas_parideras_raboteadas?: number;
  cerdas_parideras_sin_rabotear?: number;
  lechones?: number;
  lechones_raboteados?: number;
  lechones_sin_rabotear?: number;
  
  // Animales evaluados - Por categoría
  reposicion_num?: number;
  reposicion_peso?: number;
  reposicion_rega?: string;
  reposicion_raboteados?: number;
  reposicion_sin_rabotear?: number;
  transicion_num?: number;
  transicion_peso?: number;
  transicion_rega?: string;
  transicion_raboteados?: number;
  transicion_sin_rabotear?: number;
  cebo_num?: number;
  cebo_peso?: number;
  cebo_rega?: string;
  cebo_raboteados?: number;
  cebo_sin_rabotear?: number;
  
  // Densidad y material manipulable
  cumple_densidad?: boolean;
  material_manipulable?: boolean;
  superficie_animal?: number;
  peso_medio_animales?: number;
  
  // Material de enriquecimiento
  tipo_material?: string;
  comestible?: boolean;
  masticable?: boolean;
  explorable?: boolean;
  manipulable?: boolean;
  n_puntos_acceso?: string;
  localizacion_material?: string;
  accesibilidad_material?: string;
  periodicidad_renovacion?: string;
  estado_conservacion_material?: string;
  higiene_material?: string;
  competencia_material?: string;
  n_cerdos_exploran?: number;
  n_cerdos_interactuan?: number;
  
  // Condiciones ambientales
  valoracion_confort_termico?: string;
  temblor?: boolean;
  arqueo?: boolean;
  apinamiento?: boolean;
  jadeo?: boolean;
  pelaje_erizado?: boolean;
  ventilacion?: string;
  iluminacion?: string;
  co2_valoracion?: string;
  co2_medicion?: number;
  nh3_valoracion?: string;
  nh3_medicion?: number;
  otro_gas_nombre?: string;
  otro_gas_valoracion?: string;
  otro_gas_medicion?: number;
  otro_gas_2_nombre?: string;
  otro_gas_2_valoracion?: string;
  otro_gas_2_medicion?: number;
  humedad_valoracion?: string;
  humedad_medicion?: number;
  medicion_caudal_aire?: number;
  
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
  adecuada_categoria_edad?: boolean;
  contiene_aminoacidos?: boolean;
  control_analitico?: boolean;
  tipo_control?: string;
  estado_conservacion_alimento?: string;
  funcionamiento_comederos?: string;
  funcionamiento_bebederos?: string;
  temperatura_agua_bebedero?: number;
  
  // Genética
  genetica_materna?: string;
  raza_cruce?: string;
  observa_agresividad?: boolean;
  
  // Mordeduras - Rabo
  mordedura_rabo_aprecian?: boolean;
  mordedura_rabo_porcentaje?: number;
  mordedura_rabo_puntuacion_1?: number;
  mordedura_rabo_puntuacion_2?: number;
  
  // Mordeduras - Orejas
  mordedura_orejas_aprecian?: boolean;
  mordedura_orejas_porcentaje?: number;
  
  // Mordeduras - Vulva
  mordedura_vulva_aprecian?: boolean;
  mordedura_vulva_porcentaje?: number;
  
  // Mordeduras - Otras
  mordedura_otras_aprecian?: boolean;
  mordedura_otras_porcentaje?: number;
  mordedura_otras_localizacion?: string;
  
  // Observaciones y cálculo
  observaciones?: string;
  valor_a?: number;
  valor_b?: number;
  interaction_level?: number; // Calculado: 100 * A / (A + B)
  created?: string;
  updated?: string;
}

export interface CreateRiskFactorData {
  evaluation_id: string;
  facility_id: string;
  
  // Datos de la visita
  fecha_hora?: string;
  temperatura_exterior?: number;
  humedad_exterior?: number;
  nave_evaluada?: string;
  
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
  
  // Animales evaluados
  raboteados?: number;
  sin_rabotear?: number;
  cerdas_gestantes?: number;
  cerdas_gestantes_raboteadas?: number;
  cerdas_gestantes_sin_rabotear?: number;
  cerdas_parideras?: number;
  cerdas_parideras_raboteadas?: number;
  cerdas_parideras_sin_rabotear?: number;
  lechones?: number;
  lechones_raboteados?: number;
  lechones_sin_rabotear?: number;
  reposicion_num?: number;
  reposicion_peso?: number;
  reposicion_rega?: string;
  reposicion_raboteados?: number;
  reposicion_sin_rabotear?: number;
  transicion_num?: number;
  transicion_peso?: number;
  transicion_rega?: string;
  transicion_raboteados?: number;
  transicion_sin_rabotear?: number;
  cebo_num?: number;
  cebo_peso?: number;
  cebo_rega?: string;
  cebo_raboteados?: number;
  cebo_sin_rabotear?: number;
  
  // Densidad
  cumple_densidad?: boolean;
  material_manipulable?: boolean;
  superficie_animal?: number;
  peso_medio_animales?: number;
  
  // Material de enriquecimiento
  tipo_material?: string;
  comestible?: boolean;
  masticable?: boolean;
  explorable?: boolean;
  manipulable?: boolean;
  n_puntos_acceso?: string;
  localizacion_material?: string;
  accesibilidad_material?: string;
  periodicidad_renovacion?: string;
  estado_conservacion_material?: string;
  higiene_material?: string;
  competencia_material?: string;
  n_cerdos_exploran?: number;
  n_cerdos_interactuan?: number;
  
  // Condiciones ambientales
  valoracion_confort_termico?: string;
  temblor?: boolean;
  arqueo?: boolean;
  apinamiento?: boolean;
  jadeo?: boolean;
  pelaje_erizado?: boolean;
  ventilacion?: string;
  iluminacion?: string;
  co2_valoracion?: string;
  co2_medicion?: number;
  nh3_valoracion?: string;
  nh3_medicion?: number;
  otro_gas_nombre?: string;
  otro_gas_valoracion?: string;
  otro_gas_medicion?: number;
  otro_gas_2_nombre?: string;
  otro_gas_2_valoracion?: string;
  otro_gas_2_medicion?: number;
  humedad_valoracion?: string;
  humedad_medicion?: number;
  medicion_caudal_aire?: number;
  
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
  adecuada_categoria_edad?: boolean;
  contiene_aminoacidos?: boolean;
  control_analitico?: boolean;
  tipo_control?: string;
  estado_conservacion_alimento?: string;
  funcionamiento_comederos?: string;
  funcionamiento_bebederos?: string;
  temperatura_agua_bebedero?: number;
  
  // Genética
  genetica_materna?: string;
  raza_cruce?: string;
  observa_agresividad?: boolean;
  
  // Mordeduras
  mordedura_rabo_aprecian?: boolean;
  mordedura_rabo_porcentaje?: number;
  mordedura_rabo_puntuacion_1?: number;
  mordedura_rabo_puntuacion_2?: number;
  mordedura_orejas_aprecian?: boolean;
  mordedura_orejas_porcentaje?: number;
  mordedura_vulva_aprecian?: boolean;
  mordedura_vulva_porcentaje?: number;
  mordedura_otras_aprecian?: boolean;
  mordedura_otras_porcentaje?: number;
  mordedura_otras_localizacion?: string;
  
  // Observaciones
  observaciones?: string;
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
