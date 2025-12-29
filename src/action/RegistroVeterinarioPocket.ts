import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de veterinarios
export interface Veterinarian {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  numero_colegiado: string;
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  fecha_inicio: string; // ISO 8601 date string
  fecha_finalizacion: string; // ISO 8601 date string
  redaccion_planes: boolean;
  revision_animales: boolean;
  instruccion_manejo: boolean;
  informacion_bioseguridad: boolean;
  plan_ejecucion_tareas?: string;
  plan_visitas_zoonotarias?: string;
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

/**
 * List/Search - Obtener todos los veterinarios
 * GET /api/collections/veterinarians/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de veterinarios
 */
export async function listVeterinarians(
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

    const records = await pb.collection('veterinarians').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user',
    });

    console.log(`✅ Veterinarios obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Veterinarios obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener veterinarios:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener veterinarios',
      error,
    };
  }
}

/**
 * View - Obtener un veterinario específico por ID
 * GET /api/collections/veterinarians/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del veterinario
 */
export async function getVeterinarian(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('veterinarians').getOne(id, {
      expand: 'farm,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Veterinario obtenido: ${record.nombres}`);
    return {
      success: true,
      data: record,
      message: 'Veterinario obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener veterinario:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener veterinario',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de veterinario
 * POST /api/collections/veterinarians/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos del veterinario
 * @returns Registro creado
 */
export async function createVeterinarian(
  token: string,
  data: Omit<Veterinarian, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.numero_colegiado || !data.dni || !data.nombres || !data.apellidos) {
      throw new Error('Faltan campos requeridos: numero_colegiado, dni, nombres, apellidos');
    }

    if (!data.telefono || !data.correo) {
      throw new Error('Faltan campos requeridos: telefono, correo');
    }

    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    const record = await pb.collection('veterinarians').create(data);

    console.log(`✅ Veterinario creado: ${record.nombres} ${record.apellidos}`);
    return {
      success: true,
      data: record,
      message: 'Veterinario registrado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear veterinario:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al crear veterinario',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al crear veterinario',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro de veterinario existente
 * PATCH /api/collections/veterinarians/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateVeterinarian(
  token: string,
  id: string,
  data: Partial<Omit<Veterinarian, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>>,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('veterinarians').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const record = await pb.collection('veterinarians').update(id, data);

    console.log(`✅ Veterinario actualizado: ${record.nombres} ${record.apellidos}`);
    return {
      success: true,
      data: record,
      message: 'Veterinario actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar veterinario:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al actualizar veterinario',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al actualizar veterinario',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro de veterinario
 * DELETE /api/collections/veterinarians/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteVeterinarian(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('veterinarians').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('veterinarians').delete(id);

    console.log(`✅ Veterinario eliminado: ${id}`);
    return {
      success: true,
      message: 'Veterinario eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar veterinario:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar veterinario',
      error,
    };
  }
}

/**
 * Funciones auxiliares
 */

/**
 * Buscar veterinarios por DNI
 */
export async function searchByDni(token: string, dni: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('veterinarians').getList(1, 50, {
      filter: `user="${userId}" && dni~"${dni}"`,
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
 * Buscar veterinarios por número de colegiado
 */
export async function searchByNumeroColegiado(
  token: string,
  numeroColegiado: string,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('veterinarians').getList(1, 50, {
      filter: `user="${userId}" && numero_colegiado~"${numeroColegiado}"`,
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
 * Obtener veterinarios activos (fecha_finalizacion en el futuro o no definida)
 */
export async function getActiveVeterinarians(
  token: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const today = new Date().toISOString().split('T')[0];
    
    let filter = `user="${userId}" && (fecha_finalizacion >= "${today}" || fecha_finalizacion = "")`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('veterinarians').getList(1, 50, {
      filter,
      sort: '-created',
      expand: 'farm,user',
    });

    return {
      success: true,
      data: records,
      message: 'Veterinarios activos obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener veterinarios activos:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener veterinarios activos',
      error,
    };
  }
}

export default {
  listVeterinarians,
  getVeterinarian,
  createVeterinarian,
  updateVeterinarian,
  deleteVeterinarian,
  searchByDni,
  searchByNumeroColegiado,
  getActiveVeterinarians,
};
