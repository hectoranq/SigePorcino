import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos del personal
export interface Staff {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  dni: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  correo: string;
  fecha_inicio: string; // ISO 8601 date string
  fecha_finalizacion: string; // ISO 8601 date string
  experiencia?: string;
  titulaciones: string[]; // Array de titulaciones seleccionadas
  tareas: string[]; // Array de tareas asignadas
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

/**
 * List/Search - Obtener todo el personal
 * GET /api/collections/staff/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista del personal
 */
export async function listStaff(
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

    const records = await pb.collection('staff').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user',
    });

    console.log(`✅ Personal obtenido: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Personal obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener personal:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener personal',
      error,
    };
  }
}

/**
 * View - Obtener un miembro del personal específico por ID
 * GET /api/collections/staff/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del personal
 */
export async function getStaffMember(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('staff').getOne(id, {
      expand: 'farm,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Personal obtenido: ${record.nombre}`);
    return {
      success: true,
      data: record,
      message: 'Personal obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener personal:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener personal',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de personal
 * POST /api/collections/staff/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos del personal
 * @returns Registro creado
 */
export async function createStaff(
  token: string,
  data: Omit<Staff, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.dni || !data.nombre || !data.apellidos || !data.telefono || !data.correo) {
      throw new Error('Faltan campos requeridos: dni, nombre, apellidos, telefono, correo');
    }

    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    // Asegurar que titulaciones y tareas sean arrays
    if (!Array.isArray(data.titulaciones)) {
      data.titulaciones = [];
    }
    if (!Array.isArray(data.tareas)) {
      data.tareas = [];
    }

    const record = await pb.collection('staff').create(data);

    console.log(`✅ Personal creado: ${record.nombre}`);
    return {
      success: true,
      data: record,
      message: 'Personal registrado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear personal:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al crear personal',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al crear personal',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro de personal existente
 * PATCH /api/collections/staff/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateStaff(
  token: string,
  id: string,
  data: Partial<Omit<Staff, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>>,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('staff').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const record = await pb.collection('staff').update(id, data);

    console.log(`✅ Personal actualizado: ${record.nombre}`);
    return {
      success: true,
      data: record,
      message: 'Personal actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar personal:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al actualizar personal',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al actualizar personal',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro de personal
 * DELETE /api/collections/staff/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteStaff(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('staff').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('staff').delete(id);

    console.log(`✅ Personal eliminado: ${id}`);
    return {
      success: true,
      message: 'Personal eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar personal:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar personal',
      error,
    };
  }
}

/**
 * Funciones auxiliares
 */

/**
 * Buscar personal por DNI
 */
export async function searchByDni(token: string, dni: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('staff').getList(1, 50, {
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
 * Obtener personal por titulación
 */
export async function getByTitulacion(
  token: string,
  titulacion: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && titulaciones~"${titulacion}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('staff').getList(1, 50, {
      filter,
      expand: 'farm,user',
    });

    return {
      success: true,
      data: records,
      message: 'Personal obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener por titulación:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registros',
      error,
    };
  }
}

/**
 * Obtener personal por tarea
 */
export async function getByTarea(
  token: string,
  tarea: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && tareas~"${tarea}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('staff').getList(1, 50, {
      filter,
      expand: 'farm,user',
    });

    return {
      success: true,
      data: records,
      message: 'Personal obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener por tarea:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registros',
      error,
    };
  }
}

export default {
  listStaff,
  getStaffMember,
  createStaff,
  updateStaff,
  deleteStaff,
  searchByDni,
  getByTitulacion,
  getByTarea,
};
