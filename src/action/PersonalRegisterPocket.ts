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
  certificado?: string; // URL del archivo
  titulaciones: string[]; // Array de titulaciones seleccionadas
  tareas: string[]; // Array de tareas asignadas
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

// Interfaz para crear personal
export interface CreateStaffData {
  dni: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  correo: string;
  fecha_inicio: string;
  fecha_finalizacion: string;
  experiencia?: string;
  certificado?: File; // Archivo para subir
  titulaciones: string[];
  tareas: string[];
  farm: string;
  user: string;
}

// Interfaz para actualizar personal
export interface UpdateStaffData {
  dni?: string;
  nombre?: string;
  apellidos?: string;
  telefono?: string;
  correo?: string;
  fecha_inicio?: string;
  fecha_finalizacion?: string;
  experiencia?: string;
  certificado?: File; // Archivo para subir
  titulaciones?: string[];
  tareas?: string[];
  farm?: string;
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
  data: CreateStaffData
) {
  const pb = new PocketBase('https://api.appsphere.pro');
  
  try {
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.dni || !data.nombre || !data.apellidos || !data.telefono || !data.correo) {
      throw new Error('Faltan campos requeridos: dni, nombre, apellidos, telefono, correo');
    }

    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    // Validar archivo de certificado si existe
    if (data.certificado) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB en bytes

      if (!allowedTypes.includes(data.certificado.type)) {
        throw new Error('Certificado: Tipo no válido. Solo se permiten JPG, PNG o PDF');
      }
      if (data.certificado.size > maxSize) {
        throw new Error('Certificado: Tamaño máximo 5MB');
      }
    }

    // Preparar FormData para archivos
    const formData = new FormData();
    formData.append('dni', data.dni);
    formData.append('nombre', data.nombre);
    formData.append('apellidos', data.apellidos);
    formData.append('telefono', data.telefono);
    formData.append('correo', data.correo);
    formData.append('fecha_inicio', data.fecha_inicio);
    formData.append('fecha_finalizacion', data.fecha_finalizacion);
    formData.append('farm', data.farm);
    formData.append('user', data.user);
    
    if (data.experiencia) {
      formData.append('experiencia', data.experiencia);
    }

    // Asegurar que titulaciones y tareas sean arrays
    const titulaciones = Array.isArray(data.titulaciones) ? data.titulaciones : [];
    const tareas = Array.isArray(data.tareas) ? data.tareas : [];
    
    formData.append('titulaciones', JSON.stringify(titulaciones));
    formData.append('tareas', JSON.stringify(tareas));

    // Agregar archivo si existe
    // IMPORTANTE: El nombre del campo debe coincidir exactamente con el nombre
    // del campo file definido en la colección 'staff' de PocketBase
    if (data.certificado) {
      formData.append('certificado', data.certificado);
    }

    const record = await pb.collection('staff').create(formData);

    console.log(`✅ Personal creado: ${record.nombre}`);
    return {
      success: true,
      data: record as Staff,
      message: 'Personal registrado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear personal:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al procesar el personal en el servidor',
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
  data: UpdateStaffData,
  userId: string
) {
  const pb = new PocketBase('https://api.appsphere.pro');
  
  try {
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('staff').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    // Validar archivo de certificado si existe
    if (data.certificado) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB en bytes

      if (!allowedTypes.includes(data.certificado.type)) {
        throw new Error('Certificado: Tipo no válido. Solo se permiten JPG, PNG o PDF');
      }
      if (data.certificado.size > maxSize) {
        throw new Error('Certificado: Tamaño máximo 5MB');
      }
    }

    // Si hay un archivo, usar FormData
    let updateData: any;
    if (data.certificado) {
      const formData = new FormData();
      
      // Agregar campos simples
      if (data.dni) formData.append('dni', data.dni);
      if (data.nombre) formData.append('nombre', data.nombre);
      if (data.apellidos) formData.append('apellidos', data.apellidos);
      if (data.telefono) formData.append('telefono', data.telefono);
      if (data.correo) formData.append('correo', data.correo);
      if (data.fecha_inicio) formData.append('fecha_inicio', data.fecha_inicio);
      if (data.fecha_finalizacion) formData.append('fecha_finalizacion', data.fecha_finalizacion);
      if (data.experiencia) formData.append('experiencia', data.experiencia);
      if (data.farm) formData.append('farm', data.farm);
      
      // Agregar arrays si existen
      if (data.titulaciones) {
        formData.append('titulaciones', JSON.stringify(data.titulaciones));
      }
      if (data.tareas) {
        formData.append('tareas', JSON.stringify(data.tareas));
      }

      // Agregar archivo
      formData.append('certificado', data.certificado);
      
      updateData = formData;
    } else {
      // Sin archivo, usar objeto normal
      updateData = { ...data };
    }

    const record = await pb.collection('staff').update(id, updateData);

    console.log(`✅ Personal actualizado: ${record.nombre}`);
    return {
      success: true,
      data: record as Staff,
      message: 'Personal actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar personal:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al procesar la actualización en el servidor',
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
