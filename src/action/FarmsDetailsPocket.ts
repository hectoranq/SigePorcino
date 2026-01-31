import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de detalles de granja
export interface FarmDetails {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  frams: string; // ID de la granja relacionada (nota: es "frams" en PocketBase)
  anio_construccion?: number;
  anio_renovacion?: number;
  superficie_autorizada?: number;
  superficie_util?: number;
  observaciones_superficie?: string;
  capacidad_autorizada?: number;
  orientacion_naves?: string;
  delimitacion_perimetral?: string;
  observaciones_delimitacion?: string;
  tipo_aislamiento?: string;
  numero_trabajadores?: number;
  suelo_hormigon?: boolean;
  suelo_metalico?: boolean;
  suelo_plastico?: boolean;
  suelo_custom?: string; // JSON string
  empanillado_hormigon?: boolean;
  empanillado_metalico?: boolean;
  empanillado_plastico?: boolean;
  empanillado_custom?: string; // JSON string
  luxometro?: string;
  termometro?: string;
  medidores_gases?: string;
  sonometro?: string;
  higrometro?: string;
  rampa_carga_descarga?: string;
  desplazamiento_tableros?: boolean;
  desplazamiento_puertas?: boolean;
  desplazamiento_custom?: string; // JSON string
  sistema_eliminacion_cadaveres?: string;
  otros_carro_contenedor?: boolean;
  otros_custom?: string; // JSON string
  user?: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

/**
 * List/Search - Obtener todos los detalles de granjas
 * GET /api/collections/farm_details/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de detalles de granjas
 */
export async function listFarmDetails(
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

    const records = await pb.collection('farm_details').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'frams,user',
    });

    console.log(`✅ Detalles de granjas obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Detalles de granjas obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener detalles de granjas:', error);
    return {
      success: false,
      data: null,
      message: error?.message || 'Error al obtener detalles de granjas',
      error,
    };
  }
}

/**
 * View - Obtener detalles de una granja específica por ID
 * GET /api/collections/farm_details/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos de los detalles de la granja
 */
export async function getFarmDetails(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('farm_details').getOne(id, {
      expand: 'frams,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Detalles de granja obtenidos: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Detalles de granja obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener detalles de granja:', error);
    return {
      success: false,
      data: null,
      message: error?.message || 'Error al obtener detalles de granja',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de detalles de granja
 * POST /api/collections/farm_details/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos de los detalles de granja
 * @returns Registro creado
 */
export async function createFarmDetails(
  token: string,
  data: Omit<FarmDetails, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
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

    console.log("📤 Datos limpios a enviar a PocketBase:", JSON.stringify(cleanData, null, 2));

    const record = await pb.collection('farm_details').create(cleanData);

    console.log(`✅ Detalles de granja creados: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Detalles de granja registrados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear detalles de granja:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      return {
        success: false,
        data: null,
        message: pbError.message || 'Error al crear detalles de granja',
        errors: pbError.data || {},
      };
    }
    
    return {
      success: false,
      data: null,
      message: error?.message || 'Error al crear detalles de granja',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro de detalles de granja existente
 * PATCH /api/collections/farm_details/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateFarmDetails(
  token: string,
  id: string,
  data: Partial<Omit<FarmDetails, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>>
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Limpiar datos undefined antes de enviar (pero mantener strings vacíos para limpiar campos)
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    console.log('📤 Datos a actualizar:', JSON.stringify(cleanData, null, 2));
    
    const record = await pb.collection('farm_details').update(id, cleanData);

    console.log(`✅ Detalles de granja actualizados: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Detalles de granja actualizados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar detalles de granja:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      return {
        success: false,
        data: null,
        message: pbError.message || 'Error al actualizar detalles de granja',
        errors: pbError.data || {},
      };
    }
    
    return {
      success: false,
      data: null,
      message: error?.message || 'Error al actualizar detalles de granja',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro de detalles de granja
 * DELETE /api/collections/farm_details/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteFarmDetails(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('farm_details').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('farm_details').delete(id);

    console.log(`✅ Detalles de granja eliminados: ${id}`);
    return {
      success: true,
      message: 'Detalles de granja eliminados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar detalles de granja:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      return {
        success: false,
        message: pbError.message || 'Error al eliminar detalles de granja',
        errors: pbError.data || {},
      };
    }
    
    return {
      success: false,
      message: error?.message || 'Error al eliminar detalles de granja',
      error,
    };
  }
}

/**
 * Search - Buscar detalles de granja por farm ID
 * GET /api/collections/farm_details/records
 * @param token - Token de autenticación del usuario
 * @param farmId - ID de la granja
 * @param userId - ID del usuario autenticado
 * @returns Detalles de granja encontrados
 */
export async function searchFarmDetailsByFarmId(
  token: string,
  farmId: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const filter = `frams="${farmId}"`;

    const records = await pb.collection('farm_details').getList(1, 1, {
      filter,
      expand: 'frams',
    });

    if (records.items.length === 0) {
      return {
        success: true,
        data: null,
        message: 'No se encontraron detalles para esta granja',
      };
    }

    console.log(`✅ Detalles de granja encontrados para farm: ${farmId}`);
    return {
      success: true,
      data: records.items[0],
      message: 'Detalles de granja encontrados exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al buscar detalles de granja:', error);
    
    // Si es un error 400 o 404, significa que no existe el registro (caso normal)
    if (error?.status === 400 || error?.status === 404 || error?.response?.status === 400 || error?.response?.status === 404) {
      console.log('ℹ️ No se encontraron detalles para esta granja (error esperado)');
      return {
        success: true,
        data: null,
        message: 'No se encontraron detalles para esta granja',
      };
    }
    
    // Para otros errores, retornar como error
    return {
      success: false,
      data: null,
      message: error?.message || 'Error al buscar detalles de granja',
      error,
    };
  }
}
