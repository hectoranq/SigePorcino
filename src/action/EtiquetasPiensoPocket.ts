import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de etiquetas de pienso
export interface EtiquetasPienso {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  nombre: string;
  archivo: string; // Nombre del archivo almacenado en PocketBase
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

/**
 * Función helper para obtener la URL completa del archivo
 */
export function getFileUrl(record: any, filename: string): string {
  return `https://api.appsphere.pro/api/files/${record.collectionName}/${record.id}/${filename}`;
}

/**
 * List/Search - Obtener todos los registros de etiquetas de pienso
 * GET /api/collections/etiquetas_pienso/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de etiquetas de pienso
 */
export async function listEtiquetasPienso(
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

    const records = await pb.collection('etiquetas_pienso').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user',
    });

    console.log(`✅ Etiquetas de pienso obtenidas: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Etiquetas de pienso obtenidas exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener etiquetas de pienso:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener etiquetas de pienso',
      error,
    };
  }
}

/**
 * View - Obtener un registro específico de etiqueta de pienso por ID
 * GET /api/collections/etiquetas_pienso/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos de la etiqueta de pienso
 */
export async function getEtiquetasPienso(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('etiquetas_pienso').getOne(id, {
      expand: 'farm,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Etiqueta de pienso obtenida: ${record.nombre}`);
    return {
      success: true,
      data: record,
      message: 'Etiqueta de pienso obtenida exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener etiqueta de pienso:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener etiqueta de pienso',
      error,
    };
  }
}

/**
 * Create - Crear un nuevo registro de etiqueta de pienso
 * POST /api/collections/etiquetas_pienso/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos de la etiqueta de pienso
 * @param file - Archivo a subir
 * @returns Registro creado
 */
export async function createEtiquetasPienso(
  token: string,
  data: { nombre: string; farm: string; user: string },
  file: File
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.nombre || data.nombre.trim() === '') {
      throw new Error('El nombre es requerido');
    }

    if (!file) {
      throw new Error('El archivo es requerido');
    }

    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    // Validar tipo y tamaño del archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no válido. Solo se permiten JPG, PNG o PDF');
    }

    if (file.size > maxSize) {
      throw new Error('Tamaño máximo de archivo: 10MB');
    }

    // Crear FormData para enviar archivo
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('archivo', file);
    formData.append('farm', data.farm);
    formData.append('user', data.user);

    const record = await pb.collection('etiquetas_pienso').create(formData);

    console.log(`✅ Etiqueta de pienso creada: ${record.nombre}`);
    return {
      success: true,
      data: record,
      message: 'Etiqueta de pienso registrada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear etiqueta de pienso:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al crear etiqueta de pienso',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al crear etiqueta de pienso',
      error,
    };
  }
}

/**
 * Update - Actualizar un registro de etiqueta de pienso existente
 * PATCH /api/collections/etiquetas_pienso/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @param file - (Opcional) Nuevo archivo a subir
 * @returns Registro actualizado
 */
export async function updateEtiquetasPienso(
  token: string,
  id: string,
  data: { nombre?: string },
  userId: string,
  file?: File
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('etiquetas_pienso').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    // Validar datos si están presentes
    if (data.nombre !== undefined && data.nombre.trim() === '') {
      throw new Error('El nombre no puede estar vacío');
    }

    // Validar tipo y tamaño del archivo si se proporciona
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      const maxSize = 10 * 1024 * 1024; // 10MB en bytes

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de archivo no válido. Solo se permiten JPG, PNG o PDF');
      }

      if (file.size > maxSize) {
        throw new Error('Tamaño máximo de archivo: 10MB');
      }
    }

    // Crear FormData si hay archivo, sino enviar objeto normal
    let updateData: FormData | any;
    
    if (file) {
      updateData = new FormData();
      if (data.nombre) {
        updateData.append('nombre', data.nombre);
      }
      updateData.append('archivo', file);
    } else {
      updateData = data;
    }

    const record = await pb.collection('etiquetas_pienso').update(id, updateData);

    console.log(`✅ Etiqueta de pienso actualizada: ${record.id}`);
    return {
      success: true,
      data: record,
      message: 'Etiqueta de pienso actualizada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar etiqueta de pienso:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al actualizar etiqueta de pienso',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al actualizar etiqueta de pienso',
      error,
    };
  }
}

