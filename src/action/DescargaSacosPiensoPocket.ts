import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de descarga de sacos de pienso
export interface DescargaSacosPienso {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  transportista: string;
  matricula: string;
  fecha_finalizacion: string; // ISO 8601 date string
  tipo_pienso: string;
  nro_sacos: number;
  nro_lote: string;
  kg: number;
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

/**
 * List/Search - Obtener todos los registros de descarga de sacos de pienso
 * GET /api/collections/descarga_sacos_pienso/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de descargas de sacos de pienso
 */
export async function listDescargaSacosPienso(
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

    const records = await pb.collection('descarga_sacos_pienso').getList(page, perPage, {
      filter,
      sort: '-fecha_finalizacion',
      expand: 'farm,user',
    });

    console.log(`✅ Descargas de sacos de pienso obtenidas: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Descargas de sacos de pienso obtenidas exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener descargas de sacos de pienso:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener descargas de sacos de pienso',
      error,
    };
  }
}

/**
 * View - Obtener un registro específico por ID
 * GET /api/collections/descarga_sacos_pienso/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del registro
 */
export async function getDescargaSacosPienso(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('descarga_sacos_pienso').getOne(id, {
      expand: 'farm,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Descarga de sacos de pienso obtenida: ${record.nro_lote}`);
    return {
      success: true,
      data: record,
      message: 'Descarga de sacos de pienso obtenida exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener descarga de sacos de pienso:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener descarga de sacos de pienso',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de descarga de sacos de pienso
 * POST /api/collections/descarga_sacos_pienso/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos de la descarga
 * @returns Registro creado
 */
export async function createDescargaSacosPienso(
  token: string,
  data: Omit<DescargaSacosPienso, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.transportista || !data.matricula || !data.fecha_finalizacion || !data.tipo_pienso) {
      throw new Error('Faltan campos requeridos: transportista, matricula, fecha_finalizacion, tipo_pienso');
    }

    if (data.nro_sacos === undefined || data.kg === undefined) {
      throw new Error('Faltan campos numéricos requeridos: nro_sacos, kg');
    }

    if (!data.nro_lote) {
      throw new Error('Falta campo requerido: nro_lote');
    }

    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    const record = await pb.collection('descarga_sacos_pienso').create(data);

    console.log(`✅ Descarga de sacos de pienso creada: Lote ${record.nro_lote}`);
    return {
      success: true,
      data: record,
      message: 'Descarga de sacos de pienso registrada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear descarga de sacos de pienso:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al crear descarga de sacos de pienso',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al crear descarga de sacos de pienso',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro de descarga de sacos de pienso existente
 * PATCH /api/collections/descarga_sacos_pienso/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateDescargaSacosPienso(
  token: string,
  id: string,
  data: Partial<Omit<DescargaSacosPienso, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>>,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('descarga_sacos_pienso').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const record = await pb.collection('descarga_sacos_pienso').update(id, data);

    console.log(`✅ Descarga de sacos de pienso actualizada: Lote ${record.nro_lote}`);
    return {
      success: true,
      data: record,
      message: 'Descarga de sacos de pienso actualizada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar descarga de sacos de pienso:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al actualizar descarga de sacos de pienso',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al actualizar descarga de sacos de pienso',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro de descarga de sacos de pienso
 * DELETE /api/collections/descarga_sacos_pienso/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteDescargaSacosPienso(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('descarga_sacos_pienso').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('descarga_sacos_pienso').delete(id);

    console.log(`✅ Descarga de sacos de pienso eliminada: ${id}`);
    return {
      success: true,
      message: 'Descarga de sacos de pienso eliminada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar descarga de sacos de pienso:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar descarga de sacos de pienso',
      error,
    };
  }
}

/**
 * Funciones auxiliares
 */

/**
 * Buscar descargas por número de lote
 */
export async function searchByNroLote(token: string, nroLote: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('descarga_sacos_pienso').getList(1, 50, {
      filter: `user="${userId}" && nro_lote~"${nroLote}"`,
      sort: '-fecha_finalizacion',
      expand: 'farm,user',
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
 * Buscar descargas por transportista
 */
export async function searchByTransportista(
  token: string,
  transportista: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('descarga_sacos_pienso').getList(1, 50, {
      filter: `user="${userId}" && transportista~"${transportista}"`,
      sort: '-fecha_finalizacion',
      expand: 'farm,user',
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
 * Buscar descargas por rango de fechas
 */
export async function searchByDateRange(
  token: string,
  startDate: string,
  endDate: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && fecha_finalizacion >= "${startDate}" && fecha_finalizacion <= "${endDate}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('descarga_sacos_pienso').getList(1, 100, {
      filter,
      sort: '-fecha_finalizacion',
      expand: 'farm,user',
    });

    return {
      success: true,
      data: records,
      message: 'Búsqueda por rango de fechas completada',
    };
  } catch (error: any) {
    console.error('❌ Error en búsqueda por rango de fechas:', error);
    throw {
      success: false,
      message: error?.message || 'Error en la búsqueda por rango de fechas',
      error,
    };
  }
}

/**
 * Obtener totales por tipo de pienso en un período
 */
export async function getTotalesByTipoPienso(
  token: string,
  userId: string,
  farmId?: string,
  startDate?: string,
  endDate?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }
    if (startDate && endDate) {
      filter += ` && fecha_finalizacion >= "${startDate}" && fecha_finalizacion <= "${endDate}"`;
    }

    const records = await pb.collection('descarga_sacos_pienso').getList(1, 500, {
      filter,
    });

    // Agrupar por tipo de pienso
    const totalesPorTipo: { [key: string]: { sacos: number; kg: number; descargas: number } } = {};
    
    records.items.forEach((item: any) => {
      const tipo = item.tipo_pienso;
      if (!totalesPorTipo[tipo]) {
        totalesPorTipo[tipo] = { sacos: 0, kg: 0, descargas: 0 };
      }
      totalesPorTipo[tipo].sacos += item.nro_sacos || 0;
      totalesPorTipo[tipo].kg += item.kg || 0;
      totalesPorTipo[tipo].descargas += 1;
    });

    return {
      success: true,
      data: totalesPorTipo,
      message: 'Totales por tipo de pienso calculados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al calcular totales por tipo:', error);
    throw {
      success: false,
      message: error?.message || 'Error al calcular totales',
      error,
    };
  }
}

/**
 * Obtener estadísticas por transportista
 */
export async function getEstadisticasByTransportista(
  token: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('descarga_sacos_pienso').getList(1, 500, {
      filter,
    });

    // Agrupar por transportista
    const estadisticas: { [key: string]: { descargas: number; totalSacos: number; totalKg: number } } = {};
    
    records.items.forEach((item: any) => {
      const transportista = item.transportista;
      if (!estadisticas[transportista]) {
        estadisticas[transportista] = { descargas: 0, totalSacos: 0, totalKg: 0 };
      }
      estadisticas[transportista].descargas += 1;
      estadisticas[transportista].totalSacos += item.nro_sacos || 0;
      estadisticas[transportista].totalKg += item.kg || 0;
    });

    return {
      success: true,
      data: estadisticas,
      message: 'Estadísticas por transportista calculadas exitosamente',
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

/**
 * Obtener resumen general por granja
 */
export async function getResumenByFarm(
  token: string,
  userId: string,
  farmId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('descarga_sacos_pienso').getList(1, 500, {
      filter: `user="${userId}" && farm="${farmId}"`,
      sort: '-fecha_finalizacion',
    });

    const totalDescargas = records.items.length;
    const totalSacos = records.items.reduce((sum: number, item: any) => sum + (item.nro_sacos || 0), 0);
    const totalKg = records.items.reduce((sum: number, item: any) => sum + (item.kg || 0), 0);

    // Tipos de pienso únicos
    const tiposPienso = [...new Set(records.items.map((item: any) => item.tipo_pienso))];

    // Transportistas únicos
    const transportistas = [...new Set(records.items.map((item: any) => item.transportista))];

    return {
      success: true,
      data: {
        totalDescargas,
        totalSacos,
        totalKg,
        tiposPiensoUnicos: tiposPienso.length,
        transportistasUnicos: transportistas.length,
        tiposPienso,
        transportistas,
      },
      message: 'Resumen por granja obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener resumen:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener resumen',
      error,
    };
  }
}

export default {
  listDescargaSacosPienso,
  getDescargaSacosPienso,
  createDescargaSacosPienso,
  updateDescargaSacosPienso,
  deleteDescargaSacosPienso,
  searchByNroLote,
  searchByTransportista,
  searchByDateRange,
  getTotalesByTipoPienso,
  getEstadisticasByTransportista,
  getResumenByFarm,
};
