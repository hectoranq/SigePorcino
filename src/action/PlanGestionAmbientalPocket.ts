import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de plan de gestión ambiental
export interface PlanGestionAmbiental {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  // Optimización agua y energía - Equipamiento
  caudalimetro: boolean;
  higrometro: boolean;
  luximetro: boolean;
  equipamiento_adicional: string[]; // JSON array
  consumo_agua_registro: string; // Select: "si" | "no"
  consumo_energetico_registro: string; // Select: "si" | "no"
  // Sistema energético
  linea_electrica: boolean;
  generador: boolean;
  energia_solar: boolean;
  sistema_energetico_adicional: string[]; // JSON array
  // Control térmico
  ventilacion_forzada: boolean;
  ventilacion_natural: boolean;
  calefaccion_suelo_radiante: boolean;
  control_termico_adicional: string[]; // JSON array
  // Reducción consumo agua
  bebederos_cazoleta: boolean;
  revision_diaria_fugas: boolean;
  aprovisionamiento_agua_lluvia: boolean;
  equipos_alta_presion: boolean;
  // Reducción ruidos y olores - Equipamiento
  sonometro: boolean;
  extractores: boolean;
  ventiladores: boolean;
  equipamiento_ruido_adicional: string[]; // JSON array
  sistema_medicion_gases: string; // Select: "si" | "no"
  especificar_gases: string;
  // Medidas implementadas
  ruidos: boolean;
  particulas_polvo: boolean;
  olores: boolean;
  medidas_adicionales: string[]; // JSON array
  // Plan de estiércol
  sistema_recogida_estiercol: string;
  produccion_anual_estimada: string;
  frecuencia_vaciado: string;
  balsa_almacenamiento: string;
  superficie_agricola: string;
  operadores_autorizados: string;
  instalaciones_tratamiento: string;
  ficha_seguimiento_purin: boolean;
  gestion_estiercol_adicional: string[]; // JSON array
  // Relaciones
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

// Tipo para crear un nuevo registro (sin id, created, updated)
export type CreatePlanGestionAmbientalData = Omit<
  PlanGestionAmbiental,
  'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'
>;

// Tipo para actualizar un registro (campos parciales)
export type UpdatePlanGestionAmbientalData = Partial<
  Omit<PlanGestionAmbiental, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
>;

/**
 * List/Search - Obtener todos los planes de gestión ambiental
 * GET /api/collections/plan_gestion_ambiental/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de planes de gestión ambiental
 */
export async function listPlanGestionAmbiental(
  token: string,
  userId: string,
  farmId?: string,
  page: number = 1,
  perPage: number = 50
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Construir filtro
    let filter = `user="${userId}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('plan_gestion_ambiental').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user',
    });

    console.log(`✅ Planes de gestión ambiental obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Planes de gestión ambiental obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener planes de gestión ambiental:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener planes de gestión ambiental',
      error,
    };
  }
}

/**
 * View - Obtener un plan de gestión ambiental específico por ID
 * GET /api/collections/plan_gestion_ambiental/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del plan de gestión ambiental
 */
