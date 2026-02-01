import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de detalles de recursos de granja
export interface FarmDetailsResources {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  // Iluminación
  lighting_type?: string; // JSON string array
  // Gestión de estiércol
  annual_manure_production?: string;
  pit_size_type?: string;
  slurry_emptying_frequency?: string;
  manure_collection_system?: string;
  liquid_manure_storage?: string;
  solid_manure_storage?: string;
  agronomic_valorization_percentage?: string;
  authorized_treatment_percentage?: string;
  // Energía y agua
  records_water_energy_consumption?: string; // si/no
  renewable_energy_use?: string; // si/no
  renewable_energy_observations?: string;
  rainwater_use?: string; // si/no
  rainwater_observations?: string;
  created?: string;
  updated?: string;
}

/**
 * List/Search - Obtener todos los detalles de recursos de granjas
 * GET /api/collections/farm_details_resources/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de detalles de recursos
 */
export async function listFarmDetailsResources(
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

    const records = await pb.collection('farm_details_resources').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user',
    });

    console.log(`✅ Detalles de recursos obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Detalles de recursos obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener detalles de recursos:', error);
    return {
      success: false,
      data: null,
      message: error?.message || 'Error al obtener detalles de recursos',
      error,
    };
  }
}

/**
 * View - Obtener detalles de recursos de una granja específica por ID
 * GET /api/collections/farm_details_resources/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos de los detalles de recursos
 */
export async function getFarmDetailsResources(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('farm_details_resources').getOne(id, {
      expand: 'farm,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Detalles de recursos obtenidos: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Detalles de recursos obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener detalles de recursos:', error);
    return {
      success: false,
      data: null,
      message: error?.message || 'Error al obtener detalles de recursos',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de detalles de recursos
 * POST /api/collections/farm_details_resources/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos de los detalles de recursos
 * @returns Registro creado
 */
export async function createFarmDetailsResources(
  token: string,
  data: Omit<FarmDetailsResources, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
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

    const record = await pb.collection('farm_details_resources').create(cleanData);

    console.log(`✅ Detalles de recursos creados: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Detalles de recursos registrados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear detalles de recursos:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      return {
        success: false,
        data: null,
        message: pbError.message || 'Error al crear detalles de recursos',
        errors: pbError.data || {},
      };
    }
    
    return {
      success: false,
      data: null,
      message: error?.message || 'Error al crear detalles de recursos',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro de detalles de recursos existente
 * PATCH /api/collections/farm_details_resources/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateFarmDetailsResources(
  token: string,
  id: string,
  data: Partial<Omit<FarmDetailsResources, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>>,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('farm_details_resources').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    // Limpiar datos undefined antes de enviar
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    console.log('📤 Datos limpios a actualizar en PocketBase:', JSON.stringify(cleanData, null, 2));

    const record = await pb.collection('farm_details_resources').update(id, cleanData);

    console.log(`✅ Detalles de recursos actualizados: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Detalles de recursos actualizados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar detalles de recursos:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      return {
        success: false,
        data: null,
        message: pbError.message || 'Error al actualizar detalles de recursos',
        errors: pbError.data || {},
      };
    }
    
    return {
      success: false,
      data: null,
      message: error?.message || 'Error al actualizar detalles de recursos',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro de detalles de recursos
 * DELETE /api/collections/farm_details_resources/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteFarmDetailsResources(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('farm_details_resources').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('farm_details_resources').delete(id);

    console.log(`✅ Detalles de recursos eliminados: ${id}`);
    return {
      success: true,
      message: 'Detalles de recursos eliminados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar detalles de recursos:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      return {
        success: false,
        message: pbError.message || 'Error al eliminar detalles de recursos',
        errors: pbError.data || {},
      };
    }
    
    return {
      success: false,
      message: error?.message || 'Error al eliminar detalles de recursos',
      error,
    };
  }
}

/**
 * Search - Buscar detalles de recursos por farm ID
 * GET /api/collections/farm_details_resources/records
 * @param token - Token de autenticación del usuario
 * @param farmId - ID de la granja
 * @param userId - ID del usuario autenticado
 * @returns Detalles de recursos encontrados
 */
export async function searchFarmDetailsResourcesByFarmId(
  token: string,
  farmId: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const filter = `farm="${farmId}" && user="${userId}"`;

    const records = await pb.collection('farm_details_resources').getList(1, 1, {
      filter,
      expand: 'farm,user',
    });

    if (records.items.length === 0) {
      return {
        success: true,
        data: null,
        message: 'No se encontraron detalles de recursos para esta granja',
      };
    }

    console.log(`✅ Detalles de recursos encontrados para farm: ${farmId}`);
    return {
      success: true,
      data: records.items[0],
      message: 'Detalles de recursos encontrados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al buscar detalles de recursos:', error);
    
    // Si es un error 400 o 404, significa que no existe el registro (caso normal)
    if (error?.status === 400 || error?.status === 404 || error?.response?.status === 400 || error?.response?.status === 404) {
      console.log('ℹ️ No se encontraron detalles de recursos para esta granja (error esperado)');
      return {
        success: true,
        data: null,
        message: 'No se encontraron detalles de recursos para esta granja',
      };
    }
    
    // Para otros errores, retornar como error
    return {
      success: false,
      data: null,
      message: error?.message || 'Error al buscar detalles de recursos',
      error,
    };
  }
}

export default {
  listFarmDetailsResources,
  getFarmDetailsResources,
  createFarmDetailsResources,
  updateFarmDetailsResources,
  deleteFarmDetailsResources,
  searchFarmDetailsResourcesByFarmId,
};
