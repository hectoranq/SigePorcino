import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de entrada de lechones
export interface EntradaLechones {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  nro_animales: number;
  peso_vivo: number;
  fecha_entrada: string; // ISO 8601 date string
  fecha_nacimiento: string; // ISO 8601 date string
  procedencia: string;
  observaciones?: string;
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

/**
 * List/Search - Obtener todos los registros de entrada de lechones
 * GET /api/collections/entrada_lechones/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de registros
 */
export async function listEntradaLechones(
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

    const records = await pb.collection('entrada_lechones').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user',
    });

    console.log(`✅ Registros de entrada de lechones obtenidos: ${records.items.length}`);
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
 * GET /api/collections/entrada_lechones/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del registro
 */
export async function getEntradaLechonesById(
  token: string,
  id: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('entrada_lechones').getOne(id, {
      expand: 'farm,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Registro obtenido: ${record.nro_animales} animales`);
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
export async function getEntradaLechonesByFarmId(
  farmId: string,
  token: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('entrada_lechones').getList(1, 100, {
      filter: `farm="${farmId}" && user="${userId}"`,
      sort: '-fecha_entrada',
      expand: 'farm,user',
    });

    console.log(`✅ Registros de entrada de lechones de la granja obtenidos: ${records.items.length}`);
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
 * Create - Crear un nuevo registro de entrada de lechones
 * POST /api/collections/entrada_lechones/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos del registro
 * @returns Registro creado
 */
export async function createEntradaLechones(
  token: string,
  data: Omit<EntradaLechones, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.procedencia || !data.fecha_entrada || !data.fecha_nacimiento) {
      throw new Error('Faltan campos requeridos: procedencia, fecha_entrada, fecha_nacimiento');
    }

    if (data.nro_animales === undefined || data.nro_animales === null) {
      throw new Error('Falta campo requerido: nro_animales');
    }

    if (data.peso_vivo === undefined || data.peso_vivo === null) {
      throw new Error('Falta campo requerido: peso_vivo');
    }

    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    const record = await pb.collection('entrada_lechones').create(data);

    console.log(`✅ Registro creado: ${record.nro_animales} animales de ${record.procedencia}`);
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
 * PATCH /api/collections/entrada_lechones/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos actualizados
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateEntradaLechones(
  token: string,
  id: string,
  data: Partial<Omit<EntradaLechones, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>>,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('entrada_lechones').getOne(id);
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const record = await pb.collection('entrada_lechones').update(id, data);

    console.log(`✅ Registro actualizado: ${record.nro_animales} animales`);
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
 * DELETE /api/collections/entrada_lechones/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteEntradaLechones(
  token: string,
  id: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('entrada_lechones').getOne(id);
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('entrada_lechones').delete(id);

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
 * Search by Procedencia - Buscar registros por procedencia
 * @param token - Token de autenticación
 * @param procedencia - Procedencia a buscar (puede ser parcial)
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @returns Lista de registros que coinciden
 */
export async function searchByProcedencia(
  token: string,
  procedencia: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && procedencia ~ "${procedencia}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('entrada_lechones').getList(1, 50, {
      filter,
      sort: '-fecha_entrada',
      expand: 'farm,user',
    });

    console.log(`✅ Registros encontrados por procedencia: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Búsqueda completada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error en búsqueda por procedencia:', error);
    throw {
      success: false,
      message: error?.message || 'Error en búsqueda',
      error,
    };
  }
}

/**
 * Search by Date Range - Buscar registros en un rango de fechas de entrada
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

    let filter = `user="${userId}" && fecha_entrada >= "${fechaInicio}" && fecha_entrada <= "${fechaFin}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('entrada_lechones').getList(1, 100, {
      filter,
      sort: '-fecha_entrada',
      expand: 'farm,user',
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
 * Get Total Animales by Period - Obtener el total de animales en un período
 * @param token - Token de autenticación
 * @param fechaInicio - Fecha de inicio (YYYY-MM-DD)
 * @param fechaFin - Fecha de fin (YYYY-MM-DD)
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @returns Total de animales y lista de registros
 */
export async function getTotalAnimalesByPeriod(
  token: string,
  fechaInicio: string,
  fechaFin: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && fecha_entrada >= "${fechaInicio}" && fecha_entrada <= "${fechaFin}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('entrada_lechones').getList(1, 500, {
      filter,
      sort: '-fecha_entrada',
      expand: 'farm,user',
    });

    // Calcular totales
    const totalAnimales = records.items.reduce((sum: number, record: any) => {
      return sum + (record.nro_animales || 0);
    }, 0);

    const totalPeso = records.items.reduce((sum: number, record: any) => {
      return sum + (record.peso_vivo * record.nro_animales || 0);
    }, 0);

    const pesoPromedio = totalAnimales > 0 ? totalPeso / totalAnimales : 0;

    console.log(`✅ Total animales en período: ${totalAnimales} animales de ${records.items.length} registros`);
    return {
      success: true,
      data: {
        totalAnimales,
        totalPeso,
        pesoPromedio,
        registrosCount: records.items.length,
        registros: records.items,
      },
      message: 'Estadísticas calculadas exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al calcular total de animales:', error);
    throw {
      success: false,
      message: error?.message || 'Error al calcular estadísticas',
      error,
    };
  }
}

/**
 * Get Estadísticas by Procedencia - Obtener estadísticas por procedencia
 * @param token - Token de autenticación
 * @param procedencia - Procedencia a analizar
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @returns Estadísticas de la procedencia
 */
export async function getEstadisticasByProcedencia(
  token: string,
  procedencia: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && procedencia ~ "${procedencia}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('entrada_lechones').getList(1, 500, {
      filter,
      sort: '-fecha_entrada',
      expand: 'farm,user',
    });

    // Calcular estadísticas
    const totalRegistros = records.items.length;
    const totalAnimales = records.items.reduce((sum: number, record: any) => sum + (record.nro_animales || 0), 0);
    const pesoPromedio = records.items.reduce((sum: number, record: any) => sum + (record.peso_vivo || 0), 0) / totalRegistros;
    const animalesPromedioPorLote = totalRegistros > 0 ? totalAnimales / totalRegistros : 0;

    console.log(`✅ Estadísticas por procedencia ${procedencia}: ${totalAnimales} animales de ${totalRegistros} registros`);
    return {
      success: true,
      data: {
        procedencia,
        totalRegistros,
        totalAnimales,
        pesoPromedio,
        animalesPromedioPorLote,
        registros: records.items,
      },
      message: 'Estadísticas calculadas exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al calcular estadísticas por procedencia:', error);
    throw {
      success: false,
      message: error?.message || 'Error al calcular estadísticas',
      error,
    };
  }
}

