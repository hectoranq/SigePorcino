import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de baja de animales
export interface BajaAnimales {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  nro_crotal: string;
  causa: string;
  fecha_fallecimiento: string; // ISO 8601 date string
  es_muerte: boolean;
  es_sacrificio: boolean;
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

/**
 * List/Search - Obtener todos los registros de baja de animales
 * GET /api/collections/baja_animales/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de bajas de animales
 */
export async function listBajaAnimales(
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

    const records = await pb.collection('baja_animales').getList(page, perPage, {
      filter,
      sort: '-fecha_fallecimiento',
      expand: 'farm,user',
    });

    console.log(`✅ Bajas de animales obtenidas: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Bajas de animales obtenidas exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener bajas de animales:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener bajas de animales',
      error,
    };
  }
}

/**
 * View - Obtener un registro específico de baja de animales por ID
 * GET /api/collections/baja_animales/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos de la baja de animales
 */
export async function getBajaAnimales(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('baja_animales').getOne(id, {
      expand: 'farm,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Baja de animales obtenida: ${record.nro_crotal}`);
    return {
      success: true,
      data: record,
      message: 'Baja de animales obtenida exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener baja de animales:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener baja de animales',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de baja de animales
 * POST /api/collections/baja_animales/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos de la baja de animales
 * @returns Registro creado
 */
export async function createBajaAnimales(
  token: string,
  data: Omit<BajaAnimales, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.nro_crotal || data.nro_crotal.trim() === '') {
      throw new Error('El número de crotal es requerido');
    }

    if (!data.causa || data.causa.trim() === '') {
      throw new Error('La causa es requerida');
    }

    if (!data.fecha_fallecimiento) {
      throw new Error('La fecha de fallecimiento es requerida');
    }

    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    const record = await pb.collection('baja_animales').create(data);

    console.log(`✅ Baja de animales creada: ${record.nro_crotal}`);
    return {
      success: true,
      data: record,
      message: 'Baja de animales registrada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear baja de animales:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al crear baja de animales',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al crear baja de animales',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro de baja de animales existente
 * PATCH /api/collections/baja_animales/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateBajaAnimales(
  token: string,
  id: string,
  data: Partial<Omit<BajaAnimales, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>>,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('baja_animales').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    // Validar datos si están presentes
    if (data.nro_crotal !== undefined && data.nro_crotal.trim() === '') {
      throw new Error('El número de crotal no puede estar vacío');
    }

    if (data.causa !== undefined && data.causa.trim() === '') {
      throw new Error('La causa no puede estar vacía');
    }

    const record = await pb.collection('baja_animales').update(id, data);

    console.log(`✅ Baja de animales actualizada: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Baja de animales actualizada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar baja de animales:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al actualizar baja de animales',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al actualizar baja de animales',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro de baja de animales
 * DELETE /api/collections/baja_animales/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteBajaAnimales(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('baja_animales').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('baja_animales').delete(id);

    console.log(`✅ Baja de animales eliminada: ${id}`);
    return {
      success: true,
      message: 'Baja de animales eliminada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar baja de animales:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar baja de animales',
      error,
    };
  }
}

/**
 * Funciones auxiliares
 */

/**
 * Buscar bajas de animales por número de crotal
 */
export async function searchByNroCrotal(
  token: string,
  nroCrotal: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && nro_crotal~"${nroCrotal}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('baja_animales').getList(1, 50, {
      filter,
      sort: '-fecha_fallecimiento',
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
 * Buscar bajas de animales por causa
 */
export async function searchByCausa(
  token: string,
  causa: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && causa~"${causa}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('baja_animales').getList(1, 50, {
      filter,
      sort: '-fecha_fallecimiento',
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
 * Buscar bajas de animales por rango de fechas
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

    let filter = `user="${userId}" && fecha_fallecimiento >= "${fechaInicio}" && fecha_fallecimiento <= "${fechaFin}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('baja_animales').getList(1, 200, {
      filter,
      sort: '-fecha_fallecimiento',
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
 * Obtener totales de bajas en un período
 */
export async function getTotalesByPeriod(
  token: string,
  fechaInicio: string,
  fechaFin: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && fecha_fallecimiento >= "${fechaInicio}" && fecha_fallecimiento <= "${fechaFin}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('baja_animales').getList(1, 500, {
      filter,
    });

    const totalBajas = records.items.length;
    const totalMuertes = records.items.filter(item => item.es_muerte).length;
    const totalSacrificios = records.items.filter(item => item.es_sacrificio).length;

    return {
      success: true,
      data: {
        totalBajas,
        totalMuertes,
        totalSacrificios,
        porcentajeMuertes: totalBajas > 0 ? (totalMuertes / totalBajas) * 100 : 0,
        porcentajeSacrificios: totalBajas > 0 ? (totalSacrificios / totalBajas) * 100 : 0,
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
 * Obtener estadísticas por tipo de fallecimiento
 */
export async function getEstadisticasByTipo(
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

    const records = await pb.collection('baja_animales').getList(1, 500, {
      filter,
    });

    const totalBajas = records.items.length;
    const muertes = records.items.filter(item => item.es_muerte).length;
    const sacrificios = records.items.filter(item => item.es_sacrificio).length;
    const ambos = records.items.filter(item => item.es_muerte && item.es_sacrificio).length;

    return {
      success: true,
      data: {
        totalBajas,
        muerte: muertes,
        sacrificio: sacrificios,
        ambos,
        porcentajeMuerte: totalBajas > 0 ? (muertes / totalBajas) * 100 : 0,
        porcentajeSacrificio: totalBajas > 0 ? (sacrificios / totalBajas) * 100 : 0,
      },
      message: 'Estadísticas por tipo obtenidas exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener estadísticas por tipo:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener estadísticas',
      error,
    };
  }
}

/**
 * Obtener resumen de bajas por granja
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

    const records = await pb.collection('baja_animales').getList(1, 500, {
      filter,
      sort: '-fecha_fallecimiento',
    });

    const totalBajas = records.items.length;
    const totalMuertes = records.items.filter(item => item.es_muerte).length;
    const totalSacrificios = records.items.filter(item => item.es_sacrificio).length;

    // Obtener causas más frecuentes
    const causas: Record<string, number> = {};
    records.items.forEach(item => {
      const causa = item.causa.substring(0, 50); // Primeros 50 caracteres
      causas[causa] = (causas[causa] || 0) + 1;
    });

    const causasMasFrecuentes = Object.entries(causas)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([causa, cantidad]) => ({ causa, cantidad }));

    return {
      success: true,
      data: {
        totalBajas,
        totalMuertes,
        totalSacrificios,
        porcentajeMuertes: totalBajas > 0 ? (totalMuertes / totalBajas) * 100 : 0,
        porcentajeSacrificios: totalBajas > 0 ? (totalSacrificios / totalBajas) * 100 : 0,
        causasMasFrecuentes,
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
 * Obtener últimas bajas registradas
 */
export async function getBajasRecientes(
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

    const records = await pb.collection('baja_animales').getList(1, limit, {
      filter,
      sort: '-fecha_fallecimiento,-created',
      expand: 'farm',
    });

    return {
      success: true,
      data: records,
      message: 'Bajas recientes obtenidas exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener bajas recientes:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener bajas recientes',
      error,
    };
  }
}

export default {
  listBajaAnimales,
  getBajaAnimales,
  createBajaAnimales,
  updateBajaAnimales,
  deleteBajaAnimales,
  searchByNroCrotal,
  searchByCausa,
  searchByDateRange,
  getTotalesByPeriod,
  getEstadisticasByTipo,
  getResumenByFarm,
  getBajasRecientes,
};
