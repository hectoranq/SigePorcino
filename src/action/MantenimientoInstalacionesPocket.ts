import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de Mantenimiento de Instalaciones
export interface MantenimientoInstalacion {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  personal_encargado: string[]; // IDs del personal encargado (relación múltiple con staff)
  trabajadores: string[]; // IDs de trabajadores (relación múltiple con staff)
  gestores_autorizados: string[]; // IDs de gestores autorizados (relación múltiple con staff)
  procedimiento_revision: string;
  frecuencia_revision: string; // Semanal, Quincenal, Mensual, Trimestral, Semestral, Anual
  proveedores_servicios: string;
  regas_aplicables: string[]; // Array de números REGA
  fecha_registro: string; // ISO 8601 date string
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

// Interfaz para crear un Mantenimiento de Instalaciones
export interface CreateMantenimientoInstalacionData {
  personal_encargado: string[];
  trabajadores: string[];
  gestores_autorizados: string[];
  procedimiento_revision: string;
  frecuencia_revision: string;
  proveedores_servicios: string;
  regas_aplicables: string[];
  fecha_registro: string;
  farm: string;
}

// Interfaz para actualizar un Mantenimiento de Instalaciones
export interface UpdateMantenimientoInstalacionData {
  personal_encargado?: string[];
  trabajadores?: string[];
  gestores_autorizados?: string[];
  procedimiento_revision?: string;
  frecuencia_revision?: string;
  proveedores_servicios?: string;
  regas_aplicables?: string[];
  fecha_registro?: string;
  farm?: string;
}

/**
 * List/Search - Obtener todos los planes de mantenimiento de instalaciones
 * GET /api/collections/mantenimiento_instalaciones/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de planes de mantenimiento
 */
export async function listMantenimientoInstalaciones(
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

    const records = await pb.collection('mantenimiento_instalaciones').getList(page, perPage, {
      filter,
      sort: '-created'
    });

    console.log(`✅ Planes de mantenimiento obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Planes de mantenimiento obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener planes de mantenimiento:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener planes de mantenimiento',
      error,
    };
  }
}

/**
 * View - Obtener un plan de mantenimiento específico por ID
 * GET /api/collections/mantenimiento_instalaciones/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del plan de mantenimiento
 */
export async function getMantenimientoInstalacionById(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('mantenimiento_instalaciones').getOne(id, {
      expand: 'farm,user,personal_encargado,trabajadores,gestores_autorizados',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Plan de mantenimiento obtenido: ${record.id}`);
    return {
      success: true,
      data: record as MantenimientoInstalacion,
      message: 'Plan de mantenimiento obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener plan de mantenimiento:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener plan de mantenimiento',
      error,
    };
  }
}

/**
 * Buscar planes de mantenimiento por ID de granja
 * GET /api/collections/mantenimiento_instalaciones/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - ID de la granja
 * @returns Array de planes de mantenimiento
 */
export async function getMantenimientoInstalacionByFarmId(
  token: string,
  userId: string,
  farmId: string
): Promise<MantenimientoInstalacion[] | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const result = await pb.collection('mantenimiento_instalaciones').getList(1, 50, {
      filter: `user="${userId}"`,
      sort: '-created'
    });

    if (result.totalItems === 0) {
      console.log(`ℹ️ No se encontraron planes de mantenimiento para la granja ID: ${farmId}`);
      return [];
    }

    console.log(`✅ Se encontraron ${result.totalItems} plan(es) de mantenimiento para la granja ID: ${farmId}`);
    return result.items as MantenimientoInstalacion[];
  } catch (error: any) {
    console.error("❌ Error al obtener planes de mantenimiento por farmId:", error.message);
    return null;
  }
}

/**
 * Create - Crear un nuevo plan de mantenimiento de instalaciones
 * POST /api/collections/mantenimiento_instalaciones/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param data - Datos del plan de mantenimiento
 * @returns Plan de mantenimiento creado
 */
