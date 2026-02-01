import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de detalles ambientales de granja
export interface FarmDetailsEnvironmental {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  // Temperatura
  has_temperature_sensors?: string; // si/no
  records_temperature?: string; // si/no
  temperature_control?: string; // si/no
  temperature_observations?: string;
  // Humedad
  has_humidity_sensors?: string; // si/no
  records_humidity?: string; // si/no
  humidity_control?: string; // si/no
  humidity_observations?: string;
  // Gases
  extractors_ventilators?: string; // si/no
  extractors_observations?: string;
  automatic_window_opening?: string; // si/no
  window_observations?: string;
  automatic_chimney_opening?: string; // si/no
  chimney_observations?: string;
  records_gas_emissions?: string; // si/no
  gas_observations?: string;
  coolings?: string; // si/no
  coolings_observations?: string;
  artificial_ventilation?: string; // si/no
  ventilation_observations?: string;
  heating_type?: string; // si/no
  heating_observations?: string;
  created?: string;
  updated?: string;
}

/**
 * List/Search - Obtener todos los detalles ambientales de granjas
 * GET /api/collections/farm_details_environmental/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de detalles ambientales
 */
export async function listFarmDetailsEnvironmental(
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

    const records = await pb.collection('farm_details_environmental').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user',
    });

    console.log(`✅ Detalles ambientales obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Detalles ambientales obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener detalles ambientales:', error);
    return {
      success: false,
      data: null,
      message: error?.message || 'Error al obtener detalles ambientales',
      error,
    };
  }
}

/**
 * View - Obtener detalles ambientales de una granja específica por ID
 * GET /api/collections/farm_details_environmental/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos de los detalles ambientales
 */
export async function getFarmDetailsEnvironmental(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('farm_details_environmental').getOne(id, {
      expand: 'farm,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Detalles ambientales obtenidos: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Detalles ambientales obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener detalles ambientales:', error);
    return {
      success: false,
      data: null,
      message: error?.message || 'Error al obtener detalles ambientales',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de detalles ambientales
 * POST /api/collections/farm_details_environmental/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos de los detalles ambientales
 * @returns Registro creado
 */
export async function createFarmDetailsEnvironmental(
  token: string,
  data: Omit<FarmDetailsEnvironmental, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.farm) {
      throw new Error('Falta el campo requerido: farm (ID de granja)');
    }

    if (!data.user) {
      throw new Error('Falta el campo requerido: user (ID de usuario)');
    }

    // Limpiar datos undefined antes de enviar
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    console.log('📤 Datos limpios a enviar a PocketBase:', JSON.stringify(cleanData, null, 2));

    const record = await pb.collection('farm_details_environmental').create(cleanData);

    console.log(`✅ Detalles ambientales creados: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Detalles ambientales registrados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear detalles ambientales:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      return {
        success: false,
        data: null,
        message: pbError.message || 'Error al crear detalles ambientales',
        errors: pbError.data || {},
      };
    }
    
    return {
      success: false,
      data: null,
      message: error?.message || 'Error al crear detalles ambientales',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro de detalles ambientales existente
 * PATCH /api/collections/farm_details_environmental/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateFarmDetailsEnvironmental(
  token: string,
  id: string,
  data: Partial<Omit<FarmDetailsEnvironmental, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>>,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('farm_details_environmental').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    // Limpiar datos undefined antes de enviar
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    console.log('📤 Datos limpios a actualizar en PocketBase:', JSON.stringify(cleanData, null, 2));

    const record = await pb.collection('farm_details_environmental').update(id, cleanData);

    console.log(`✅ Detalles ambientales actualizados: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Detalles ambientales actualizados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar detalles ambientales:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      return {
        success: false,
        data: null,
        message: pbError.message || 'Error al actualizar detalles ambientales',
        errors: pbError.data || {},
      };
    }
    
    return {
      success: false,
      data: null,
      message: error?.message || 'Error al actualizar detalles ambientales',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro de detalles ambientales
 * DELETE /api/collections/farm_details_environmental/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteFarmDetailsEnvironmental(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('farm_details_environmental').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('farm_details_environmental').delete(id);

    console.log(`✅ Detalles ambientales eliminados: ${id}`);
    return {
      success: true,
      message: 'Detalles ambientales eliminados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar detalles ambientales:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      return {
        success: false,
        message: pbError.message || 'Error al eliminar detalles ambientales',
        errors: pbError.data || {},
      };
    }
    
    return {
      success: false,
      message: error?.message || 'Error al eliminar detalles ambientales',
      error,
    };
  }
}

/**
 * Search - Buscar detalles ambientales por farm ID
 * GET /api/collections/farm_details_environmental/records
 * @param token - Token de autenticación del usuario
 * @param farmId - ID de la granja
 * @param userId - ID del usuario autenticado
 * @returns Detalles ambientales encontrados
 */
export async function searchFarmDetailsEnvironmentalByFarmId(
  token: string,
  farmId: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const filter = `farm="${farmId}" && user="${userId}"`;

    const records = await pb.collection('farm_details_environmental').getList(1, 1, {
      filter,
      expand: 'farm,user',
    });

    if (records.items.length === 0) {
      return {
        success: true,
        data: null,
        message: 'No se encontraron detalles ambientales para esta granja',
      };
    }

    console.log(`✅ Detalles ambientales encontrados para farm: ${farmId}`);
    return {
      success: true,
      data: records.items[0],
      message: 'Detalles ambientales encontrados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al buscar detalles ambientales:', error);
    
    // Si es un error 400 o 404, significa que no existe el registro (caso normal)
    if (error?.status === 400 || error?.status === 404 || error?.response?.status === 400 || error?.response?.status === 404) {
      console.log('ℹ️ No se encontraron detalles ambientales para esta granja (error esperado)');
      return {
        success: true,
        data: null,
        message: 'No se encontraron detalles ambientales para esta granja',
      };
    }
    
    // Para otros errores, retornar como error
    return {
      success: false,
      data: null,
      message: error?.message || 'Error al buscar detalles ambientales',
      error,
    };
  }
}

export default {
  listFarmDetailsEnvironmental,
  getFarmDetailsEnvironmental,
  createFarmDetailsEnvironmental,
  updateFarmDetailsEnvironmental,
  deleteFarmDetailsEnvironmental,
  searchFarmDetailsEnvironmentalByFarmId,
};
