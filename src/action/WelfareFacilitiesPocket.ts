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
  
  // Infraestructura
  capacidad_autorizada?: number;
  anio_construccion?: number;
  orientacion_nave?: string;
  aislamiento_estructural?: string;
  suelo_hormigon?: boolean;
  suelo_plastico?: boolean;
  suelo_metalico?: boolean;
  parcialmente_emparrillado?: boolean;
  totalmente_emparrillado?: boolean;
  
  // Control ambiental - Temperatura
  sensor_temperatura: boolean;
  sensores_altura_cabeza?: boolean;
  control_temperatura?: boolean;
  registro_temperatura?: boolean;
  
  // Control ambiental - Humedad
  sensor_humedad: boolean;
  sensores_humedad_altura_cabeza?: boolean;
  control_humedad?: boolean;
  registro_humedad?: boolean;
  
  // Control ambiental - Gases
  sensor_co2: boolean;
  sensor_nh3: boolean;
  medicion_gases?: boolean;
  tipo_gases?: string[]; // ["CO2", "NH3", "O"]
  registro_gases?: boolean;
  
  // Sensores adicionales
  sensor_velocidad_aire: boolean;
  sensor_flujo_agua: boolean;
  
  // Ventilación y Climatización
  ventilacion: string; // natural, forzada, mixta
  extractores?: boolean;
  ventiladores?: boolean;
  apertura_ventanas?: boolean;
  apertura_chimeneas?: boolean;
  cumbreras?: boolean;
  coolings?: boolean;
  ventilacion_artificial?: boolean;
  calefaccion?: boolean;
  tipo_calefaccion?: string; // SR, MT, O
  
  // Material manipulable
  tipo_enriquecimiento: string;
  cama?: boolean;
  adosados_paredes?: boolean;
  suspendidos?: boolean;
  en_el_suelo?: boolean;
  otros_material?: boolean;
  
  // Gestión de purines
  frecuencia_vaciado?: string;
  
  // Alimentación
  tipo_comida: string; // Seca, Húmeda, Líquida
  ad_libitum?: boolean;
  tipo_comedero?: string[]; // ["TV", "E", "CN", "O"]
  longitud_comedero?: string;
  alimentacion_racionada?: boolean;
  n_comidas_dia?: number;
  
  // Abrevado
  tipo_agua: string;
  tipo_bebederos?: string[]; // ["CH", "CN", "CZ", "O"]
  n_bebederos?: number;
  n_animales_cuadra?: number;
  
  // Manejo
  separacion_sexos?: boolean;
  separacion_castrados?: boolean;
  separacion_tamanos?: boolean;
  separacion_enfermos?: boolean;
  
  // Lazareto
  capacidad_lazareto?: number;
  n_cuadras_lazareto?: number;
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
  
  // Infraestructura
  capacidad_autorizada?: number;
  anio_construccion?: number;
  orientacion_nave?: string;
  aislamiento_estructural?: string;
  suelo_hormigon?: boolean;
  suelo_plastico?: boolean;
  suelo_metalico?: boolean;
  parcialmente_emparrillado?: boolean;
  totalmente_emparrillado?: boolean;
  
  // Control ambiental - Temperatura
  sensor_temperatura: boolean;
  sensores_altura_cabeza?: boolean;
  control_temperatura?: boolean;
  registro_temperatura?: boolean;
  
  // Control ambiental - Humedad
  sensor_humedad: boolean;
  sensores_humedad_altura_cabeza?: boolean;
  control_humedad?: boolean;
  registro_humedad?: boolean;
  
  // Control ambiental - Gases
  sensor_co2: boolean;
  sensor_nh3: boolean;
  medicion_gases?: boolean;
  tipo_gases?: string[];
  registro_gases?: boolean;
  
  // Sensores adicionales
  sensor_velocidad_aire: boolean;
  sensor_flujo_agua: boolean;
  
  // Ventilación y Climatización
  ventilacion: string;
  extractores?: boolean;
  ventiladores?: boolean;
  apertura_ventanas?: boolean;
  apertura_chimeneas?: boolean;
  cumbreras?: boolean;
  coolings?: boolean;
  ventilacion_artificial?: boolean;
  calefaccion?: boolean;
  tipo_calefaccion?: string;
  
  // Material manipulable
  tipo_enriquecimiento: string;
  cama?: boolean;
  adosados_paredes?: boolean;
  suspendidos?: boolean;
  en_el_suelo?: boolean;
  otros_material?: boolean;
  
  // Gestión de purines
  frecuencia_vaciado?: string;
  
  // Alimentación
  tipo_comida: string;
  ad_libitum?: boolean;
  tipo_comedero?: string[];
  longitud_comedero?: string;
  alimentacion_racionada?: boolean;
  n_comidas_dia?: number;
  
  // Abrevado
  tipo_agua: string;
  tipo_bebederos?: string[];
  n_bebederos?: number;
  n_animales_cuadra?: number;
  
  // Manejo
  separacion_sexos?: boolean;
  separacion_castrados?: boolean;
  separacion_tamanos?: boolean;
  separacion_enfermos?: boolean;
  
  // Lazareto
  capacidad_lazareto?: number;
  n_cuadras_lazareto?: number;
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
  
  // Infraestructura
  capacidad_autorizada?: number;
  anio_construccion?: number;
  orientacion_nave?: string;
  aislamiento_estructural?: string;
  suelo_hormigon?: boolean;
  suelo_plastico?: boolean;
  suelo_metalico?: boolean;
  parcialmente_emparrillado?: boolean;
  totalmente_emparrillado?: boolean;
  
  // Control ambiental - Temperatura
  sensor_temperatura?: boolean;
  sensores_altura_cabeza?: boolean;
  control_temperatura?: boolean;
  registro_temperatura?: boolean;
  
  // Control ambiental - Humedad
  sensor_humedad?: boolean;
  sensores_humedad_altura_cabeza?: boolean;
  control_humedad?: boolean;
  registro_humedad?: boolean;
  
  // Control ambiental - Gases
  sensor_co2?: boolean;
  sensor_nh3?: boolean;
  medicion_gases?: boolean;
  tipo_gases?: string[];
  registro_gases?: boolean;
  
  // Sensores adicionales
  sensor_velocidad_aire?: boolean;
  sensor_flujo_agua?: boolean;
  
  // Ventilación y Climatización
  ventilacion?: string;
  extractores?: boolean;
  ventiladores?: boolean;
  apertura_ventanas?: boolean;
  apertura_chimeneas?: boolean;
  cumbreras?: boolean;
  coolings?: boolean;
  ventilacion_artificial?: boolean;
  calefaccion?: boolean;
  tipo_calefaccion?: string;
  
  // Material manipulable
  tipo_enriquecimiento?: string;
  cama?: boolean;
  adosados_paredes?: boolean;
  suspendidos?: boolean;
  en_el_suelo?: boolean;
  otros_material?: boolean;
  
  // Gestión de purines
  frecuencia_vaciado?: string;
  
  // Alimentación
  tipo_comida?: string;
  ad_libitum?: boolean;
  tipo_comedero?: string[];
  longitud_comedero?: string;
  alimentacion_racionada?: boolean;
  n_comidas_dia?: number;
  
  // Abrevado
  tipo_agua?: string;
  tipo_bebederos?: string[];
  n_bebederos?: number;
  n_animales_cuadra?: number;
  
  // Manejo
  separacion_sexos?: boolean;
  separacion_castrados?: boolean;
  separacion_tamanos?: boolean;
  separacion_enfermos?: boolean;
  
  // Lazareto
  capacidad_lazareto?: number;
  n_cuadras_lazareto?: number;
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
