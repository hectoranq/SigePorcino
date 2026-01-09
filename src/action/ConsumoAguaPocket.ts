import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de consumo de agua
export interface ConsumoAgua {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  cantidad_agua_bebida: number;
  cantidad_agua_limpieza: number;
  cantidad_agua_traida: number;
  consumo_total_agua: number;
  fecha: string; // ISO 8601 date string
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

/**
 * List/Search - Obtener todos los registros de consumo de agua
 * GET /api/collections/consumo_agua/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de registros de consumo de agua
 */
export async function listConsumoAgua(
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

    const records = await pb.collection('consumo_agua').getList(page, perPage, {
      filter,
      sort: '-fecha',
      expand: 'farm,user',
    });

    console.log(`✅ Registros de consumo de agua obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Registros de consumo de agua obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registros de consumo de agua:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registros de consumo de agua',
      error,
    };
  }
}

/**
 * View - Obtener un registro específico de consumo de agua por ID
 * GET /api/collections/consumo_agua/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del registro de consumo de agua
 */
export async function getConsumoAgua(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('consumo_agua').getOne(id, {
      expand: 'farm,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Registro de consumo de agua obtenido: ${record.fecha}`);
    return {
      success: true,
      data: record,
      message: 'Registro de consumo de agua obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registro de consumo de agua:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registro de consumo de agua',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de consumo de agua
 * POST /api/collections/consumo_agua/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos del registro de consumo de agua
 * @returns Registro creado
 */
export async function createConsumoAgua(
  token: string,
  data: Omit<ConsumoAgua, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (data.cantidad_agua_bebida === undefined || data.cantidad_agua_limpieza === undefined) {
      throw new Error('Faltan campos requeridos: cantidad_agua_bebida, cantidad_agua_limpieza');
    }

    if (!data.fecha) {
      throw new Error('Falta campo requerido: fecha');
    }

    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    // Calcular consumo total si no se proporciona
    if (data.consumo_total_agua === undefined) {
      data.consumo_total_agua = 
        (data.cantidad_agua_bebida || 0) + 
        (data.cantidad_agua_limpieza || 0) + 
        (data.cantidad_agua_traida || 0);
    }

    const record = await pb.collection('consumo_agua').create(data);

    console.log(`✅ Registro de consumo de agua creado: ${record.fecha}`);
    return {
      success: true,
      data: record,
      message: 'Registro de consumo de agua creado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear registro de consumo de agua:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al crear registro de consumo de agua',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al crear registro de consumo de agua',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro de consumo de agua existente
 * PATCH /api/collections/consumo_agua/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateConsumoAgua(
  token: string,
  id: string,
  data: Partial<Omit<ConsumoAgua, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>>,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('consumo_agua').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    // Recalcular consumo total si se actualizan los campos base
    if (
      data.cantidad_agua_bebida !== undefined || 
      data.cantidad_agua_limpieza !== undefined || 
      data.cantidad_agua_traida !== undefined
    ) {
      data.consumo_total_agua = 
        (data.cantidad_agua_bebida ?? existingRecord.cantidad_agua_bebida) + 
        (data.cantidad_agua_limpieza ?? existingRecord.cantidad_agua_limpieza) + 
        (data.cantidad_agua_traida ?? existingRecord.cantidad_agua_traida);
    }

    const record = await pb.collection('consumo_agua').update(id, data);

    console.log(`✅ Registro de consumo de agua actualizado: ${record.fecha}`);
    return {
      success: true,
      data: record,
      message: 'Registro de consumo de agua actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar registro de consumo de agua:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al actualizar registro de consumo de agua',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al actualizar registro de consumo de agua',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro de consumo de agua
 * DELETE /api/collections/consumo_agua/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteConsumoAgua(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('consumo_agua').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('consumo_agua').delete(id);

    console.log(`✅ Registro de consumo de agua eliminado: ${id}`);
    return {
      success: true,
      message: 'Registro de consumo de agua eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar registro de consumo de agua:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar registro de consumo de agua',
      error,
    };
  }
}

/**
 * Funciones auxiliares
 */

/**
 * Buscar registros por rango de fechas
 */
export async function searchByDateRange(
  token: string,
  userId: string,
  farmId: string,
  startDate: string,
  endDate: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('consumo_agua').getList(1, 100, {
      filter: `user="${userId}" && farm="${farmId}" && fecha >= "${startDate}" && fecha <= "${endDate}"`,
      sort: 'fecha',
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
      message: error?.message || 'Error en la búsqueda',
      error,
    };
  }
}

/**
 * Obtener estadísticas de consumo total por granja
 */
export async function getEstadisticasByFarm(
  token: string,
  userId: string,
  farmId: string,
  startDate?: string,
  endDate?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && farm="${farmId}"`;
    if (startDate && endDate) {
      filter += ` && fecha >= "${startDate}" && fecha <= "${endDate}"`;
    }

    const records = await pb.collection('consumo_agua').getFullList({
      filter,
      sort: 'fecha',
    });

    // Calcular estadísticas
    const totalBebida = records.reduce((sum: number, r: any) => sum + (r.cantidad_agua_bebida || 0), 0);
    const totalLimpieza = records.reduce((sum: number, r: any) => sum + (r.cantidad_agua_limpieza || 0), 0);
    const totalTraida = records.reduce((sum: number, r: any) => sum + (r.cantidad_agua_traida || 0), 0);
    const totalConsumo = records.reduce((sum: number, r: any) => sum + (r.consumo_total_agua || 0), 0);

    const promedioConsumo = records.length > 0 ? totalConsumo / records.length : 0;

    return {
      success: true,
      data: {
        totalRegistros: records.length,
        totalBebida: parseFloat(totalBebida.toFixed(2)),
        totalLimpieza: parseFloat(totalLimpieza.toFixed(2)),
        totalTraida: parseFloat(totalTraida.toFixed(2)),
        totalConsumo: parseFloat(totalConsumo.toFixed(2)),
        promedioConsumo: parseFloat(promedioConsumo.toFixed(2)),
        registros: records,
      },
      message: 'Estadísticas de consumo obtenidas exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener estadísticas:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener estadísticas',
      error,
    };
  }
}

/**
 * Obtener consumo promedio mensual
 */
export async function getConsumoPromedioMensual(
  token: string,
  userId: string,
  farmId: string,
  year?: number
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const currentYear = year || new Date().getFullYear();
    const startDate = `${currentYear}-01-01`;
    const endDate = `${currentYear}-12-31`;

    let filter = `user="${userId}" && farm="${farmId}" && fecha >= "${startDate}" && fecha <= "${endDate}"`;

    const records = await pb.collection('consumo_agua').getFullList({
      filter,
      sort: 'fecha',
    });

    // Agrupar por mes
    const consumoPorMes: { [key: string]: number[] } = {};
    records.forEach((record: any) => {
      const mes = record.fecha.substring(0, 7); // YYYY-MM
      if (!consumoPorMes[mes]) {
        consumoPorMes[mes] = [];
      }
      consumoPorMes[mes].push(record.consumo_total_agua || 0);
    });

    // Calcular promedio por mes
    const promediosMensuales = Object.entries(consumoPorMes).map(([mes, consumos]) => {
      const promedio = consumos.reduce((a, b) => a + b, 0) / consumos.length;
      return {
        mes,
        promedio: parseFloat(promedio.toFixed(2)),
        registros: consumos.length,
      };
    });

    return {
      success: true,
      data: promediosMensuales,
      message: 'Consumo promedio mensual obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener consumo promedio mensual:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener consumo promedio mensual',
      error,
    };
  }
}

/**
 * Obtener registros con consumo elevado (por encima de un umbral)
 */
export async function getRegistrosConsumoElevado(
  token: string,
  userId: string,
  farmId: string,
  umbral: number
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('consumo_agua').getList(1, 100, {
      filter: `user="${userId}" && farm="${farmId}" && consumo_total_agua > ${umbral}`,
      sort: '-consumo_total_agua',
      expand: 'farm,user',
    });

    return {
      success: true,
      data: records,
      message: 'Registros con consumo elevado obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registros con consumo elevado:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registros con consumo elevado',
      error,
    };
  }
}

/**
 * Obtener distribución de consumo (porcentaje de cada tipo)
 */
export async function getDistribucionConsumo(
  token: string,
  userId: string,
  farmId: string,
  startDate?: string,
  endDate?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && farm="${farmId}"`;
    if (startDate && endDate) {
      filter += ` && fecha >= "${startDate}" && fecha <= "${endDate}"`;
    }

    const records = await pb.collection('consumo_agua').getFullList({
      filter,
    });

    // Calcular totales
    const totalBebida = records.reduce((sum: number, r: any) => sum + (r.cantidad_agua_bebida || 0), 0);
    const totalLimpieza = records.reduce((sum: number, r: any) => sum + (r.cantidad_agua_limpieza || 0), 0);
    const totalTraida = records.reduce((sum: number, r: any) => sum + (r.cantidad_agua_traida || 0), 0);
    const total = totalBebida + totalLimpieza + totalTraida;

    // Calcular porcentajes
    const porcentajes = {
      bebida: total > 0 ? parseFloat(((totalBebida / total) * 100).toFixed(2)) : 0,
      limpieza: total > 0 ? parseFloat(((totalLimpieza / total) * 100).toFixed(2)) : 0,
      traida: total > 0 ? parseFloat(((totalTraida / total) * 100).toFixed(2)) : 0,
    };

    return {
      success: true,
      data: {
        totales: {
          bebida: parseFloat(totalBebida.toFixed(2)),
          limpieza: parseFloat(totalLimpieza.toFixed(2)),
          traida: parseFloat(totalTraida.toFixed(2)),
          total: parseFloat(total.toFixed(2)),
        },
        porcentajes,
        registrosAnalizados: records.length,
      },
      message: 'Distribución de consumo obtenida exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener distribución de consumo:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener distribución de consumo',
      error,
    };
  }
}

/**
 * Obtener último registro de consumo de agua para una granja
 */
export async function getUltimoRegistro(
  token: string,
  userId: string,
  farmId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('consumo_agua').getList(1, 1, {
      filter: `user="${userId}" && farm="${farmId}"`,
      sort: '-fecha',
      expand: 'farm,user',
    });

    if (records.items.length === 0) {
      return {
        success: true,
        data: null,
        message: 'No se encontraron registros',
      };
    }

    return {
      success: true,
      data: records.items[0],
      message: 'Último registro obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener último registro:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener último registro',
      error,
    };
  }
}

export default {
  listConsumoAgua,
  getConsumoAgua,
  createConsumoAgua,
  updateConsumoAgua,
  deleteConsumoAgua,
  searchByDateRange,
  getEstadisticasByFarm,
  getConsumoPromedioMensual,
  getRegistrosConsumoElevado,
  getDistribucionConsumo,
  getUltimoRegistro,
};
