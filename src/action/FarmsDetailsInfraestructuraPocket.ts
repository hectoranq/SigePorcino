import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de detalles de infraestructura de granja
export interface FarmDetailsInfraestructura {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  frams: string; // ID de la granja relacionada
  user?: string; // ID del usuario propietario
  // Alimentación y abrevado
  animales_por_corral?: number;
  observaciones_animales?: string;
  feeding_type?: string; // JSON string
  feed_type?: string; // JSON string
  meals_per_day?: string; // JSON string
  longitud_comedero?: number;
  observaciones_comedero?: string;
  numero_bebederos?: number;
  observaciones_bebederos?: string;
  medication_use?: string; // si/no
  observaciones_medicacion?: string;
  // Manejo
  inspections_per_day?: string; // JSON string
  observaciones_inspecciones?: string;
  automatic_equipment?: string; // JSON string
  observaciones_equipamiento?: string;
  animal_grouping?: string; // JSON string
  observaciones_agrupamiento?: string;
  genetic_material?: string; // si/no
  created?: string;
  updated?: string;
}

/**
 * List/Search - Obtener todos los detalles de infraestructura de granjas
 * GET /api/collections/farm_details_infraestructura/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de detalles de infraestructura
 */
export async function listFarmDetailsInfraestructura(
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
      filter += ` && frams="${farmId}"`;
    }

    const records = await pb.collection('farm_details_infraestructura').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'frams,user',
    });

    console.log(`✅ Detalles de infraestructura obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Detalles de infraestructura obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener detalles de infraestructura:', error);
    return {
      success: false,
      data: null,
      message: error?.message || 'Error al obtener detalles de infraestructura',
      error,
    };
  }
}

/**
 * View - Obtener detalles de infraestructura de una granja específica por ID
 * GET /api/collections/farm_details_infraestructura/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos de los detalles de infraestructura
 */
export async function getFarmDetailsInfraestructura(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('farm_details_infraestructura').getOne(id, {
      expand: 'frams,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Detalles de infraestructura obtenidos: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Detalles de infraestructura obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener detalles de infraestructura:', error);
    return {
      success: false,
      data: null,
      message: error?.message || 'Error al obtener detalles de infraestructura',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de detalles de infraestructura
 * POST /api/collections/farm_details_infraestructura/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos de los detalles de infraestructura
 * @returns Registro creado
 */
export async function createFarmDetailsInfraestructura(
  token: string,
  data: Omit<FarmDetailsInfraestructura, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.frams) {
      throw new Error('Falta el campo requerido: frams (ID de granja)');
    }

    // Limpiar datos undefined antes de enviar
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    console.log('📤 Datos limpios a enviar a PocketBase:', JSON.stringify(cleanData, null, 2));

    const record = await pb.collection('farm_details_infraestructura').create(cleanData);

    console.log(`✅ Detalles de infraestructura creados: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Detalles de infraestructura registrados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear detalles de infraestructura:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      return {
        success: false,
        data: null,
        message: pbError.message || 'Error al crear detalles de infraestructura',
        errors: pbError.data || {},
      };
    }
    
    return {
      success: false,
      data: null,
      message: error?.message || 'Error al crear detalles de infraestructura',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro de detalles de infraestructura existente
 * PATCH /api/collections/farm_details_infraestructura/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateFarmDetailsInfraestructura(
  token: string,
  id: string,
  data: Partial<Omit<FarmDetailsInfraestructura, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>>,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('farm_details_infraestructura').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    // Limpiar datos undefined antes de enviar (pero mantener strings vacíos para limpiar campos)
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    console.log('📤 Datos a actualizar:', JSON.stringify(cleanData, null, 2));
    
    const record = await pb.collection('farm_details_infraestructura').update(id, cleanData);

    console.log(`✅ Detalles de infraestructura actualizados: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Detalles de infraestructura actualizados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar detalles de infraestructura:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      return {
        success: false,
        data: null,
        message: pbError.message || 'Error al actualizar detalles de infraestructura',
        errors: pbError.data || {},
      };
    }
    
    return {
      success: false,
      data: null,
      message: error?.message || 'Error al actualizar detalles de infraestructura',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro de detalles de infraestructura
 * DELETE /api/collections/farm_details_infraestructura/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteFarmDetailsInfraestructura(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('farm_details_infraestructura').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('farm_details_infraestructura').delete(id);

    console.log(`✅ Detalles de infraestructura eliminados: ${id}`);
    return {
      success: true,
      message: 'Detalles de infraestructura eliminados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar detalles de infraestructura:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      return {
        success: false,
        message: pbError.message || 'Error al eliminar detalles de infraestructura',
        errors: pbError.data || {},
      };
    }
    
    return {
      success: false,
      message: error?.message || 'Error al eliminar detalles de infraestructura',
      error,
    };
  }
}

/**
 * Search - Buscar detalles de infraestructura por farm ID
 * GET /api/collections/farm_details_infraestructura/records
 * @param token - Token de autenticación del usuario
 * @param farmId - ID de la granja
 * @param userId - ID del usuario autenticado
 * @returns Detalles de infraestructura encontrados
 */
export async function searchFarmDetailsInfraestructuraByFarmId(
  token: string,
  farmId: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const filter = `frams="${farmId}" && user="${userId}"`;

    const records = await pb.collection('farm_details_infraestructura').getList(1, 1, {
      filter,
      expand: 'frams,user',
    });

    if (records.items.length === 0) {
      return {
        success: true,
        data: null,
        message: 'No se encontraron detalles de infraestructura para esta granja',
      };
    }

    console.log(`✅ Detalles de infraestructura encontrados para farm: ${farmId}`);
    return {
      success: true,
      data: records.items[0],
      message: 'Detalles de infraestructura encontrados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al buscar detalles de infraestructura:', error);
    
    // Si es un error 400 o 404, significa que no existe el registro (caso normal)
    if (error?.status === 400 || error?.status === 404 || error?.response?.status === 400 || error?.response?.status === 404) {
      console.log('ℹ️ No se encontraron detalles de infraestructura para esta granja (error esperado)');
      return {
        success: true,
        data: null,
        message: 'No se encontraron detalles de infraestructura para esta granja',
      };
    }
    
    // Para otros errores, retornar como error
    return {
      success: false,
      data: null,
      message: error?.message || 'Error al buscar detalles de infraestructura',
      error,
    };
  }
}
