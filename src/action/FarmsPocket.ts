import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de granjas
export interface Farm {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  REGA: string;
  farm_name: string;
  locality: string;
  province: string;
  address: string;
  groups: string;
  species: string;
  zootechnical_classification: string;
  health_qualification: string;
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

/**
 * List/Search - Obtener todas las granjas
 * GET /api/collections/farms/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de granjas
 */
export async function listFarms(
  token: string,
  userId: string,
  page: number = 1,
  perPage: number = 50
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Filtrar por usuario
    const filter = `user="${userId}"`;

    const records = await pb.collection('farms').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'user',
    });

    console.log(`✅ Granjas obtenidas: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Granjas obtenidas exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener granjas:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener granjas',
      error,
    };
  }
}

/**
 * View - Obtener una granja específica por ID
 * GET /api/collections/farms/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos de la granja
 */
export async function getFarm(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('farms').getOne(id, {
      expand: 'user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Granja obtenida: ${record.farm_name}`);
    return {
      success: true,
      data: record,
      message: 'Granja obtenida exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener granja:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener granja',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de granja
 * POST /api/collections/farms/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos de la granja
 * @returns Registro creado
 */
export async function createFarm(
  token: string,
  data: Omit<Farm, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.REGA || !data.farm_name) {
      throw new Error('Faltan campos requeridos: REGA, farm_name');
    }

    if (!data.locality || !data.province || !data.address) {
      throw new Error('Faltan campos requeridos: locality, province, address');
    }

    if (!data.groups || !data.species) {
      throw new Error('Faltan campos requeridos: groups, species');
    }

    if (!data.user) {
      throw new Error('Falta relación requerida: user');
    }

    const record = await pb.collection('farms').create(data);

    console.log(`✅ Granja creada: ${record.farm_name}`);
    return {
      success: true,
      data: record,
      message: 'Granja registrada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear granja:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al crear granja',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al crear granja',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro de granja existente
 * PATCH /api/collections/farms/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateFarm(
  token: string,
  id: string,
  data: Partial<Omit<Farm, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>>,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('farms').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const record = await pb.collection('farms').update(id, data);

    console.log(`✅ Granja actualizada: ${record.farm_name}`);
    return {
      success: true,
      data: record,
      message: 'Granja actualizada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar granja:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al actualizar granja',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al actualizar granja',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro de granja
 * DELETE /api/collections/farms/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteFarm(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('farms').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('farms').delete(id);

    console.log(`✅ Granja eliminada: ${id}`);
    return {
      success: true,
      message: 'Granja eliminada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar granja:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar granja',
      error,
    };
  }
}

/**
 * Funciones auxiliares
 */

/**
 * Buscar granjas por REGA
 */
export async function searchByREGA(token: string, rega: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('farms').getList(1, 50, {
      filter: `user="${userId}" && REGA~"${rega}"`,
      expand: 'user',
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
 * Buscar granjas por nombre
 */
export async function searchByName(token: string, name: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('farms').getList(1, 50, {
      filter: `user="${userId}" && farm_name~"${name}"`,
      expand: 'user',
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
 * Obtener granjas filtradas por especie
 */
export async function getFarmsBySpecies(token: string, species: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('farms').getList(1, 50, {
      filter: `user="${userId}" && species="${species}"`,
      sort: '-created',
      expand: 'user',
    });

    return {
      success: true,
      data: records,
      message: 'Granjas filtradas por especie obtenidas exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener granjas por especie:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener granjas por especie',
      error,
    };
  }
}

/**
 * Obtener granjas filtradas por provincia
 */
export async function getFarmsByProvince(token: string, province: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('farms').getList(1, 50, {
      filter: `user="${userId}" && province="${province}"`,
      sort: '-created',
      expand: 'user',
    });

    return {
      success: true,
      data: records,
      message: 'Granjas filtradas por provincia obtenidas exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener granjas por provincia:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener granjas por provincia',
      error,
    };
  }
}

/**
 * Obtener estadísticas de granjas por usuario
 */
export async function getFarmsStatistics(token: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Obtener todas las granjas del usuario
    const records = await pb.collection('farms').getList(1, 200, {
      filter: `user="${userId}"`,
      expand: 'user',
    });

    // Calcular estadísticas
    const total = records.items.length;
    const bySpecies: { [key: string]: number } = {};
    const byProvince: { [key: string]: number } = {};
    const byGroup: { [key: string]: number } = {};

    records.items.forEach((farm: any) => {
      // Por especie
      if (farm.species) {
        bySpecies[farm.species] = (bySpecies[farm.species] || 0) + 1;
      }
      // Por provincia
      if (farm.province) {
        byProvince[farm.province] = (byProvince[farm.province] || 0) + 1;
      }
      // Por grupo
      if (farm.groups) {
        byGroup[farm.groups] = (byGroup[farm.groups] || 0) + 1;
      }
    });

    return {
      success: true,
      data: {
        total,
        bySpecies,
        byProvince,
        byGroup,
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
 * Validar si un REGA ya existe para el usuario
 */
export async function validateREGA(token: string, rega: string, userId: string, excludeId?: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && REGA="${rega}"`;
    if (excludeId) {
      filter += ` && id!="${excludeId}"`;
    }

    const records = await pb.collection('farms').getList(1, 1, {
      filter,
    });

    const exists = records.items.length > 0;

    return {
      success: true,
      data: {
        exists,
        available: !exists,
      },
      message: exists ? 'El REGA ya está registrado' : 'El REGA está disponible',
    };
  } catch (error: any) {
    console.error('❌ Error al validar REGA:', error);
    throw {
      success: false,
      message: error?.message || 'Error al validar REGA',
      error,
    };
  }
}

export default {
  listFarms,
  getFarm,
  createFarm,
  updateFarm,
  deleteFarm,
  searchByREGA,
  searchByName,
  getFarmsBySpecies,
  getFarmsByProvince,
  getFarmsStatistics,
  validateREGA,
};
