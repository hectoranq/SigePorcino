import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de arco de desinfección
export interface ArcoDesinfeccion {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  producto_empleado: string;
  cantidad_empleada: number;
  fecha: string; // ISO 8601 date string
  responsable: string; // ID del personal responsable (relación con staff)
  sistema_arco: boolean;
  sistema_vado: boolean;
  sistema_mochila: boolean;
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

// Tipo para crear un nuevo registro (sin id, created, updated)
export type CreateArcoDesinfeccionData = Omit<
  ArcoDesinfeccion,
  'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'
>;

// Tipo para actualizar un registro (campos parciales)
export type UpdateArcoDesinfeccionData = Partial<
  Omit<ArcoDesinfeccion, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
>;

/**
 * List/Search - Obtener todos los registros de arco de desinfección
 * GET /api/collections/arco_desinfeccion/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de registros de arco de desinfección
 */
export async function listArcoDesinfeccion(
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

    const records = await pb.collection('arco_desinfeccion').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user,responsable',
    });

    console.log(`✅ Registros de arco de desinfección obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Registros de arco de desinfección obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registros de arco de desinfección:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registros de arco de desinfección',
      error,
    };
  }
}

/**
 * View - Obtener un registro específico de arco de desinfección por ID
 * GET /api/collections/arco_desinfeccion/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del registro de arco de desinfección
 */
export async function getArcoDesinfeccionById(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('arco_desinfeccion').getOne(id, {
      expand: 'farm,user,responsable',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Registro de arco de desinfección obtenido: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Registro de arco de desinfección obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registro de arco de desinfección:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registro de arco de desinfección',
      error,
    };
  }
}

/**
 * Obtener registros de arco de desinfección por Farm ID
 * @param token - Token de autenticación
 * @param farmId - ID de la granja
 * @param userId - ID del usuario autenticado
 * @returns Registros de arco de desinfección de la granja
 */
export async function getArcoDesinfeccionByFarmId(
  token: string,
  farmId: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('arco_desinfeccion').getList(1, 50, {
      filter: `user="${userId}" && farm="${farmId}"`,
      sort: '-created',
      expand: 'farm,user,responsable',
    });

    console.log(`✅ Registros de arco de desinfección de la granja obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Registros de arco de desinfección obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registros de arco de desinfección por granja:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registros de arco de desinfección',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de arco de desinfección
 * POST /api/collections/arco_desinfeccion/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos del registro de arco de desinfección
 * @returns Registro creado
 */
export async function createArcoDesinfeccion(
  token: string,
  data: CreateArcoDesinfeccionData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.producto_empleado || !data.fecha || !data.responsable) {
      throw new Error('Faltan campos requeridos: producto_empleado, fecha, responsable');
    }

    // Validar relaciones
    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    const record = await pb.collection('arco_desinfeccion').create(data);

    console.log(`✅ Registro de arco de desinfección creado: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Registro de arco de desinfección creado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear registro de arco de desinfección:', error);

    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al crear registro de arco de desinfección',
        errors: pbError.data || {},
      };
    }

    throw {
      success: false,
      message: error?.message || 'Error al crear registro de arco de desinfección',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro de arco de desinfección existente
 * PATCH /api/collections/arco_desinfeccion/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateArcoDesinfeccion(
  token: string,
  id: string,
  data: UpdateArcoDesinfeccionData,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('arco_desinfeccion').getOne(id);

    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const record = await pb.collection('arco_desinfeccion').update(id, data);

    console.log(`✅ Registro de arco de desinfección actualizado: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Registro de arco de desinfección actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar registro de arco de desinfección:', error);

    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al actualizar registro de arco de desinfección',
        errors: pbError.data || {},
      };
    }

    throw {
      success: false,
      message: error?.message || 'Error al actualizar registro de arco de desinfección',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro de arco de desinfección
 * DELETE /api/collections/arco_desinfeccion/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteArcoDesinfeccion(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('arco_desinfeccion').getOne(id);

    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('arco_desinfeccion').delete(id);

    console.log(`✅ Registro de arco de desinfección eliminado: ${id}`);
    return {
      success: true,
      message: 'Registro de arco de desinfección eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar registro de arco de desinfección:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar registro de arco de desinfección',
      error,
    };
  }
}

/**
 * Funciones auxiliares
 */

/**
 * Buscar registros de arco de desinfección por responsable
 */
export async function searchArcoDesinfeccionByResponsable(
  token: string,
  responsableId: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('arco_desinfeccion').getList(1, 50, {
      filter: `user="${userId}" && responsable="${responsableId}"`,
      expand: 'farm,user,responsable',
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
 * Buscar registros de arco de desinfección por rango de fechas
 */
export async function searchArcoDesinfeccionByDateRange(
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

    const records = await pb.collection('arco_desinfeccion').getList(1, 50, {
      filter,
      sort: '-fecha',
      expand: 'farm,user,responsable',
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
 * Buscar registros de arco de desinfección por tipo de sistema
 */
export async function searchArcoDesinfeccionBySistema(
  token: string,
  userId: string,
  arco?: boolean,
  vado?: boolean,
  mochila?: boolean,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}"`;
    
    if (arco !== undefined) {
      filter += ` && sistema_arco = ${arco}`;
    }
    
    if (vado !== undefined) {
      filter += ` && sistema_vado = ${vado}`;
    }
    
    if (mochila !== undefined) {
      filter += ` && sistema_mochila = ${mochila}`;
    }
    
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('arco_desinfeccion').getList(1, 50, {
      filter,
      sort: '-created',
      expand: 'farm,user,responsable',
    });

    return {
      success: true,
      data: records,
      message: 'Búsqueda por sistema completada',
    };
  } catch (error: any) {
    console.error('❌ Error en búsqueda por sistema:', error);
    throw {
      success: false,
      message: error?.message || 'Error en la búsqueda por sistema',
      error,
    };
  }
}

export default {
  listArcoDesinfeccion,
  getArcoDesinfeccionById,
  getArcoDesinfeccionByFarmId,
  createArcoDesinfeccion,
  updateArcoDesinfeccion,
  deleteArcoDesinfeccion,
  searchArcoDesinfeccionByResponsable,
  searchArcoDesinfeccionByDateRange,
  searchArcoDesinfeccionBySistema,
};
