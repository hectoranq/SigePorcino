import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de consumo de electricidad
export interface ConsumoElectricidad {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  energia_consumida: number;
  fecha: string; // ISO 8601 date string
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

/**
 * List/Search - Obtener todos los registros de consumo de electricidad
 * GET /api/collections/consumo_electricidad/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de registros de consumo de electricidad
 */
export async function listConsumoElectricidad(
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

    const records = await pb.collection('consumo_electricidad').getList(page, perPage, {
      filter,
      sort: '-fecha',
      expand: 'farm,user',
    });

    console.log(`✅ Registros de consumo de electricidad obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Registros de consumo de electricidad obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registros de consumo de electricidad:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registros de consumo de electricidad',
      error,
    };
  }
}

/**
 * View - Obtener un registro específico de consumo de electricidad por ID
 * GET /api/collections/consumo_electricidad/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del registro de consumo de electricidad
 */
export async function getConsumoElectricidad(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('consumo_electricidad').getOne(id, {
      expand: 'farm,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Registro de consumo de electricidad obtenido: ${record.fecha}`);
    return {
      success: true,
      data: record,
      message: 'Registro de consumo de electricidad obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registro de consumo de electricidad:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registro de consumo de electricidad',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de consumo de electricidad
 * POST /api/collections/consumo_electricidad/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos del registro de consumo de electricidad
 * @returns Registro creado
 */
export async function createConsumoElectricidad(
  token: string,
  data: Omit<ConsumoElectricidad, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (data.energia_consumida === undefined) {
      throw new Error('Falta campo requerido: energia_consumida');
    }

    if (!data.fecha) {
      throw new Error('Falta campo requerido: fecha');
    }

    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    const record = await pb.collection('consumo_electricidad').create(data);

    console.log(`✅ Registro de consumo de electricidad creado: ${record.fecha}`);
    return {
      success: true,
      data: record,
      message: 'Registro de consumo de electricidad creado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear registro de consumo de electricidad:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al crear registro de consumo de electricidad',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al crear registro de consumo de electricidad',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro de consumo de electricidad existente
 * PATCH /api/collections/consumo_electricidad/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateConsumoElectricidad(
  token: string,
  id: string,
  data: Partial<Omit<ConsumoElectricidad, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>>,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('consumo_electricidad').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const record = await pb.collection('consumo_electricidad').update(id, data);

    console.log(`✅ Registro de consumo de electricidad actualizado: ${record.fecha}`);
    return {
      success: true,
      data: record,
      message: 'Registro de consumo de electricidad actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar registro de consumo de electricidad:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al actualizar registro de consumo de electricidad',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al actualizar registro de consumo de electricidad',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro de consumo de electricidad
 * DELETE /api/collections/consumo_electricidad/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteConsumoElectricidad(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('consumo_electricidad').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('consumo_electricidad').delete(id);

    console.log(`✅ Registro de consumo de electricidad eliminado: ${id}`);
    return {
      success: true,
      message: 'Registro de consumo de electricidad eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar registro de consumo de electricidad:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar registro de consumo de electricidad',
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

    const records = await pb.collection('consumo_electricidad').getList(1, 100, {
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
 * Obtener estadísticas de consumo de electricidad por granja
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

    const records = await pb.collection('consumo_electricidad').getFullList({
      filter,
      sort: 'fecha',
    });

    // Calcular estadísticas
    const totalEnergia = records.reduce((sum: number, r: any) => sum + (r.energia_consumida || 0), 0);
    const promedioEnergia = records.length > 0 ? totalEnergia / records.length : 0;
    const maxEnergia = records.length > 0 ? Math.max(...records.map((r: any) => r.energia_consumida || 0)) : 0;
    const minEnergia = records.length > 0 ? Math.min(...records.map((r: any) => r.energia_consumida || 0)) : 0;

    return {
      success: true,
      data: {
        totalRegistros: records.length,
        totalEnergia: parseFloat(totalEnergia.toFixed(2)),
        promedioEnergia: parseFloat(promedioEnergia.toFixed(2)),
        maxEnergia: parseFloat(maxEnergia.toFixed(2)),
        minEnergia: parseFloat(minEnergia.toFixed(2)),
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

    const records = await pb.collection('consumo_electricidad').getFullList({
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
      consumoPorMes[mes].push(record.energia_consumida || 0);
    });

    // Calcular promedio por mes
    const promediosMensuales = Object.entries(consumoPorMes).map(([mes, consumos]) => {
      const promedio = consumos.reduce((a, b) => a + b, 0) / consumos.length;
      const total = consumos.reduce((a, b) => a + b, 0);
      return {
        mes,
        promedio: parseFloat(promedio.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
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

    const records = await pb.collection('consumo_electricidad').getList(1, 100, {
      filter: `user="${userId}" && farm="${farmId}" && energia_consumida > ${umbral}`,
      sort: '-energia_consumida',
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
 * Comparar consumo entre períodos
 */
export async function compararPeriodos(
  token: string,
  userId: string,
  farmId: string,
  periodo1Start: string,
  periodo1End: string,
  periodo2Start: string,
  periodo2End: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Obtener registros del período 1
    const periodo1Records = await pb.collection('consumo_electricidad').getFullList({
      filter: `user="${userId}" && farm="${farmId}" && fecha >= "${periodo1Start}" && fecha <= "${periodo1End}"`,
    });

    // Obtener registros del período 2
    const periodo2Records = await pb.collection('consumo_electricidad').getFullList({
      filter: `user="${userId}" && farm="${farmId}" && fecha >= "${periodo2Start}" && fecha <= "${periodo2End}"`,
    });

    // Calcular totales
    const totalPeriodo1 = periodo1Records.reduce((sum: number, r: any) => sum + (r.energia_consumida || 0), 0);
    const totalPeriodo2 = periodo2Records.reduce((sum: number, r: any) => sum + (r.energia_consumida || 0), 0);
    
    // Calcular promedios
    const promedioPeriodo1 = periodo1Records.length > 0 ? totalPeriodo1 / periodo1Records.length : 0;
    const promedioPeriodo2 = periodo2Records.length > 0 ? totalPeriodo2 / periodo2Records.length : 0;
    
    // Calcular diferencia y porcentaje de cambio
    const diferencia = totalPeriodo2 - totalPeriodo1;
    const porcentajeCambio = totalPeriodo1 > 0 ? ((diferencia / totalPeriodo1) * 100) : 0;

    return {
      success: true,
      data: {
        periodo1: {
          inicio: periodo1Start,
          fin: periodo1End,
          registros: periodo1Records.length,
          totalEnergia: parseFloat(totalPeriodo1.toFixed(2)),
          promedioEnergia: parseFloat(promedioPeriodo1.toFixed(2)),
        },
        periodo2: {
          inicio: periodo2Start,
          fin: periodo2End,
          registros: periodo2Records.length,
          totalEnergia: parseFloat(totalPeriodo2.toFixed(2)),
          promedioEnergia: parseFloat(promedioPeriodo2.toFixed(2)),
        },
        comparacion: {
          diferencia: parseFloat(diferencia.toFixed(2)),
          porcentajeCambio: parseFloat(porcentajeCambio.toFixed(2)),
          tendencia: diferencia > 0 ? 'aumento' : diferencia < 0 ? 'disminución' : 'sin cambios',
        },
      },
      message: 'Comparación de períodos completada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al comparar períodos:', error);
    throw {
      success: false,
      message: error?.message || 'Error al comparar períodos',
      error,
    };
  }
}

/**
 * Obtener último registro de consumo de electricidad para una granja
 */
export async function getUltimoRegistro(
  token: string,
  userId: string,
  farmId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('consumo_electricidad').getList(1, 1, {
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
  listConsumoElectricidad,
  getConsumoElectricidad,
  createConsumoElectricidad,
  updateConsumoElectricidad,
  deleteConsumoElectricidad,
  searchByDateRange,
  getEstadisticasByFarm,
  getConsumoPromedioMensual,
  getRegistrosConsumoElevado,
  compararPeriodos,
  getUltimoRegistro,
};
