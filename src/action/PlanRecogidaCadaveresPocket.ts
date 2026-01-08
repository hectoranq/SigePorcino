import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos del Plan de Recogida de Cadáveres
export interface PlanRecogidaCadaveres {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  sistema_recogida_cadaveres: string;
  gestor_autorizado_cadaveres: string; // ID del staff (relación)
  ubicacion_contenedores_cadaveres: string;
  sistema_recogida_sandach: string;
  gestor_autorizado_sandach: string; // ID del staff (relación)
  ubicacion_contenedores_sandach: string;
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

// Interfaz para crear un Plan de Recogida de Cadáveres
export interface CreatePlanRecogidaCadaveresData {
  sistema_recogida_cadaveres: string;
  gestor_autorizado_cadaveres: string;
  ubicacion_contenedores_cadaveres: string;
  sistema_recogida_sandach: string;
  gestor_autorizado_sandach: string;
  ubicacion_contenedores_sandach: string;
  farm: string;
}

// Interfaz para actualizar un Plan de Recogida de Cadáveres
export interface UpdatePlanRecogidaCadaveresData {
  sistema_recogida_cadaveres?: string;
  gestor_autorizado_cadaveres?: string;
  ubicacion_contenedores_cadaveres?: string;
  sistema_recogida_sandach?: string;
  gestor_autorizado_sandach?: string;
  ubicacion_contenedores_sandach?: string;
  farm?: string;
}

/**
 * List/Search - Obtener todos los planes de recogida de cadáveres
 * GET /api/collections/plan_recogida_cadaveres/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de planes de recogida de cadáveres
 */
export async function listPlanRecogidaCadaveres(
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

    const records = await pb.collection('plan_recogida_cadaveres').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user,gestor_autorizado_cadaveres,gestor_autorizado_sandach',
    });

    console.log(`✅ Planes de recogida de cadáveres obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Planes de recogida de cadáveres obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener planes de recogida de cadáveres:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener planes de recogida de cadáveres',
      error,
    };
  }
}

/**
 * View - Obtener un plan de recogida de cadáveres específico por ID
 * GET /api/collections/plan_recogida_cadaveres/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del plan de recogida de cadáveres
 */
export async function getPlanRecogidaCadaveresById(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('plan_recogida_cadaveres').getOne(id, {
      expand: 'farm,user,gestor_autorizado_cadaveres,gestor_autorizado_sandach',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Plan de recogida de cadáveres obtenido: ${record.id}`);
    return {
      success: true,
      data: record as PlanRecogidaCadaveres,
      message: 'Plan de recogida de cadáveres obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener plan de recogida de cadáveres:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener plan de recogida de cadáveres',
      error,
    };
  }
}

/**
 * Buscar planes de recogida de cadáveres por ID de granja
 * GET /api/collections/plan_recogida_cadaveres/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - ID de la granja
 * @returns Array de planes de recogida de cadáveres
 */
export async function getPlanRecogidaCadaveresByFarmId(
  token: string,
  userId: string,
  farmId: string
): Promise<PlanRecogidaCadaveres[] | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const result = await pb.collection('plan_recogida_cadaveres').getList(1, 50, {
      filter: `farm="${farmId}" && user="${userId}"`,
      sort: '-created',
      expand: 'farm,user,gestor_autorizado_cadaveres,gestor_autorizado_sandach',
    });

    if (result.totalItems === 0) {
      console.log(`ℹ️ No se encontraron planes de recogida de cadáveres para la granja ID: ${farmId}`);
      return [];
    }

    console.log(`✅ Se encontraron ${result.totalItems} plan(es) de recogida de cadáveres para la granja ID: ${farmId}`);
    return result.items as PlanRecogidaCadaveres[];
  } catch (error: any) {
    console.error("❌ Error al obtener planes de recogida de cadáveres por farmId:", error.message);
    return null;
  }
}

/**
 * Create - Crear un nuevo plan de recogida de cadáveres
 * POST /api/collections/plan_recogida_cadaveres/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param data - Datos del plan de recogida de cadáveres
 * @returns Plan de recogida de cadáveres creado
 */
