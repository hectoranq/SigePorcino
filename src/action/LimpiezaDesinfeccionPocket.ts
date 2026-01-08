import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de limpieza y desinfección
export interface LimpiezaDesinfeccion {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  producto_empleado: string;
  fecha: string; // ISO 8601 date string
  operario: string;
  supervisado_por: string; // ID del personal supervisor (relación con staff)
  nro_silo: string;
  observaciones: string;
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

// Tipo para crear un nuevo registro (sin id, created, updated)
export type CreateLimpiezaDesinfeccionData = Omit<
  LimpiezaDesinfeccion,
  'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'
>;

// Tipo para actualizar un registro (campos parciales)
export type UpdateLimpiezaDesinfeccionData = Partial<
  Omit<LimpiezaDesinfeccion, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
>;

/**
 * List/Search - Obtener todos los registros de limpieza y desinfección
 * GET /api/collections/limpieza_desinfeccion/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de registros de limpieza y desinfección
 */
export async function listLimpiezaDesinfeccion(
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

    const records = await pb.collection('limpieza_desinfeccion').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user,supervisado_por',
    });

    console.log(`✅ Registros de limpieza y desinfección obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Registros de limpieza y desinfección obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registros de limpieza y desinfección:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registros de limpieza y desinfección',
      error,
    };
  }
}

/**
 * View - Obtener un registro específico de limpieza y desinfección por ID
 * GET /api/collections/limpieza_desinfeccion/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del registro de limpieza y desinfección
 */
export async function getLimpiezaDesinfeccionById(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('limpieza_desinfeccion').getOne(id, {
      expand: 'farm,user,supervisado_por',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Registro de limpieza y desinfección obtenido: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Registro de limpieza y desinfección obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registro de limpieza y desinfección:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registro de limpieza y desinfección',
      error,
    };
  }
}

/**
 * Obtener registros de limpieza y desinfección por Farm ID
 * @param token - Token de autenticación
 * @param farmId - ID de la granja
 * @param userId - ID del usuario autenticado
 * @returns Registros de limpieza y desinfección de la granja
 */
export async function getLimpiezaDesinfeccionByFarmId(
  token: string,
  farmId: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('limpieza_desinfeccion').getList(1, 50, {
      filter: `user="${userId}" && farm="${farmId}"`,
      sort: '-created',
      expand: 'farm,user,supervisado_por',
    });

    console.log(`✅ Registros de limpieza y desinfección de la granja obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Registros de limpieza y desinfección obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registros de limpieza y desinfección por granja:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registros de limpieza y desinfección',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de limpieza y desinfección
 * POST /api/collections/limpieza_desinfeccion/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos del registro de limpieza y desinfección
 * @returns Registro creado
 */
export async function createLimpiezaDesinfeccion(
  token: string,
  data: CreateLimpiezaDesinfeccionData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.producto_empleado || !data.fecha || !data.operario || !data.nro_silo || !data.supervisado_por) {
      throw new Error('Faltan campos requeridos: producto_empleado, fecha, operario, nro_silo, supervisado_por');
    }

    // Validar relaciones
    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    const record = await pb.collection('limpieza_desinfeccion').create(data);

    console.log(`✅ Registro de limpieza y desinfección creado: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Registro de limpieza y desinfección creado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear registro de limpieza y desinfección:', error);

    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al crear registro de limpieza y desinfección',
        errors: pbError.data || {},
      };
    }

    throw {
      success: false,
      message: error?.message || 'Error al crear registro de limpieza y desinfección',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro de limpieza y desinfección existente
 * PATCH /api/collections/limpieza_desinfeccion/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateLimpiezaDesinfeccion(
  token: string,
  id: string,
  data: UpdateLimpiezaDesinfeccionData,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('limpieza_desinfeccion').getOne(id);

    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const record = await pb.collection('limpieza_desinfeccion').update(id, data);

    console.log(`✅ Registro de limpieza y desinfección actualizado: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Registro de limpieza y desinfección actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar registro de limpieza y desinfección:', error);

    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al actualizar registro de limpieza y desinfección',
        errors: pbError.data || {},
      };
    }

    throw {
      success: false,
      message: error?.message || 'Error al actualizar registro de limpieza y desinfección',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro de limpieza y desinfección
 * DELETE /api/collections/limpieza_desinfeccion/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteLimpiezaDesinfeccion(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('limpieza_desinfeccion').getOne(id);

    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('limpieza_desinfeccion').delete(id);

    console.log(`✅ Registro de limpieza y desinfección eliminado: ${id}`);
    return {
      success: true,
      message: 'Registro de limpieza y desinfección eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar registro de limpieza y desinfección:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar registro de limpieza y desinfección',
      error,
    };
  }
}

