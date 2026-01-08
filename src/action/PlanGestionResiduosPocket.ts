import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de gestión de residuos
export interface PlanGestionResiduos {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  // Medicamentos
  ubicacion_medicamentos: string;
  descripcion_medicamentos: string;
  encargado_medicamentos: string; // ID del staff
  gestor_medicamentos: string;
  protocolo_medicamentos: string;
  periodicidad_medicamentos: string; // Select: "Diaria" | "Semanal" | "Quincenal" | "Mensual" | "Trimestral" | "Semestral" | "Anual"
  // Piensos medicamentosos
  ubicacion_piensos: string;
  descripcion_piensos: string;
  encargado_piensos: string; // ID del staff
  gestor_piensos: string;
  protocolo_piensos: string;
  periodicidad_piensos: string;
  // Material sanitario
  ubicacion_material: string;
  descripcion_material: string;
  encargado_material: string; // ID del staff
  gestor_material: string;
  protocolo_material: string;
  periodicidad_material: string;
  // Envases residuales
  ubicacion_envases: string;
  descripcion_envases: string;
  encargado_envases: string; // ID del staff
  gestor_envases: string;
  protocolo_envases: string;
  periodicidad_envases: string;
  // Relaciones
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

// Tipo para crear un nuevo registro (sin id, created, updated)
export type CreatePlanGestionResiduosData = Omit<
  PlanGestionResiduos,
  'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'
>;

// Tipo para actualizar un registro (campos parciales)
export type UpdatePlanGestionResiduosData = Partial<
  Omit<PlanGestionResiduos, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
>;

/**
 * List/Search - Obtener todos los planes de gestión de residuos
 * GET /api/collections/plan_gestion_residuos/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de planes de gestión de residuos
 */
export async function listPlanGestionResiduos(
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

    const records = await pb.collection('plan_gestion_residuos').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user,encargado_medicamentos,encargado_piensos,encargado_material,encargado_envases',
    });

    console.log(`✅ Planes de gestión de residuos obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Planes de gestión de residuos obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener planes de gestión de residuos:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener planes de gestión de residuos',
      error,
    };
  }
}

/**
 * View - Obtener un plan de gestión de residuos específico por ID
 * GET /api/collections/plan_gestion_residuos/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del plan de gestión de residuos
 */
export async function getPlanGestionResiduosById(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('plan_gestion_residuos').getOne(id, {
      expand: 'farm,user,encargado_medicamentos,encargado_piensos,encargado_material,encargado_envases',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Plan de gestión de residuos obtenido: ${id}`);
    return {
      success: true,
      data: record,
      message: 'Plan de gestión de residuos obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener plan de gestión de residuos:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener plan de gestión de residuos',
      error,
    };
  }
}

/**
 * Obtener plan de gestión de residuos por Farm ID
 * @param token - Token de autenticación
 * @param farmId - ID de la granja
 * @param userId - ID del usuario autenticado
 * @returns Plan de gestión de residuos de la granja
 */