/**
 * Delete - Eliminar un registro de etiqueta de pienso
 * DELETE /api/collections/etiquetas_pienso/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteEtiquetasPienso(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('etiquetas_pienso').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('etiquetas_pienso').delete(id);

    console.log(`✅ Etiqueta de pienso eliminada: ${id}`);
    return {
      success: true,
      message: 'Etiqueta de pienso eliminada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar etiqueta de pienso:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar etiqueta de pienso',
      error,
    };
  }
}

/**
 * Funciones auxiliares
 */

/**
 * Buscar etiquetas de pienso por nombre
 */
export async function searchByNombre(
  token: string,
  nombre: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && nombre~"${nombre}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('etiquetas_pienso').getList(1, 50, {
      filter,
      sort: '-created',
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
 * Obtener etiquetas de pienso por tipo (basado en palabras clave en el nombre)
 */
export async function searchByTipo(
  token: string,
  tipo: string,
  userId: string,
  farmId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Buscar por palabras clave comunes: iniciador, crecimiento, acabado, etc.
    let filter = `user="${userId}" && nombre~"${tipo}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('etiquetas_pienso').getList(1, 50, {
      filter,
      sort: '-created',
      expand: 'farm,user',
    });

    return {
      success: true,
      data: records,
      message: 'Búsqueda por tipo completada',
    };
  } catch (error: any) {
    console.error('❌ Error en búsqueda por tipo:', error);
    throw {
      success: false,
      message: error?.message || 'Error en la búsqueda',
      error,
    };
  }
}

/**
 * Obtener etiquetas recientes
 */
export async function getEtiquetasRecientes(
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

    const records = await pb.collection('etiquetas_pienso').getList(1, limit, {
      filter,
      sort: '-created',
      expand: 'farm',
    });

    return {
      success: true,
      data: records,
      message: 'Etiquetas recientes obtenidas exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener etiquetas recientes:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener etiquetas recientes',
      error,
    };
  }
}

/**
 * Contar total de etiquetas por granja
 */
export async function getTotalByFarm(
  token: string,
  userId: string,
  farmId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const filter = `user="${userId}" && farm="${farmId}"`;

    const records = await pb.collection('etiquetas_pienso').getList(1, 1, {
      filter,
    });

    return {
      success: true,
      data: {
        total: records.totalItems,
      },
      message: 'Total de etiquetas obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al contar etiquetas:', error);
    throw {
      success: false,
      message: error?.message || 'Error al contar etiquetas',
      error,
    };
  }
}

/**
 * Obtener todas las etiquetas con metadatos de archivo
 */
export async function getAllWithFileInfo(
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

    const records = await pb.collection('etiquetas_pienso').getList(1, 100, {
      filter,
      sort: 'nombre',
      expand: 'farm,user',
    });

    // Agregar URLs completas de archivos
    const recordsWithUrls = records.items.map(record => ({
      ...record,
      archivoUrl: record.archivo ? getFileUrl(record, record.archivo) : null,
    }));

    return {
      success: true,
      data: {
        ...records,
        items: recordsWithUrls,
      },
      message: 'Etiquetas con información de archivo obtenidas exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener etiquetas con info de archivo:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener etiquetas',
      error,
    };
  }
}

/**
 * Verificar si existe una etiqueta con el mismo nombre
 */
export async function checkDuplicateName(
  token: string,
  nombre: string,
  userId: string,
  farmId: string,
  excludeId?: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && farm="${farmId}" && nombre="${nombre}"`;
    if (excludeId) {
      filter += ` && id!="${excludeId}"`;
    }

    const records = await pb.collection('etiquetas_pienso').getList(1, 1, {
      filter,
    });

    return {
      success: true,
      data: {
        exists: records.totalItems > 0,
        count: records.totalItems,
      },
      message: records.totalItems > 0 
        ? 'Ya existe una etiqueta con ese nombre' 
        : 'Nombre disponible',
    };
  } catch (error: any) {
    console.error('❌ Error al verificar nombre duplicado:', error);
    throw {
      success: false,
      message: error?.message || 'Error al verificar nombre',
      error,
    };
  }
}

export default {
  listEtiquetasPienso,
  getEtiquetasPienso,
  createEtiquetasPienso,
  updateEtiquetasPienso,
  deleteEtiquetasPienso,
  searchByNombre,
  searchByTipo,
  getEtiquetasRecientes,
  getTotalByFarm,
  getAllWithFileInfo,
  checkDuplicateName,
  getFileUrl,
};
