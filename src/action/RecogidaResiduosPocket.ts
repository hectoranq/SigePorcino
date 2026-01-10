import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de recogida de residuos
export interface RecogidaResiduos {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  codigos: string;
  responsable: string; // ID del staff member
  unidades?: number;
  kg?: number;
  fecha: string; // ISO 8601 date string
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

/**
 * List/Search - Obtener todos los registros de recogida de residuos
 * GET /api/collections/recogida_residuos/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de registros
 */
export async function listRecogidaResiduos(
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

    const records = await pb.collection('recogida_residuos').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user,responsable',
    });

    console.log(`✅ Registros de recogida de residuos obtenidos: ${records.items.length}`);
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
 * GET /api/collections/recogida_residuos/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del registro
 */
export async function getRecogidaResiduosById(
  token: string,
  id: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('recogida_residuos').getOne(id, {
      expand: 'farm,user,responsable',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Registro obtenido: ${record.codigos}`);
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
export async function getRecogidaResiduosByFarmId(
  farmId: string,
  token: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('recogida_residuos').getList(1, 100, {
      filter: `farm="${farmId}" && user="${userId}"`,
      sort: '-fecha',
      expand: 'farm,user,responsable',
    });

    console.log(`✅ Registros de recogida de residuos de la granja obtenidos: ${records.items.length}`);
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
 * Create - Crear un nuevo registro de recogida de residuos
 * POST /api/collections/recogida_residuos/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos del registro
 * @returns Registro creado
 */
export async function createRecogidaResiduos(
  token: string,
  data: Omit<RecogidaResiduos, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.codigos || !data.responsable || !data.fecha) {
      throw new Error('Faltan campos requeridos: codigos, responsable, fecha');
    }

    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    const record = await pb.collection('recogida_residuos').create(data);

    console.log(`✅ Registro creado: ${record.codigos}`);
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
 * PATCH /api/collections/recogida_residuos/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos actualizados
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateRecogidaResiduos(
  token: string,
  id: string,
  data: Partial<Omit<RecogidaResiduos, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>>,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('recogida_residuos').getOne(id);
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const record = await pb.collection('recogida_residuos').update(id, data);

    console.log(`✅ Registro actualizado: ${record.codigos}`);
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
 * DELETE /api/collections/recogida_residuos/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteRecogidaResiduos(
  token: string,
  id: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('recogida_residuos').getOne(id);
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('recogida_residuos').delete(id);

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

// ============================================
// FUNCIONES AUXILIARES DE BÚSQUEDA Y FILTRADO
// ============================================

/**
 * Search by Código - Buscar registros por código de residuo
 * @param token - Token de autenticación
 * @param codigo - Código de residuo a buscar (puede ser parcial)
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @returns Lista de registros que coinciden
 */
export async function searchByCodigo(
  token: string,
  codigo: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && codigos ~ "${codigo}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('recogida_residuos').getList(1, 50, {
      filter,
      sort: '-fecha',
      expand: 'farm,user,responsable',
    });

    console.log(`✅ Registros encontrados por código: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Búsqueda completada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error en búsqueda por código:', error);
    throw {
      success: false,
      message: error?.message || 'Error en búsqueda',
      error,
    };
  }
}

/**
 * Search by Responsable - Buscar registros por responsable (staff ID)
 * @param token - Token de autenticación
 * @param responsableId - ID del staff member responsable
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @returns Lista de registros que coinciden
 */
export async function searchByResponsable(
  token: string,
  responsableId: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && responsable="${responsableId}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('recogida_residuos').getList(1, 50, {
      filter,
      sort: '-fecha',
      expand: 'farm,user,responsable',
    });

    console.log(`✅ Registros encontrados por responsable: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Búsqueda completada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error en búsqueda por responsable:', error);
    throw {
      success: false,
      message: error?.message || 'Error en búsqueda',
      error,
    };
  }
}

/**
 * Search by Date Range - Buscar registros en un rango de fechas
 * @param token - Token de autenticación
 * @param fechaInicio - Fecha de inicio (YYYY-MM-DD)
 * @param fechaFin - Fecha de fin (YYYY-MM-DD)
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @returns Lista de registros en el rango
 */
export async function searchByDateRange(
  token: string,
  fechaInicio: string,
  fechaFin: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && fecha >= "${fechaInicio}" && fecha <= "${fechaFin}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('recogida_residuos').getList(1, 100, {
      filter,
      sort: '-fecha',
      expand: 'farm,user,responsable',
    });

    console.log(`✅ Registros encontrados en rango de fechas: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Búsqueda completada exitosamente',
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
 * Get Total Kg by Period - Obtener el total de kg en un período
 * @param token - Token de autenticación
 * @param fechaInicio - Fecha de inicio (YYYY-MM-DD)
 * @param fechaFin - Fecha de fin (YYYY-MM-DD)
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @returns Total de kg y lista de registros
 */
export async function getTotalKgByPeriod(
  token: string,
  fechaInicio: string,
  fechaFin: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && fecha >= "${fechaInicio}" && fecha <= "${fechaFin}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('recogida_residuos').getList(1, 500, {
      filter,
      sort: '-fecha',
      expand: 'farm,user,responsable',
    });

    // Calcular total de kg
    const totalKg = records.items.reduce((sum: number, record: any) => {
      return sum + (record.kg || 0);
    }, 0);

    console.log(`✅ Total kg en período: ${totalKg}kg de ${records.items.length} registros`);
    return {
      success: true,
      data: {
        totalKg,
        registrosCount: records.items.length,
        registros: records.items,
      },
      message: 'Estadísticas calculadas exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al calcular total de kg:', error);
    throw {
      success: false,
      message: error?.message || 'Error al calcular estadísticas',
      error,
    };
  }
}

