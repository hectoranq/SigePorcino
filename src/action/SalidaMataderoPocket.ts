import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de salida a matadero
export interface SalidaMatadero {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  nro_animales: number;
  peso_vivo: number;
  fecha_salida: string; // ISO 8601 date string
  destino: string;
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

/**
 * List/Search - Obtener todos los registros de salida a matadero
 * GET /api/collections/salida_matadero/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de salidas a matadero
 */
export async function listSalidaMatadero(
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

    const records = await pb.collection('salida_matadero').getList(page, perPage, {
      filter,
      sort: '-fecha_salida',
      expand: 'farm,user',
    });

    console.log(`✅ Salidas a matadero obtenidas: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Salidas a matadero obtenidas exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener salidas a matadero:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener salidas a matadero',
      error,
    };
  }
}

/**
 * View - Obtener un registro específico de salida a matadero por ID
 * GET /api/collections/salida_matadero/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos de la salida a matadero
 */
export async function getSalidaMatadero(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('salida_matadero').getOne(id, {
      expand: 'farm,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Salida a matadero obtenida: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Salida a matadero obtenida exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener salida a matadero:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener salida a matadero',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de salida a matadero
 * POST /api/collections/salida_matadero/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos de la salida a matadero
 * @returns Registro creado
 */
export async function createSalidaMatadero(
  token: string,
  data: Omit<SalidaMatadero, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.nro_animales || data.nro_animales <= 0) {
      throw new Error('El número de animales debe ser mayor a 0');
    }

    if (!data.peso_vivo || data.peso_vivo <= 0) {
      throw new Error('El peso vivo debe ser mayor a 0');
    }

    if (!data.fecha_salida) {
      throw new Error('La fecha de salida es requerida');
    }

    if (!data.destino || data.destino.trim() === '') {
      throw new Error('El destino es requerido');
    }

    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    const record = await pb.collection('salida_matadero').create(data);

    console.log(`✅ Salida a matadero creada: ${record.nro_animales} animales a ${record.destino}`);
    return {
      success: true,
      data: record,
      message: 'Salida a matadero registrada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear salida a matadero:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al crear salida a matadero',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al crear salida a matadero',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro de salida a matadero existente
 * PATCH /api/collections/salida_matadero/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateSalidaMatadero(
  token: string,
  id: string,
  data: Partial<Omit<SalidaMatadero, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>>,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('salida_matadero').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    // Validar datos si están presentes
    if (data.nro_animales !== undefined && data.nro_animales <= 0) {
      throw new Error('El número de animales debe ser mayor a 0');
    }

    if (data.peso_vivo !== undefined && data.peso_vivo <= 0) {
      throw new Error('El peso vivo debe ser mayor a 0');
    }

    const record = await pb.collection('salida_matadero').update(id, data);

    console.log(`✅ Salida a matadero actualizada: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Salida a matadero actualizada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar salida a matadero:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al actualizar salida a matadero',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al actualizar salida a matadero',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro de salida a matadero
 * DELETE /api/collections/salida_matadero/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteSalidaMatadero(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('salida_matadero').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('salida_matadero').delete(id);

    console.log(`✅ Salida a matadero eliminada: ${id}`);
    return {
      success: true,
      message: 'Salida a matadero eliminada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar salida a matadero:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar salida a matadero',
      error,
    };
  }
}

/**
 * Funciones auxiliares
 */

/**
 * Buscar salidas a matadero por destino
 */
export async function searchByDestino(
  token: string,
  destino: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && destino~"${destino}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('salida_matadero').getList(1, 50, {
      filter,
      sort: '-fecha_salida',
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
 * Buscar salidas a matadero por rango de fechas
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

    let filter = `user="${userId}" && fecha_salida >= "${fechaInicio}" && fecha_salida <= "${fechaFin}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('salida_matadero').getList(1, 200, {
      filter,
      sort: '-fecha_salida',
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
 * Obtener total de animales enviados en un período
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

    let filter = `user="${userId}" && fecha_salida >= "${fechaInicio}" && fecha_salida <= "${fechaFin}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('salida_matadero').getList(1, 500, {
      filter,
    });

    const totalAnimales = records.items.reduce((sum, item) => sum + (item.nro_animales || 0), 0);
    const totalPeso = records.items.reduce((sum, item) => sum + (item.peso_vivo || 0), 0);

    return {
      success: true,
      data: {
        totalAnimales,
        totalPeso,
        totalEnvios: records.items.length,
        pesoPromedio: records.items.length > 0 ? totalPeso / totalAnimales : 0,
      },
      message: 'Totales calculados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al calcular totales:', error);
    throw {
      success: false,
      message: error?.message || 'Error al calcular totales',
      error,
    };
  }
}

/**
 * Obtener estadísticas por destino (matadero)
 */
export async function getEstadisticasByDestino(
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

    const records = await pb.collection('salida_matadero').getList(1, 500, {
      filter,
    });

    // Agrupar por destino
    const estadisticas: Record<string, { totalAnimales: number; totalPeso: number; envios: number }> = {};
    
    records.items.forEach((item) => {
      if (!estadisticas[item.destino]) {
        estadisticas[item.destino] = { totalAnimales: 0, totalPeso: 0, envios: 0 };
      }
      estadisticas[item.destino].totalAnimales += item.nro_animales || 0;
      estadisticas[item.destino].totalPeso += item.peso_vivo || 0;
      estadisticas[item.destino].envios += 1;
    });

    return {
      success: true,
      data: estadisticas,
      message: 'Estadísticas por destino obtenidas exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener estadísticas por destino:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener estadísticas',
      error,
    };
  }
}

/**
 * Obtener resumen de salidas por granja
 */
export async function getResumenByFarm(
  token: string,
  userId: string,
  farmId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const filter = `user="${userId}" && farm="${farmId}"`;

    const records = await pb.collection('salida_matadero').getList(1, 500, {
      filter,
      sort: '-fecha_salida',
    });

    const totalAnimales = records.items.reduce((sum, item) => sum + (item.nro_animales || 0), 0);
    const totalPeso = records.items.reduce((sum, item) => sum + (item.peso_vivo || 0), 0);
    
    // Agrupar por destino
    const destinosUnicos = new Set(records.items.map(item => item.destino));

    return {
      success: true,
      data: {
        totalEnvios: records.items.length,
        totalAnimales,
        totalPeso,
        pesoPromedio: totalAnimales > 0 ? totalPeso / totalAnimales : 0,
        destinosUnicos: destinosUnicos.size,
        destinos: Array.from(destinosUnicos),
      },
      message: 'Resumen por granja obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener resumen por granja:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener resumen',
      error,
    };
  }
}

/**
 * Obtener últimas salidas registradas
 */
export async function getSalidasRecientes(
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

    const records = await pb.collection('salida_matadero').getList(1, limit, {
      filter,
      sort: '-fecha_salida,-created',
      expand: 'farm',
    });

    return {
      success: true,
      data: records,
      message: 'Salidas recientes obtenidas exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener salidas recientes:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener salidas recientes',
      error,
    };
  }
}

export default {
  listSalidaMatadero,
  getSalidaMatadero,
  createSalidaMatadero,
  updateSalidaMatadero,
  deleteSalidaMatadero,
  searchByDestino,
  searchByDateRange,
  getTotalAnimalesByPeriod,
  getEstadisticasByDestino,
  getResumenByFarm,
  getSalidasRecientes,
};
