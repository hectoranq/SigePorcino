import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de desinsectación
export interface Desinsectacion {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  producto_empleado: string;
  donde_se_empleo: string;
  aplicador: string;
  fecha: string; // ISO 8601 date string
  supervisado: string; // ID del personal supervisor (relación con staff)
  tipo_producto_lavado: boolean;
  tipo_producto_desinfectante: boolean;
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

// Tipo para crear un nuevo registro (sin id, created, updated)
export type CreateDesinsectacionData = Omit<
  Desinsectacion,
  'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'
>;

// Tipo para actualizar un registro (campos parciales)
export type UpdateDesinsectacionData = Partial<
  Omit<Desinsectacion, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
>;

/**
 * List/Search - Obtener todos los registros de desinsectación
 * GET /api/collections/desinsectacion/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de registros de desinsectación
 */
export async function listDesinsectacion(
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

    const records = await pb.collection('desinsectacion').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user,supervisado',
    });

    console.log(`✅ Registros de desinsectación obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Registros de desinsectación obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registros de desinsectación:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registros de desinsectación',
      error,
    };
  }
}

/**
 * View - Obtener un registro específico de desinsectación por ID
 * GET /api/collections/desinsectacion/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del registro de desinsectación
 */
export async function getDesinsectacionById(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('desinsectacion').getOne(id, {
      expand: 'farm,user,supervisado',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Registro de desinsectación obtenido: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Registro de desinsectación obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registro de desinsectación:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registro de desinsectación',
      error,
    };
  }
}

/**
 * Obtener registros de desinsectación por Farm ID
 * @param token - Token de autenticación
 * @param farmId - ID de la granja
 * @param userId - ID del usuario autenticado
 * @returns Registros de desinsectación de la granja
 */
export async function getDesinsectacionByFarmId(
  token: string,
  farmId: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('desinsectacion').getList(1, 50, {
      filter: `user="${userId}" && farm="${farmId}"`,
      sort: '-created',
      expand: 'farm,user,supervisado',
    });

    console.log(`✅ Registros de desinsectación de la granja obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Registros de desinsectación obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registros de desinsectación por granja:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registros de desinsectación',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de desinsectación
 * POST /api/collections/desinsectacion/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos del registro de desinsectación
 * @returns Registro creado
 */
export async function createDesinsectacion(
  token: string,
  data: CreateDesinsectacionData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.producto_empleado || !data.donde_se_empleo || !data.aplicador || !data.fecha) {
      throw new Error('Faltan campos requeridos: producto_empleado, donde_se_empleo, aplicador, fecha');
    }

    // Validar relaciones
    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    const record = await pb.collection('desinsectacion').create(data);

    console.log(`✅ Registro de desinsectación creado: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Registro de desinsectación creado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear registro de desinsectación:', error);

    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al crear registro de desinsectación',
        errors: pbError.data || {},
      };
    }

    throw {
      success: false,
      message: error?.message || 'Error al crear registro de desinsectación',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro de desinsectación existente
 * PATCH /api/collections/desinsectacion/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateDesinsectacion(
  token: string,
  id: string,
  data: UpdateDesinsectacionData,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('desinsectacion').getOne(id);

    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const record = await pb.collection('desinsectacion').update(id, data);

    console.log(`✅ Registro de desinsectación actualizado: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Registro de desinsectación actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar registro de desinsectación:', error);

    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al actualizar registro de desinsectación',
        errors: pbError.data || {},
      };
    }

    throw {
      success: false,
      message: error?.message || 'Error al actualizar registro de desinsectación',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro de desinsectación
 * DELETE /api/collections/desinsectacion/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteDesinsectacion(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('desinsectacion').getOne(id);

    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('desinsectacion').delete(id);

    console.log(`✅ Registro de desinsectación eliminado: ${id}`);
    return {
      success: true,
      message: 'Registro de desinsectación eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar registro de desinsectación:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar registro de desinsectación',
      error,
    };
  }
}

/**
 * Funciones auxiliares
 */

/**
 * Buscar registros de desinsectación por aplicador
 */
export async function searchDesinsectacionByAplicador(
  token: string,
  aplicador: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('desinsectacion').getList(1, 50, {
      filter: `user="${userId}" && aplicador~"${aplicador}"`,
      expand: 'farm,user,supervisado',
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
 * Buscar registros de desinsectación por rango de fechas
 */
export async function searchDesinsectacionByDateRange(
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

    const records = await pb.collection('desinsectacion').getList(1, 50, {
      filter,
      sort: '-fecha',
      expand: 'farm,user,supervisado',
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
 * Buscar registros de desinsectación por tipo de producto
 */
export async function searchDesinsectacionByTipoProducto(
  token: string,
  userId: string,
  lavado?: boolean,
  desinfectante?: boolean,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}"`;
    
    if (lavado !== undefined) {
      filter += ` && tipo_producto_lavado = ${lavado}`;
    }
    
    if (desinfectante !== undefined) {
      filter += ` && tipo_producto_desinfectante = ${desinfectante}`;
    }
    
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('desinsectacion').getList(1, 50, {
      filter,
      sort: '-created',
      expand: 'farm,user,supervisado',
    });

    return {
      success: true,
      data: records,
      message: 'Búsqueda por tipo de producto completada',
    };
  } catch (error: any) {
    console.error('❌ Error en búsqueda por tipo de producto:', error);
    throw {
      success: false,
      message: error?.message || 'Error en la búsqueda por tipo de producto',
      error,
    };
  }
}

export default {
  listDesinsectacion,
  getDesinsectacionById,
  getDesinsectacionByFarmId,
  createDesinsectacion,
  updateDesinsectacion,
  deleteDesinsectacion,
  searchDesinsectacionByAplicador,
  searchDesinsectacionByDateRange,
  searchDesinsectacionByTipoProducto,
};
