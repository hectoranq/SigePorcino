import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de desratización
export interface Desratizacion {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  aplicador: string;
  dni: string;
  rodenticida: string;
  cebo_atrayente: string;
  trampa_adhesiva: string;
  fecha: string; // ISO 8601 date string
  supervisado: string; // ID del personal supervisor (relación con staff)
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

// Tipo para crear un nuevo registro (sin id, created, updated)
export type CreateDesratizacionData = Omit<
  Desratizacion,
  'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'
>;

// Tipo para actualizar un registro (campos parciales)
export type UpdateDesratizacionData = Partial<
  Omit<Desratizacion, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
>;

/**
 * List/Search - Obtener todos los registros de desratización
 * GET /api/collections/desratizacion/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de registros de desratización
 */
export async function listDesratizacion(
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

    const records = await pb.collection('desratizacion').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user,supervisado',
    });

    console.log(`✅ Registros de desratización obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Registros de desratización obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registros de desratización:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registros de desratización',
      error,
    };
  }
}

/**
 * View - Obtener un registro específico de desratización por ID
 * GET /api/collections/desratizacion/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del registro de desratización
 */
export async function getDesratizacionById(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('desratizacion').getOne(id, {
      expand: 'farm,user,supervisado',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Registro de desratización obtenido: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Registro de desratización obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registro de desratización:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registro de desratización',
      error,
    };
  }
}

/**
 * Obtener registros de desratización por Farm ID
 * @param token - Token de autenticación
 * @param farmId - ID de la granja
 * @param userId - ID del usuario autenticado
 * @returns Registros de desratización de la granja
 */
export async function getDesratizacionByFarmId(
  token: string,
  farmId: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('desratizacion').getList(1, 50, {
      filter: `user="${userId}" && farm="${farmId}"`,
      sort: '-created',
      expand: 'farm,user,supervisado',
    });

    console.log(`✅ Registros de desratización de la granja obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Registros de desratización obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registros de desratización por granja:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registros de desratización',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de desratización
 * POST /api/collections/desratizacion/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos del registro de desratización
 * @returns Registro creado
 */
export async function createDesratizacion(
  token: string,
  data: CreateDesratizacionData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.aplicador || !data.dni || !data.fecha) {
      throw new Error('Faltan campos requeridos: aplicador, dni, fecha');
    }

    // Validar relaciones
    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    const record = await pb.collection('desratizacion').create(data);

    console.log(`✅ Registro de desratización creado: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Registro de desratización creado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear registro de desratización:', error);

    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al crear registro de desratización',
        errors: pbError.data || {},
      };
    }

    throw {
      success: false,
      message: error?.message || 'Error al crear registro de desratización',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro de desratización existente
 * PATCH /api/collections/desratizacion/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateDesratizacion(
  token: string,
  id: string,
  data: UpdateDesratizacionData,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('desratizacion').getOne(id);

    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const record = await pb.collection('desratizacion').update(id, data);

    console.log(`✅ Registro de desratización actualizado: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Registro de desratización actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar registro de desratización:', error);

    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al actualizar registro de desratización',
        errors: pbError.data || {},
      };
    }

    throw {
      success: false,
      message: error?.message || 'Error al actualizar registro de desratización',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro de desratización
 * DELETE /api/collections/desratizacion/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteDesratizacion(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('desratizacion').getOne(id);

    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('desratizacion').delete(id);

    console.log(`✅ Registro de desratización eliminado: ${id}`);
    return {
      success: true,
      message: 'Registro de desratización eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar registro de desratización:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar registro de desratización',
      error,
    };
  }
}

/**
 * Funciones auxiliares
 */

/**
 * Buscar registros de desratización por DNI del aplicador
 */
export async function searchDesratizacionByDni(token: string, dni: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('desratizacion').getList(1, 50, {
      filter: `user="${userId}" && dni~"${dni}"`,
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
 * Buscar registros de desratización por rango de fechas
 */
export async function searchDesratizacionByDateRange(
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

    const records = await pb.collection('desratizacion').getList(1, 50, {
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

export default {
  listDesratizacion,
  getDesratizacionById,
  getDesratizacionByFarmId,
  createDesratizacion,
  updateDesratizacion,
  deleteDesratizacion,
  searchDesratizacionByDni,
  searchDesratizacionByDateRange,
};
