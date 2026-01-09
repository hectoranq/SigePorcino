import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de limpieza y desinfección de tuberías
export interface LimpiezaDesinfeccionTuberias {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  producto_empleado: string;
  fecha: string; // ISO 8601 date string
  operario: string;
  supervisado_por: string; // ID del staff relacionado
  nro_tuberia: string;
  observaciones?: string;
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

/**
 * List/Search - Obtener todos los registros de limpieza y desinfección de tuberías
 * GET /api/collections/limpieza_desinfeccion_tuberias/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de registros
 */
export async function listLimpiezaDesinfeccionTuberias(
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

    const records = await pb.collection('limpieza_desinfeccion_tuberias').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user,supervisado_por',
    });

    console.log(`✅ Registros de limpieza de tuberías obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Registros obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registros:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registros',
      error,
    };
  }
}

/**
 * View - Obtener un registro específico por ID
 * GET /api/collections/limpieza_desinfeccion_tuberias/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del registro
 */
export async function getLimpiezaDesinfeccionTuberiasById(
  token: string,
  id: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('limpieza_desinfeccion_tuberias').getOne(id, {
      expand: 'farm,user,supervisado_por',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Registro obtenido: ${record.producto_empleado}`);
    return {
      success: true,
      data: record,
      message: 'Registro obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registro:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registro',
      error,
    };
  }
}

/**
 * Get by Farm - Obtener todos los registros de una granja específica
 * @param farmId - ID de la granja
 * @param token - Token de autenticación
 * @param userId - ID del usuario autenticado
 * @returns Lista de registros de la granja
 */
export async function getLimpiezaDesinfeccionTuberiasByFarmId(
  farmId: string,
  token: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('limpieza_desinfeccion_tuberias').getList(1, 100, {
      filter: `farm="${farmId}" && user="${userId}"`,
      sort: '-fecha',
      expand: 'farm,user,supervisado_por',
    });

    console.log(`✅ Registros de limpieza de tuberías de la granja obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Registros de la granja obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registros de la granja:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registros de la granja',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de limpieza y desinfección de tuberías
 * POST /api/collections/limpieza_desinfeccion_tuberias/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos del registro
 * @returns Registro creado
 */
export async function createLimpiezaDesinfeccionTuberias(
  token: string,
  data: Omit<LimpiezaDesinfeccionTuberias, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.producto_empleado || !data.fecha || !data.operario) {
      throw new Error('Faltan campos requeridos: producto_empleado, fecha, operario');
    }

    if (!data.nro_tuberia || !data.supervisado_por) {
      throw new Error('Faltan campos requeridos: nro_tuberia, supervisado_por');
    }

    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    const record = await pb.collection('limpieza_desinfeccion_tuberias').create(data);

    console.log(`✅ Registro creado: ${record.producto_empleado}`);
    return {
      success: true,
      data: record,
      message: 'Registro creado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear registro:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al crear registro',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al crear registro',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro existente
 * PATCH /api/collections/limpieza_desinfeccion_tuberias/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateLimpiezaDesinfeccionTuberias(
  token: string,
  id: string,
  data: Partial<Omit<LimpiezaDesinfeccionTuberias, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>>,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('limpieza_desinfeccion_tuberias').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const record = await pb.collection('limpieza_desinfeccion_tuberias').update(id, data);

    console.log(`✅ Registro actualizado: ${record.producto_empleado}`);
    return {
      success: true,
      data: record,
      message: 'Registro actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar registro:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al actualizar registro',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al actualizar registro',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro
 * DELETE /api/collections/limpieza_desinfeccion_tuberias/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteLimpiezaDesinfeccionTuberias(
  token: string,
  id: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('limpieza_desinfeccion_tuberias').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('limpieza_desinfeccion_tuberias').delete(id);

    console.log(`✅ Registro eliminado: ${id}`);
    return {
      success: true,
      message: 'Registro eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar registro:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar registro',
      error,
    };
  }
}

/**
 * Funciones auxiliares
 */

/**
 * Buscar registros por supervisor
 */
export async function searchBySupervisor(
  token: string,
  supervisorId: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('limpieza_desinfeccion_tuberias').getList(1, 50, {
      filter: `user="${userId}" && supervisado_por="${supervisorId}"`,
      expand: 'farm,user,supervisado_por',
      sort: '-fecha',
    });

    console.log(`✅ Registros encontrados por supervisor: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Registros encontrados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error en búsqueda por supervisor:', error);
    throw {
      success: false,
      message: error?.message || 'Error en búsqueda',
      error,
    };
  }
}

/**
 * Buscar registros por rango de fechas
 */
export async function searchByDateRange(
  token: string,
  userId: string,
  startDate: string,
  endDate: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && fecha>="${startDate}" && fecha<="${endDate}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('limpieza_desinfeccion_tuberias').getList(1, 100, {
      filter,
      expand: 'farm,user,supervisado_por',
      sort: '-fecha',
    });

    console.log(`✅ Registros encontrados en rango de fechas: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Registros encontrados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error en búsqueda por rango de fechas:', error);
    throw {
      success: false,
      message: error?.message || 'Error en búsqueda',
      error,
    };
  }
}

/**
 * Buscar registros por número de tubería
 */
export async function searchByNroTuberia(
  token: string,
  nroTuberia: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && nro_tuberia~"${nroTuberia}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('limpieza_desinfeccion_tuberias').getList(1, 50, {
      filter,
      expand: 'farm,user,supervisado_por',
      sort: '-fecha',
    });

    console.log(`✅ Registros encontrados por número de tubería: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Registros encontrados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error en búsqueda por número de tubería:', error);
    throw {
      success: false,
      message: error?.message || 'Error en búsqueda',
      error,
    };
  }
}

/**
 * Buscar registros por operario
 */
export async function searchByOperario(
  token: string,
  operario: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && operario~"${operario}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('limpieza_desinfeccion_tuberias').getList(1, 50, {
      filter,
      expand: 'farm,user,supervisado_por',
      sort: '-fecha',
    });

    console.log(`✅ Registros encontrados por operario: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Registros encontrados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error en búsqueda por operario:', error);
    throw {
      success: false,
      message: error?.message || 'Error en búsqueda',
      error,
    };
  }
}
