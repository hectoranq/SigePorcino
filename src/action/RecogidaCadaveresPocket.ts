import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de recogida de cadáveres
export interface RecogidaCadaveres {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  conductor: string;
  empresa_responsable: string;
  kg: number;
  fecha: string; // ISO 8601 date string
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

/**
 * List/Search - Obtener todos los registros de recogida de cadáveres
 * GET /api/collections/recogida_cadaveres/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de registros
 */
export async function listRecogidaCadaveres(
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

    const records = await pb.collection('recogida_cadaveres').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user',
    });

    console.log(`✅ Registros de recogida de cadáveres obtenidos: ${records.items.length}`);
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
 * GET /api/collections/recogida_cadaveres/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del registro
 */
export async function getRecogidaCadaveresById(
  token: string,
  id: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('recogida_cadaveres').getOne(id, {
      expand: 'farm,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Registro obtenido: ${record.conductor}`);
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
export async function getRecogidaCadaveresByFarmId(
  farmId: string,
  token: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('recogida_cadaveres').getList(1, 100, {
      filter: `farm="${farmId}" && user="${userId}"`,
      sort: '-fecha',
      expand: 'farm,user',
    });

    console.log(`✅ Registros de recogida de cadáveres de la granja obtenidos: ${records.items.length}`);
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
 * Create - Crear un nuevo registro de recogida de cadáveres
 * POST /api/collections/recogida_cadaveres/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos del registro
 * @returns Registro creado
 */
export async function createRecogidaCadaveres(
  token: string,
  data: Omit<RecogidaCadaveres, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.conductor || !data.empresa_responsable || !data.fecha) {
      throw new Error('Faltan campos requeridos: conductor, empresa_responsable, fecha');
    }

    if (data.kg === undefined || data.kg === null) {
      throw new Error('Falta campo requerido: kg');
    }

    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    const record = await pb.collection('recogida_cadaveres').create(data);

    console.log(`✅ Registro creado: ${record.conductor} - ${record.kg}kg`);
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
 * PATCH /api/collections/recogida_cadaveres/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateRecogidaCadaveres(
  token: string,
  id: string,
  data: Partial<Omit<RecogidaCadaveres, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>>,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('recogida_cadaveres').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const record = await pb.collection('recogida_cadaveres').update(id, data);

    console.log(`✅ Registro actualizado: ${record.conductor} - ${record.kg}kg`);
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
 * DELETE /api/collections/recogida_cadaveres/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteRecogidaCadaveres(
  token: string,
  id: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('recogida_cadaveres').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('recogida_cadaveres').delete(id);

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
 * Buscar registros por empresa responsable
 */
export async function searchByEmpresa(
  token: string,
  empresa: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && empresa_responsable~"${empresa}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('recogida_cadaveres').getList(1, 50, {
      filter,
      expand: 'farm,user',
      sort: '-fecha',
    });

    console.log(`✅ Registros encontrados por empresa: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Registros encontrados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error en búsqueda por empresa:', error);
    throw {
      success: false,
      message: error?.message || 'Error en búsqueda',
      error,
    };
  }
}

/**
 * Buscar registros por conductor
 */
export async function searchByConductor(
  token: string,
  conductor: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && conductor~"${conductor}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('recogida_cadaveres').getList(1, 50, {
      filter,
      expand: 'farm,user',
      sort: '-fecha',
    });

    console.log(`✅ Registros encontrados por conductor: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Registros encontrados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error en búsqueda por conductor:', error);
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

    const records = await pb.collection('recogida_cadaveres').getList(1, 100, {
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
 * Calcular total de kilogramos recogidos en un periodo
 */
export async function getTotalKgByPeriod(
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

    const records = await pb.collection('recogida_cadaveres').getList(1, 500, {
      filter,
      expand: 'farm,user',
    });

    const totalKg = records.items.reduce((sum, record) => sum + (record.kg || 0), 0);

    console.log(`✅ Total de kg en periodo: ${totalKg}kg de ${records.items.length} registros`);
    return {
      success: true,
      data: {
        totalKg,
        totalRegistros: records.items.length,
        registros: records.items,
      },
      message: 'Total calculado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al calcular total de kg:', error);
    throw {
      success: false,
      message: error?.message || 'Error al calcular total',
      error,
    };
  }
}

/**
 * Obtener estadísticas por empresa en un periodo
 */
export async function getEstadisticasByEmpresa(
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

    const records = await pb.collection('recogida_cadaveres').getList(1, 500, {
      filter,
      expand: 'farm,user',
    });

    // Agrupar por empresa
    const estadisticas: { [key: string]: { totalKg: number; totalRecogidas: number } } = {};
    
    records.items.forEach((record) => {
      const empresa = record.empresa_responsable;
      if (!estadisticas[empresa]) {
        estadisticas[empresa] = { totalKg: 0, totalRecogidas: 0 };
      }
      estadisticas[empresa].totalKg += record.kg || 0;
      estadisticas[empresa].totalRecogidas += 1;
    });

    console.log(`✅ Estadísticas por empresa calculadas: ${Object.keys(estadisticas).length} empresas`);
    return {
      success: true,
      data: estadisticas,
      message: 'Estadísticas calculadas exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al calcular estadísticas:', error);
    throw {
      success: false,
      message: error?.message || 'Error al calcular estadísticas',
      error,
    };
  }
}