export async function getPlanGestionResiduosByFarmId(
  token: string,
  farmId: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('plan_gestion_residuos').getList(1, 50, {
      filter: `user="${userId}" && farm="${farmId}"`,
      sort: '-created',
      expand: 'farm,user,encargado_medicamentos,encargado_piensos,encargado_material,encargado_envases',
    });

    console.log(`✅ Planes de gestión de residuos de la granja obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Planes de gestión de residuos obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener planes de gestión de residuos por granja:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener planes de gestión de residuos',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de plan de gestión de residuos
 * POST /api/collections/plan_gestion_residuos/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos del plan de gestión de residuos
 * @returns Registro creado
 */
export async function createPlanGestionResiduos(
  token: string,
  data: CreatePlanGestionResiduosData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos - Medicamentos
    if (!data.ubicacion_medicamentos || !data.descripcion_medicamentos) {
      throw new Error('Faltan campos requeridos de medicamentos: ubicacion, descripcion');
    }
    if (!data.encargado_medicamentos || !data.gestor_medicamentos) {
      throw new Error('Faltan campos requeridos de medicamentos: encargado, gestor');
    }
    if (!data.protocolo_medicamentos || !data.periodicidad_medicamentos) {
      throw new Error('Faltan campos requeridos de medicamentos: protocolo, periodicidad');
    }

    // Validar datos requeridos - Piensos
    if (!data.ubicacion_piensos || !data.descripcion_piensos) {
      throw new Error('Faltan campos requeridos de piensos: ubicacion, descripcion');
    }
    if (!data.encargado_piensos || !data.gestor_piensos) {
      throw new Error('Faltan campos requeridos de piensos: encargado, gestor');
    }
    if (!data.protocolo_piensos || !data.periodicidad_piensos) {
      throw new Error('Faltan campos requeridos de piensos: protocolo, periodicidad');
    }

    // Validar datos requeridos - Material sanitario
    if (!data.ubicacion_material || !data.descripcion_material) {
      throw new Error('Faltan campos requeridos de material sanitario: ubicacion, descripcion');
    }
    if (!data.encargado_material || !data.gestor_material) {
      throw new Error('Faltan campos requeridos de material sanitario: encargado, gestor');
    }
    if (!data.protocolo_material || !data.periodicidad_material) {
      throw new Error('Faltan campos requeridos de material sanitario: protocolo, periodicidad');
    }

    // Validar datos requeridos - Envases residuales
    if (!data.ubicacion_envases || !data.descripcion_envases) {
      throw new Error('Faltan campos requeridos de envases residuales: ubicacion, descripcion');
    }
    if (!data.encargado_envases || !data.gestor_envases) {
      throw new Error('Faltan campos requeridos de envases residuales: encargado, gestor');
    }
    if (!data.protocolo_envases || !data.periodicidad_envases) {
      throw new Error('Faltan campos requeridos de envases residuales: protocolo, periodicidad');
    }

    // Validar relaciones
    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    const record = await pb.collection('plan_gestion_residuos').create(data);

    console.log(`✅ Plan de gestión de residuos creado: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Plan de gestión de residuos registrado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear plan de gestión de residuos:', error);

    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al crear plan de gestión de residuos',
        errors: pbError.data || {},
      };
    }

    throw {
      success: false,
      message: error?.message || 'Error al crear plan de gestión de residuos',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro de plan de gestión de residuos existente
 * PATCH /api/collections/plan_gestion_residuos/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updatePlanGestionResiduos(
  token: string,
  id: string,
  data: UpdatePlanGestionResiduosData,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('plan_gestion_residuos').getOne(id);

    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const record = await pb.collection('plan_gestion_residuos').update(id, data);

    console.log(`✅ Plan de gestión de residuos actualizado: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Plan de gestión de residuos actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar plan de gestión de residuos:', error);

    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al actualizar plan de gestión de residuos',
        errors: pbError.data || {},
      };
    }

    throw {
      success: false,
      message: error?.message || 'Error al actualizar plan de gestión de residuos',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro de plan de gestión de residuos
 * DELETE /api/collections/plan_gestion_residuos/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deletePlanGestionResiduos(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('plan_gestion_residuos').getOne(id);

    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('plan_gestion_residuos').delete(id);

    console.log(`✅ Plan de gestión de residuos eliminado: ${id}`);
    return {
      success: true,
      message: 'Plan de gestión de residuos eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar plan de gestión de residuos:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar plan de gestión de residuos',
      error,
    };
  }
}

/**
 * Funciones auxiliares
 */

/**
 * Buscar planes de gestión de residuos por periodicidad
 */
export async function searchPlanGestionResiduos(
  token: string,
  userId: string,
  searchParams: {
    periodicidad?: string;
    farmId?: string;
  }
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}"`;

    if (searchParams.farmId) {
      filter += ` && farm="${searchParams.farmId}"`;
    }

    if (searchParams.periodicidad) {
      filter += ` && (periodicidad_medicamentos="${searchParams.periodicidad}" || periodicidad_piensos="${searchParams.periodicidad}" || periodicidad_material="${searchParams.periodicidad}" || periodicidad_envases="${searchParams.periodicidad}")`;
    }

    const records = await pb.collection('plan_gestion_residuos').getList(1, 50, {
      filter,
      expand: 'farm,user,encargado_medicamentos,encargado_piensos,encargado_material,encargado_envases',
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
  listPlanGestionResiduos,
  getPlanGestionResiduosById,
  getPlanGestionResiduosByFarmId,
  createPlanGestionResiduos,
  updatePlanGestionResiduos,
  deletePlanGestionResiduos,
  searchPlanGestionResiduos,
};