/**
 * Get Estadísticas by Código - Obtener estadísticas por código de residuo
 * @param token - Token de autenticación
 * @param codigo - Código de residuo
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @returns Estadísticas del código de residuo
 */
export async function getEstadisticasByCodigo(
  token: string,
  codigo: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && codigos="${codigo}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('recogida_residuos').getList(1, 500, {
      filter,
      sort: '-fecha',
      expand: 'farm,user,responsable',
    });

    // Calcular estadísticas
    const totalRegistros = records.items.length;
    const totalKg = records.items.reduce((sum: number, record: any) => sum + (record.kg || 0), 0);
    const totalUnidades = records.items.reduce((sum: number, record: any) => sum + (record.unidades || 0), 0);
    const promedioKg = totalRegistros > 0 ? totalKg / totalRegistros : 0;
    const promedioUnidades = totalRegistros > 0 ? totalUnidades / totalRegistros : 0;

    console.log(`✅ Estadísticas por código ${codigo}: ${totalKg}kg, ${totalUnidades} unidades de ${totalRegistros} registros`);
    return {
      success: true,
      data: {
        codigo,
        totalRegistros,
        totalKg,
        totalUnidades,
        promedioKg,
        promedioUnidades,
        registros: records.items,
      },
      message: 'Estadísticas calculadas exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al calcular estadísticas por código:', error);
    throw {
      success: false,
      message: error?.message || 'Error al calcular estadísticas',
      error,
    };
  }
}

/**
 * Get Totales by Farm - Obtener totales generales de una granja
 * @param token - Token de autenticación
 * @param farmId - ID de la granja
 * @param userId - ID del usuario autenticado
 * @returns Totales generales de la granja
 */
export async function getTotalesByFarm(
  token: string,
  farmId: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('recogida_residuos').getList(1, 500, {
      filter: `user="${userId}" && farm="${farmId}"`,
      sort: '-fecha',
      expand: 'farm,user,responsable',
    });

    // Calcular totales
    const totalRegistros = records.items.length;
    const totalKg = records.items.reduce((sum: number, record: any) => sum + (record.kg || 0), 0);
    const totalUnidades = records.items.reduce((sum: number, record: any) => sum + (record.unidades || 0), 0);

    // Contar por código
    const porCodigo = records.items.reduce((acc: any, record: any) => {
      const codigo = record.codigos;
      if (!acc[codigo]) {
        acc[codigo] = { count: 0, kg: 0, unidades: 0 };
      }
      acc[codigo].count += 1;
      acc[codigo].kg += record.kg || 0;
      acc[codigo].unidades += record.unidades || 0;
      return acc;
    }, {});

    console.log(`✅ Totales de granja: ${totalKg}kg, ${totalUnidades} unidades de ${totalRegistros} registros`);
    return {
      success: true,
      data: {
        totalRegistros,
        totalKg,
        totalUnidades,
        porCodigo,
      },
      message: 'Totales calculados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al calcular totales de granja:', error);
    throw {
      success: false,
      message: error?.message || 'Error al calcular totales',
      error,
    };
  }
}