export async function createMantenimientoInstalacion(
  token: string,
  userId: string,
  data: CreateMantenimientoInstalacionData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.procedimiento_revision || !data.frecuencia_revision || !data.fecha_registro) {
      throw new Error('Faltan campos requeridos: procedimiento_revision, frecuencia_revision, fecha_registro');
    }

    if (!data.farm) {
      throw new Error('Falta relación requerida: farm');
    }

    // Asegurar que los arrays estén definidos
    if (!Array.isArray(data.personal_encargado)) {
      data.personal_encargado = [];
    }
    if (!Array.isArray(data.trabajadores)) {
      data.trabajadores = [];
    }
    if (!Array.isArray(data.gestores_autorizados)) {
      data.gestores_autorizados = [];
    }
    if (!Array.isArray(data.regas_aplicables)) {
      data.regas_aplicables = [];
    }

    const newMantenimiento = await pb.collection('mantenimiento_instalaciones').create({
      ...data,
      user: userId,
    });

    console.log(`✅ Plan de mantenimiento creado exitosamente: ${newMantenimiento.id}`);
    return {
      success: true,
      data: newMantenimiento as MantenimientoInstalacion,
      message: 'Plan de mantenimiento creado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear plan de mantenimiento:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al procesar el plan de mantenimiento en el servidor',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al crear plan de mantenimiento',
      error,
    };
  }
}

/**
 * Update - Actualizar un plan de mantenimiento existente
 * PATCH /api/collections/mantenimiento_instalaciones/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del plan de mantenimiento
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @param data - Datos a actualizar
 * @returns Plan de mantenimiento actualizado
 */
export async function updateMantenimientoInstalacion(
  token: string,
  id: string,
  userId: string,
  data: UpdateMantenimientoInstalacionData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Verificar que el usuario sea el propietario antes de actualizar
    const record = await pb.collection('mantenimiento_instalaciones').getOne(id);
    if (record.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const updatedMantenimiento = await pb.collection('mantenimiento_instalaciones').update(id, data);

    console.log(`✅ Plan de mantenimiento actualizado exitosamente: ${updatedMantenimiento.id}`);
    return {
      success: true,
      data: updatedMantenimiento as MantenimientoInstalacion,
      message: 'Plan de mantenimiento actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar plan de mantenimiento:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al procesar la actualización del plan de mantenimiento en el servidor',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al actualizar plan de mantenimiento',
      error,
    };
  }
}

/**
 * Delete - Eliminar un plan de mantenimiento
 * DELETE /api/collections/mantenimiento_instalaciones/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del plan de mantenimiento a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteMantenimientoInstalacion(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Verificar que el usuario sea el propietario antes de eliminar
    const record = await pb.collection('mantenimiento_instalaciones').getOne(id);
    if (record.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('mantenimiento_instalaciones').delete(id);

    console.log(`✅ Plan de mantenimiento eliminado exitosamente`);
    return {
      success: true,
      message: 'Plan de mantenimiento eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar plan de mantenimiento:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar plan de mantenimiento',
      error,
    };
  }
}

/**
 * Buscar planes de mantenimiento por procedimiento o proveedores
 * GET /api/collections/mantenimiento_instalaciones/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param searchTerm - Término de búsqueda
 * @param farmId - ID de la granja (opcional para filtrar por granja)
 * @returns Array de planes de mantenimiento
 */
export async function searchMantenimientoInstalaciones(
  token: string,
  userId: string,
  searchTerm: string,
  farmId?: string
): Promise<MantenimientoInstalacion[] | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `(procedimiento_revision ~ "${searchTerm}" || proveedores_servicios ~ "${searchTerm}") && user="${userId}"`;
    
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }
    
    const result = await pb.collection('mantenimiento_instalaciones').getList(1, 50, {
      filter: filter,
      sort: '-created',
      expand: 'farm,user,personal_encargado,trabajadores,gestores_autorizados',
    });

    console.log(`✅ Se encontraron ${result.totalItems} plan(es) de mantenimiento que coinciden con "${searchTerm}"`);
    return result.items as MantenimientoInstalacion[];
  } catch (error: any) {
    console.error("❌ Error al buscar planes de mantenimiento:", error.message);
    return null;
  }
}
