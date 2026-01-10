import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de entradas de combustible
export interface EntradasCombustible {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  tipo_combustible: string;
  fecha: string; // ISO 8601 date string
  cantidades: number;
  unidades: string;
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

/**
 * List/Search - Obtener todos los registros de entradas de combustible
 * GET /api/collections/entradas_combustible/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de registros de entradas de combustible
 */
export async function listEntradasCombustible(
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

    const records = await pb.collection('entradas_combustible').getList(page, perPage, {
      filter,
      sort: '-fecha',
      expand: 'farm,user',
    });

    console.log(`✅ Registros de entradas de combustible obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Registros de entradas de combustible obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registros de entradas de combustible:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registros de entradas de combustible',
      error,
    };
  }
}

/**
 * View - Obtener un registro específico de entrada de combustible por ID
 * GET /api/collections/entradas_combustible/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del registro de entrada de combustible
 */
export async function getEntradasCombustible(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('entradas_combustible').getOne(id, {
      expand: 'farm,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Registro de entrada de combustible obtenido: ${record.tipo_combustible}`);
    return {
      success: true,
      data: record,
      message: 'Registro de entrada de combustible obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener registro de entrada de combustible:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registro de entrada de combustible',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de entrada de combustible
 * POST /api/collections/entradas_combustible/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos del registro de entrada de combustible
 * @returns Registro creado
 */
export async function createEntradasCombustible(
  token: string,
  data: Omit<EntradasCombustible, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.tipo_combustible || !data.unidades) {
      throw new Error('Faltan campos requeridos: tipo_combustible, unidades');
    }

    if (data.cantidades === undefined) {
      throw new Error('Falta campo requerido: cantidades');
    }

    if (!data.fecha) {
      throw new Error('Falta campo requerido: fecha');
    }

    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    const record = await pb.collection('entradas_combustible').create(data);

    console.log(`✅ Registro de entrada de combustible creado: ${record.tipo_combustible}`);
    return {
      success: true,
      data: record,
      message: 'Registro de entrada de combustible creado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear registro de entrada de combustible:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al crear registro de entrada de combustible',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al crear registro de entrada de combustible',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro de entrada de combustible existente
 * PATCH /api/collections/entradas_combustible/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateEntradasCombustible(
  token: string,
  id: string,
  data: Partial<Omit<EntradasCombustible, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>>,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('entradas_combustible').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const record = await pb.collection('entradas_combustible').update(id, data);

    console.log(`✅ Registro de entrada de combustible actualizado: ${record.tipo_combustible}`);
    return {
      success: true,
      data: record,
      message: 'Registro de entrada de combustible actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar registro de entrada de combustible:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al actualizar registro de entrada de combustible',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al actualizar registro de entrada de combustible',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro de entrada de combustible
 * DELETE /api/collections/entradas_combustible/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteEntradasCombustible(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('entradas_combustible').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('entradas_combustible').delete(id);

    console.log(`✅ Registro de entrada de combustible eliminado: ${id}`);
    return {
      success: true,
      message: 'Registro de entrada de combustible eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar registro de entrada de combustible:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar registro de entrada de combustible',
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

    const records = await pb.collection('entradas_combustible').getList(1, 100, {
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
 * Buscar registros por tipo de combustible
 */
export async function searchByTipoCombustible(
  token: string,
  userId: string,
  farmId: string,
  tipoCombustible: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('entradas_combustible').getList(1, 100, {
      filter: `user="${userId}" && farm="${farmId}" && tipo_combustible~"${tipoCombustible}"`,
      sort: '-fecha',
      expand: 'farm,user',
    });

    return {
      success: true,
      data: records,
      message: 'Búsqueda por tipo de combustible completada',
    };
  } catch (error: any) {
    console.error('❌ Error en búsqueda por tipo de combustible:', error);
    throw {
      success: false,
      message: error?.message || 'Error en la búsqueda',
      error,
    };
  }
}

/**
 * Obtener totales por tipo de combustible
 */
export async function getTotalesByTipoCombustible(
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

    const records = await pb.collection('entradas_combustible').getFullList({
      filter,
    });

    // Agrupar por tipo de combustible y unidad
    const totalesPorTipo: { [key: string]: { [unidad: string]: { cantidad: number; entradas: number } } } = {};
    
    records.forEach((record: any) => {
      const tipo = record.tipo_combustible;
      const unidad = record.unidades;
      
      if (!totalesPorTipo[tipo]) {
        totalesPorTipo[tipo] = {};
      }
      
      if (!totalesPorTipo[tipo][unidad]) {
        totalesPorTipo[tipo][unidad] = { cantidad: 0, entradas: 0 };
      }
      
      totalesPorTipo[tipo][unidad].cantidad += record.cantidades || 0;
      totalesPorTipo[tipo][unidad].entradas += 1;
    });

    // Formatear resultados
    const resultados = Object.entries(totalesPorTipo).map(([tipo, unidades]) => {
      const unidadesFormateadas = Object.entries(unidades).map(([unidad, datos]) => ({
        unidad,
        cantidad: parseFloat(datos.cantidad.toFixed(2)),
        entradas: datos.entradas,
      }));
      
      return {
        tipoCombustible: tipo,
        unidades: unidadesFormateadas,
      };
    });

    return {
      success: true,
      data: resultados,
      message: 'Totales por tipo de combustible obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener totales por tipo de combustible:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener totales por tipo de combustible',
      error,
    };
  }
}

/**
 * Obtener estadísticas generales de entradas de combustible
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

    const records = await pb.collection('entradas_combustible').getFullList({
      filter,
      sort: 'fecha',
    });

    // Calcular estadísticas
    const totalRegistros = records.length;
    const tiposUnicos = new Set(records.map((r: any) => r.tipo_combustible)).size;
    const unidadesUsadas = new Set(records.map((r: any) => r.unidades));

    // Tipo más usado
    const tiposCount: { [key: string]: number } = {};
    records.forEach((record: any) => {
      tiposCount[record.tipo_combustible] = (tiposCount[record.tipo_combustible] || 0) + 1;
    });
    const tipoMasUsado = Object.entries(tiposCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
      success: true,
      data: {
        totalRegistros,
        tiposUnicos,
        tipoMasUsado,
        unidadesUsadas: Array.from(unidadesUsadas),
        registros: records,
      },
      message: 'Estadísticas obtenidas exitosamente',
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
 * Obtener entradas mensuales de combustible
 */
export async function getEntradasMensuales(
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

    const records = await pb.collection('entradas_combustible').getFullList({
      filter,
      sort: 'fecha',
    });

    // Agrupar por mes
    const entradasPorMes: { [key: string]: any[] } = {};
    records.forEach((record: any) => {
      const mes = record.fecha.substring(0, 7); // YYYY-MM
      if (!entradasPorMes[mes]) {
        entradasPorMes[mes] = [];
      }
      entradasPorMes[mes].push(record);
    });

    // Formatear resultados
    const resultados = Object.entries(entradasPorMes).map(([mes, entradas]) => {
      // Agrupar por tipo dentro de cada mes
      const tiposCount: { [key: string]: number } = {};
      entradas.forEach((entrada: any) => {
        tiposCount[entrada.tipo_combustible] = (tiposCount[entrada.tipo_combustible] || 0) + 1;
      });

      return {
        mes,
        totalEntradas: entradas.length,
        tiposCombustible: tiposCount,
      };
    });

    return {
      success: true,
      data: resultados,
      message: 'Entradas mensuales obtenidas exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener entradas mensuales:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener entradas mensuales',
      error,
    };
  }
}

/**
 * Obtener último registro de entrada de combustible para una granja
 */
export async function getUltimoRegistro(
  token: string,
  userId: string,
  farmId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('entradas_combustible').getList(1, 1, {
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
  listEntradasCombustible,
  getEntradasCombustible,
  createEntradasCombustible,
  updateEntradasCombustible,
  deleteEntradasCombustible,
  searchByDateRange,
  searchByTipoCombustible,
  getTotalesByTipoCombustible,
  getEstadisticasByFarm,
  getEntradasMensuales,
  getUltimoRegistro,
};
