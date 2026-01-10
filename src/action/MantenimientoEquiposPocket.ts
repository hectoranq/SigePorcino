import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de mantenimiento de equipos
export interface MantenimientoEquipos {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  nombre_equipo: string;
  fecha: string; // ISO 8601 date string
  revision: string;
  proxima_revision: string; // ISO 8601 date string
  observaciones?: string;
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

/**
 * List/Search - Obtener todos los registros de mantenimiento de equipos
 * GET /api/collections/mantenimiento_equipos/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de registros
 */
export async function listMantenimientoEquipos(
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

    const records = await pb.collection('mantenimiento_equipos').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user',
    });

    console.log(`✅ Registros de mantenimiento de equipos obtenidos: ${records.items.length}`);
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
 * GET /api/collections/mantenimiento_equipos/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del registro
 */
export async function getMantenimientoEquiposById(
  token: string,
  id: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('mantenimiento_equipos').getOne(id, {
      expand: 'farm,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Registro obtenido: ${record.nombre_equipo}`);
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
export async function getMantenimientoEquiposByFarmId(
  farmId: string,
  token: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('mantenimiento_equipos').getList(1, 100, {
      filter: `farm="${farmId}" && user="${userId}"`,
      sort: '-fecha',
      expand: 'farm,user',
    });

    console.log(`✅ Registros de mantenimiento de equipos de la granja obtenidos: ${records.items.length}`);
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
 * Create - Crear un nuevo registro de mantenimiento de equipos
 * POST /api/collections/mantenimiento_equipos/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos del registro
 * @returns Registro creado
 */
export async function createMantenimientoEquipos(
  token: string,
  data: Omit<MantenimientoEquipos, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.nombre_equipo || !data.fecha || !data.revision) {
      throw new Error('Faltan campos requeridos: nombre_equipo, fecha, revision');
    }

    if (!data.proxima_revision) {
      throw new Error('Falta campo requerido: proxima_revision');
    }

    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    const record = await pb.collection('mantenimiento_equipos').create(data);

    console.log(`✅ Registro creado: ${record.nombre_equipo}`);
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
 * PATCH /api/collections/mantenimiento_equipos/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateMantenimientoEquipos(
  token: string,
  id: string,
  data: Partial<Omit<MantenimientoEquipos, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>>,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('mantenimiento_equipos').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const record = await pb.collection('mantenimiento_equipos').update(id, data);

    console.log(`✅ Registro actualizado: ${record.nombre_equipo}`);
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
 * DELETE /api/collections/mantenimiento_equipos/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteMantenimientoEquipos(
  token: string,
  id: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('mantenimiento_equipos').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('mantenimiento_equipos').delete(id);

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
 * Buscar registros por nombre de equipo
 */
export async function searchByNombreEquipo(
  token: string,
  nombreEquipo: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && nombre_equipo~"${nombreEquipo}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('mantenimiento_equipos').getList(1, 50, {
      filter,
      expand: 'farm,user',
      sort: '-fecha',
    });

    console.log(`✅ Registros encontrados por nombre de equipo: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Registros encontrados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error en búsqueda por nombre de equipo:', error);
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

    const records = await pb.collection('mantenimiento_equipos').getList(1, 100, {
      filter,
      expand: 'farm,user',
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
 * Buscar equipos con próxima revisión en un rango de fechas
 * Útil para alertas de mantenimientos próximos
 */
export async function searchByProximaRevision(
  token: string,
  userId: string,
  startDate: string,
  endDate: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && proxima_revision>="${startDate}" && proxima_revision<="${endDate}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('mantenimiento_equipos').getList(1, 100, {
      filter,
      expand: 'farm,user',
      sort: 'proxima_revision',
    });

    console.log(`✅ Equipos con próxima revisión encontrados: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Equipos encontrados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error en búsqueda por próxima revisión:', error);
    throw {
      success: false,
      message: error?.message || 'Error en búsqueda',
      error,
    };
  }
}

/**
 * Obtener equipos con revisión vencida
 * Busca equipos cuya próxima revisión ya pasó
 */
export async function getEquiposConRevisionVencida(
  token: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const today = new Date().toISOString().split('T')[0];
    let filter = `user="${userId}" && proxima_revision<"${today}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('mantenimiento_equipos').getList(1, 100, {
      filter,
      expand: 'farm,user',
      sort: 'proxima_revision',
    });

    console.log(`✅ Equipos con revisión vencida: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Equipos con revisión vencida obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener equipos con revisión vencida:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener equipos',
      error,
    };
  }
}