/**
 * Get Resumen by Farm - Obtener resumen general de una granja
 * @param token - Token de autenticación
 * @param farmId - ID de la granja
 * @param userId - ID del usuario autenticado
 * @returns Resumen general de la granja
 */
export async function getResumenByFarm(
  token: string,
  farmId: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('entrada_lechones').getList(1, 500, {
      filter: `user="${userId}" && farm="${farmId}"`,
      sort: '-fecha_entrada',
      expand: 'farm,user',
    });

    // Calcular totales
    const totalRegistros = records.items.length;
    const totalAnimales = records.items.reduce((sum: number, record: any) => sum + (record.nro_animales || 0), 0);
    const pesoPromedioGeneral = records.items.reduce((sum: number, record: any) => sum + (record.peso_vivo || 0), 0) / totalRegistros;

    // Contar por procedencia
    const porProcedencia = records.items.reduce((acc: any, record: any) => {
      const proc = record.procedencia;
      if (!acc[proc]) {
        acc[proc] = { count: 0, animales: 0, pesoPromedio: 0 };
      }
      acc[proc].count += 1;
      acc[proc].animales += record.nro_animales || 0;
      acc[proc].pesoPromedio = ((acc[proc].pesoPromedio * (acc[proc].count - 1)) + record.peso_vivo) / acc[proc].count;
      return acc;
    }, {});

    console.log(`✅ Resumen de granja: ${totalAnimales} animales de ${totalRegistros} registros`);
    return {
      success: true,
      data: {
        totalRegistros,
        totalAnimales,
        pesoPromedioGeneral,
        porProcedencia,
      },
      message: 'Resumen calculado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al calcular resumen de granja:', error);
    throw {
      success: false,
      message: error?.message || 'Error al calcular resumen',
      error,
    };
  }
}

/**
 * Get Lotes Recientes - Obtener los lotes más recientes
 * @param token - Token de autenticación
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param limit - Número de registros a retornar (default: 10)
 * @returns Lista de lotes recientes
 */
export async function getLotesRecientes(
  token: string,
  userId: string,
  farmId?: string,
  limit: number = 10
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('entrada_lechones').getList(1, limit, {
      filter,
      sort: '-fecha_entrada',
      expand: 'farm,user',
    });

    console.log(`✅ Lotes recientes obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Lotes recientes obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener lotes recientes:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener lotes recientes',
      error,
    };
  }
}