export async function createPlanRecogidaCadaveres(
  token: string,
  userId: string,
  data: CreatePlanRecogidaCadaveresData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.sistema_recogida_cadaveres || !data.ubicacion_contenedores_cadaveres) {
      throw new Error('Faltan campos requeridos de recogida de cadáveres');
    }

    if (!data.sistema_recogida_sandach || !data.ubicacion_contenedores_sandach) {
      throw new Error('Faltan campos requeridos de SANDACH');
    }

    if (!data.gestor_autorizado_cadaveres || !data.gestor_autorizado_sandach) {
      throw new Error('Faltan gestores autorizados requeridos');
    }

    if (!data.farm) {
      throw new Error('Falta relación requerida: farm');
    }

    const newPlan = await pb.collection('plan_recogida_cadaveres').create({
      ...data,
      user: userId,
    });

    console.log(`✅ Plan de recogida de cadáveres creado exitosamente: ${newPlan.id}`);
    return {
      success: true,
      data: newPlan as PlanRecogidaCadaveres,
      message: 'Plan de recogida de cadáveres creado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear plan de recogida de cadáveres:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al procesar el plan de recogida de cadáveres en el servidor',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al crear plan de recogida de cadáveres',
      error,
    };
  }
}

/**
 * Update - Actualizar un plan de recogida de cadáveres existente
 * PATCH /api/collections/plan_recogida_cadaveres/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del plan de recogida de cadáveres
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @param data - Datos a actualizar
 * @returns Plan de recogida de cadáveres actualizado
 */
export async function updatePlanRecogidaCadaveres(
  token: string,
  id: string,
  userId: string,
  data: UpdatePlanRecogidaCadaveresData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Verificar que el usuario sea el propietario antes de actualizar
    const record = await pb.collection('plan_recogida_cadaveres').getOne(id);
    if (record.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const updatedPlan = await pb.collection('plan_recogida_cadaveres').update(id, data);

    console.log(`✅ Plan de recogida de cadáveres actualizado exitosamente: ${updatedPlan.id}`);
    return {
      success: true,
      data: updatedPlan as PlanRecogidaCadaveres,
      message: 'Plan de recogida de cadáveres actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar plan de recogida de cadáveres:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al procesar la actualización del plan de recogida de cadáveres en el servidor',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al actualizar plan de recogida de cadáveres',
      error,
    };
  }
}

/**
 * Delete - Eliminar un plan de recogida de cadáveres
 * DELETE /api/collections/plan_recogida_cadaveres/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del plan de recogida de cadáveres a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deletePlanRecogidaCadaveres(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Verificar que el usuario sea el propietario antes de eliminar
    const record = await pb.collection('plan_recogida_cadaveres').getOne(id);
    if (record.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('plan_recogida_cadaveres').delete(id);

    console.log(`✅ Plan de recogida de cadáveres eliminado exitosamente`);
    return {
      success: true,
      message: 'Plan de recogida de cadáveres eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar plan de recogida de cadáveres:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar plan de recogida de cadáveres',
      error,
    };
  }
}

/**
 * Buscar planes de recogida de cadáveres por sistema o ubicación
 * GET /api/collections/plan_recogida_cadaveres/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param searchTerm - Término de búsqueda
 * @param farmId - ID de la granja (opcional para filtrar por granja)
 * @returns Array de planes de recogida de cadáveres
 */
export async function searchPlanRecogidaCadaveres(
  token: string,
  userId: string,
  searchTerm: string,
  farmId?: string
): Promise<PlanRecogidaCadaveres[] | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `(sistema_recogida_cadaveres ~ "${searchTerm}" || sistema_recogida_sandach ~ "${searchTerm}" || ubicacion_contenedores_cadaveres ~ "${searchTerm}" || ubicacion_contenedores_sandach ~ "${searchTerm}") && user="${userId}"`;
    
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }
    
    const result = await pb.collection('plan_recogida_cadaveres').getList(1, 50, {
      filter: filter,
      sort: '-created',
      expand: 'farm,user,gestor_autorizado_cadaveres,gestor_autorizado_sandach',
    });

    console.log(`✅ Se encontraron ${result.totalItems} plan(es) de recogida de cadáveres que coinciden con "${searchTerm}"`);
    return result.items as PlanRecogidaCadaveres[];
  } catch (error: any) {
    console.error("❌ Error al buscar planes de recogida de cadáveres:", error.message);
    return null;
  }
}