/**
 * Funciones auxiliares
 */

/**
 * Buscar registros de limpieza y desinfección por supervisor
 */
export async function searchLimpiezaDesinfeccionBySupervisor(
  token: string,
  supervisorId: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('limpieza_desinfeccion').getList(1, 50, {
      filter: `user="${userId}" && supervisado_por="${supervisorId}"`,
      expand: 'farm,user,supervisado_por',
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

/**
 * Buscar registros de limpieza y desinfección por rango de fechas
 */
export async function searchLimpiezaDesinfeccionByDateRange(
  token: string,
  userId: string,
  startDate: string,
  endDate: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && fecha >= "${startDate}" && fecha <= "${endDate}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('limpieza_desinfeccion').getList(1, 50, {
      filter,
      sort: '-fecha',
      expand: 'farm,user,supervisado_por',
    });

    return {
      success: true,
      data: records,
      message: 'Búsqueda por rango de fechas completada',
    };
  } catch (error: any) {
    console.error('❌ Error en búsqueda por fechas:', error);
    throw {
      success: false,
      message: error?.message || 'Error en la búsqueda por fechas',
      error,
    };
  }
}

/**
 * Buscar registros de limpieza y desinfección por número de silo
 */
export async function searchLimpiezaDesinfeccionBySilo(
  token: string,
  userId: string,
  nroSilo: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && nro_silo~"${nroSilo}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('limpieza_desinfeccion').getList(1, 50, {
      filter,
      sort: '-created',
      expand: 'farm,user,supervisado_por',
    });

    return {
      success: true,
      data: records,
      message: 'Búsqueda por número de silo completada',
    };
  } catch (error: any) {
    console.error('❌ Error en búsqueda por silo:', error);
    throw {
      success: false,
      message: error?.message || 'Error en la búsqueda por silo',
      error,
    };
  }
}

/**
 * Buscar registros de limpieza y desinfección por operario
 */
export async function searchLimpiezaDesinfeccionByOperario(
  token: string,
  userId: string,
  operario: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && operario~"${operario}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('limpieza_desinfeccion').getList(1, 50, {
      filter,
      sort: '-created',
      expand: 'farm,user,supervisado_por',
    });

    return {
      success: true,
      data: records,
      message: 'Búsqueda por operario completada',
    };
  } catch (error: any) {
    console.error('❌ Error en búsqueda por operario:', error);
    throw {
      success: false,
      message: error?.message || 'Error en la búsqueda por operario',
      error,
    };
  }
}

export default {
  listLimpiezaDesinfeccion,
  getLimpiezaDesinfeccionById,
  getLimpiezaDesinfeccionByFarmId,
  createLimpiezaDesinfeccion,
  updateLimpiezaDesinfeccion,
  deleteLimpiezaDesinfeccion,
  searchLimpiezaDesinfeccionBySupervisor,
  searchLimpiezaDesinfeccionByDateRange,
  searchLimpiezaDesinfeccionBySilo,
  searchLimpiezaDesinfeccionByOperario,
};