export async function getPlanGestionAmbientalById(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('plan_gestion_ambiental').getOne(id, {
      expand: 'farm,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Plan de gestión ambiental obtenido: ${id}`);
    return {
      success: true,
      data: record,
      message: 'Plan de gestión ambiental obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener plan de gestión ambiental:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener plan de gestión ambiental',
      error,
    };
  }
}

/**
 * Obtener plan de gestión ambiental por Farm ID
 * @param token - Token de autenticación
 * @param farmId - ID de la granja
 * @param userId - ID del usuario autenticado
 * @returns Plan de gestión ambiental de la granja
 */
export async function getPlanGestionAmbientalByFarmId(
  token: string,
  farmId: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('plan_gestion_ambiental').getList(1, 50, {
      filter: `user="${userId}" && farm="${farmId}"`,
      sort: '-created',
      expand: 'farm,user',
    });

    console.log(`✅ Planes de gestión ambiental de la granja obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Planes de gestión ambiental obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener planes de gestión ambiental por granja:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener planes de gestión ambiental',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de plan de gestión ambiental
 * POST /api/collections/plan_gestion_ambiental/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos del plan de gestión ambiental
 * @returns Registro creado
 */
export async function createPlanGestionAmbiental(
  token: string,
  data: CreatePlanGestionAmbientalData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos - Plan de estiércol
    if (!data.sistema_recogida_estiercol || !data.produccion_anual_estimada) {
      throw new Error('Faltan campos requeridos: sistema_recogida_estiercol, produccion_anual_estimada');
    }
    if (!data.frecuencia_vaciado || !data.balsa_almacenamiento) {
      throw new Error('Faltan campos requeridos: frecuencia_vaciado, balsa_almacenamiento');
    }
    if (!data.superficie_agricola || !data.operadores_autorizados || !data.instalaciones_tratamiento) {
      throw new Error('Faltan campos requeridos: superficie_agricola, operadores_autorizados, instalaciones_tratamiento');
    }

    // Validar relaciones
    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    const record = await pb.collection('plan_gestion_ambiental').create(data);

    console.log(`✅ Plan de gestión ambiental creado: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Plan de gestión ambiental registrado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear plan de gestión ambiental:', error);

    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al crear plan de gestión ambiental',
        errors: pbError.data || {},
      };
    }

    throw {
      success: false,
      message: error?.message || 'Error al crear plan de gestión ambiental',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro de plan de gestión ambiental existente
 * PATCH /api/collections/plan_gestion_ambiental/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updatePlanGestionAmbiental(
  token: string,
  id: string,
  data: UpdatePlanGestionAmbientalData,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('plan_gestion_ambiental').getOne(id);

    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const record = await pb.collection('plan_gestion_ambiental').update(id, data);

    console.log(`✅ Plan de gestión ambiental actualizado: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Plan de gestión ambiental actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar plan de gestión ambiental:', error);

    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al actualizar plan de gestión ambiental',
        errors: pbError.data || {},
      };
    }

    throw {
      success: false,
      message: error?.message || 'Error al actualizar plan de gestión ambiental',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro de plan de gestión ambiental
 * DELETE /api/collections/plan_gestion_ambiental/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deletePlanGestionAmbiental(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('plan_gestion_ambiental').getOne(id);

    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('plan_gestion_ambiental').delete(id);

    console.log(`✅ Plan de gestión ambiental eliminado: ${id}`);
    return {
      success: true,
      message: 'Plan de gestión ambiental eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar plan de gestión ambiental:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar plan de gestión ambiental',
      error,
    };
  }
}

/**
 * Funciones auxiliares
 */

/**
 * Buscar planes de gestión ambiental
 */
export async function searchPlanGestionAmbiental(
  token: string,
  userId: string,
  searchParams: {
    farmId?: string;
    consumoAguaRegistro?: string;
    consumoEnergeticoRegistro?: string;
    sistemaMedicionGases?: string;
  }
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}"`;

    if (searchParams.farmId) {
      filter += ` && farm="${searchParams.farmId}"`;
    }

    if (searchParams.consumoAguaRegistro) {
      filter += ` && consumo_agua_registro="${searchParams.consumoAguaRegistro}"`;
    }

    if (searchParams.consumoEnergeticoRegistro) {
      filter += ` && consumo_energetico_registro="${searchParams.consumoEnergeticoRegistro}"`;
    }

    if (searchParams.sistemaMedicionGases) {
      filter += ` && sistema_medicion_gases="${searchParams.sistemaMedicionGases}"`;
    }

    const records = await pb.collection('plan_gestion_ambiental').getList(1, 50, {
      filter,
      expand: 'farm,user',
    });

    return {
      success: true,
      data: records,
      message: 'Búsqueda completada',
    };
  } catch (error: any) {
    console.error('❌ Error en búsqueda:', error);
    throw {
      success: false,
      message: error?.message || 'Error en la búsqueda',
      error,
    };
  }
}

export default {
  listPlanGestionAmbiental,
  getPlanGestionAmbientalById,
  getPlanGestionAmbientalByFarmId,
  createPlanGestionAmbiental,
  updatePlanGestionAmbiental,
  deletePlanGestionAmbiental,
  searchPlanGestionAmbiental,
};
