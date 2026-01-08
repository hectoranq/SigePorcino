import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de Plan Sanitario
export interface PlanSanitario {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  plan_vacunacion: string;
  plan_vacunacion_archivo?: string; // URL del archivo
  plan_vacunacion_observaciones: string;
  plan_desparasitacion: string;
  plan_desparasitacion_archivo?: string; // URL del archivo
  plan_desparasitacion_observaciones: string;
  protocolo_vigilancia: string;
  protocolo_vigilancia_archivo?: string; // URL del archivo
  protocolo_vigilancia_observaciones: string;
  programa_muestreo: string;
  programa_muestreo_archivo?: string; // URL del archivo
  programa_muestreo_observaciones: string;
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

// Interfaz para crear un Plan Sanitario
export interface CreatePlanSanitarioData {
  plan_vacunacion: string;
  plan_vacunacion_archivo?: File;
  plan_vacunacion_observaciones: string;
  plan_desparasitacion: string;
  plan_desparasitacion_archivo?: File;
  plan_desparasitacion_observaciones: string;
  protocolo_vigilancia: string;
  protocolo_vigilancia_archivo?: File;
  protocolo_vigilancia_observaciones: string;
  programa_muestreo: string;
  programa_muestreo_archivo?: File;
  programa_muestreo_observaciones: string;
  farm: string;
}

// Interfaz para actualizar un Plan Sanitario
export interface UpdatePlanSanitarioData {
  plan_vacunacion?: string;
  plan_vacunacion_archivo?: File;
  plan_vacunacion_observaciones?: string;
  plan_desparasitacion?: string;
  plan_desparasitacion_archivo?: File;
  plan_desparasitacion_observaciones?: string;
  protocolo_vigilancia?: string;
  protocolo_vigilancia_archivo?: File;
  protocolo_vigilancia_observaciones?: string;
  programa_muestreo?: string;
  programa_muestreo_archivo?: File;
  programa_muestreo_observaciones?: string;
  farm?: string;
}

/**
 * List/Search - Obtener todos los planes sanitarios
 * GET /api/collections/plan_sanitario/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de planes sanitarios
 */
export async function listPlanSanitario(
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

    const records = await pb.collection('plan_sanitario').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user',
    });

    console.log(`✅ Planes sanitarios obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Planes sanitarios obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener planes sanitarios:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener planes sanitarios',
      error,
    };
  }
}

/**
 * View - Obtener un plan sanitario específico por ID
 * GET /api/collections/plan_sanitario/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del plan sanitario
 */
export async function getPlanSanitarioById(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('plan_sanitario').getOne(id, {
      expand: 'farm,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Plan sanitario obtenido: ${record.id}`);
    return {
      success: true,
      data: record as PlanSanitario,
      message: 'Plan sanitario obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener plan sanitario:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener plan sanitario',
      error,
    };
  }
}

/**
 * Buscar planes sanitarios por ID de granja
 * GET /api/collections/plan_sanitario/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - ID de la granja
 * @returns Array de planes sanitarios
 */
export async function getPlanSanitarioByFarmId(
  token: string,
  userId: string,
  farmId: string
): Promise<PlanSanitario[] | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const result = await pb.collection('plan_sanitario').getList(1, 50, {
      filter: `farm="${farmId}" && user="${userId}"`,
      sort: '-created',
      expand: 'farm,user',
    });

    if (result.totalItems === 0) {
      console.log(`ℹ️ No se encontraron planes sanitarios para la granja ID: ${farmId}`);
      return [];
    }

    console.log(`✅ Se encontraron ${result.totalItems} plan(es) sanitario(s) para la granja ID: ${farmId}`);
    return result.items as PlanSanitario[];
  } catch (error: any) {
    console.error("❌ Error al obtener planes sanitarios por farmId:", error.message);
    return null;
  }
}

/**
 * Create - Crear un nuevo plan sanitario
 * POST /api/collections/plan_sanitario/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param data - Datos del plan sanitario
 * @returns Plan sanitario creado
 */
export async function createPlanSanitario(
  token: string,
  userId: string,
  data: CreatePlanSanitarioData
) {
  const pb = new PocketBase('https://api.appsphere.pro');

  try {
    pb.authStore.save(token);

    // Validar archivos si existen
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes

    if (data.plan_vacunacion_archivo) {
      if (!allowedTypes.includes(data.plan_vacunacion_archivo.type)) {
        throw new Error('Archivo de plan de vacunación: Tipo no válido. Solo se permiten JPG, PNG o PDF');
      }
      if (data.plan_vacunacion_archivo.size > maxSize) {
        throw new Error('Archivo de plan de vacunación: Tamaño máximo 5MB');
      }
    }

    if (data.plan_desparasitacion_archivo) {
      if (!allowedTypes.includes(data.plan_desparasitacion_archivo.type)) {
        throw new Error('Archivo de plan de desparasitación: Tipo no válido. Solo se permiten JPG, PNG o PDF');
      }
      if (data.plan_desparasitacion_archivo.size > maxSize) {
        throw new Error('Archivo de plan de desparasitación: Tamaño máximo 5MB');
      }
    }

    if (data.protocolo_vigilancia_archivo) {
      if (!allowedTypes.includes(data.protocolo_vigilancia_archivo.type)) {
        throw new Error('Archivo de protocolo de vigilancia: Tipo no válido. Solo se permiten JPG, PNG o PDF');
      }
      if (data.protocolo_vigilancia_archivo.size > maxSize) {
        throw new Error('Archivo de protocolo de vigilancia: Tamaño máximo 5MB');
      }
    }

    if (data.programa_muestreo_archivo) {
      if (!allowedTypes.includes(data.programa_muestreo_archivo.type)) {
        throw new Error('Archivo de programa de muestreo: Tipo no válido. Solo se permiten JPG, PNG o PDF');
      }
      if (data.programa_muestreo_archivo.size > maxSize) {
        throw new Error('Archivo de programa de muestreo: Tamaño máximo 5MB');
      }
    }

    // Preparar FormData para archivos
    const formData = new FormData();
    formData.append('user', userId);
    formData.append('farm', data.farm);
    formData.append('plan_vacunacion', data.plan_vacunacion);
    formData.append('plan_vacunacion_observaciones', data.plan_vacunacion_observaciones);
    formData.append('plan_desparasitacion', data.plan_desparasitacion);
    formData.append('plan_desparasitacion_observaciones', data.plan_desparasitacion_observaciones);
    formData.append('protocolo_vigilancia', data.protocolo_vigilancia);
    formData.append('protocolo_vigilancia_observaciones', data.protocolo_vigilancia_observaciones);
    formData.append('programa_muestreo', data.programa_muestreo);
    formData.append('programa_muestreo_observaciones', data.programa_muestreo_observaciones);

    // Agregar archivos si existen
    // IMPORTANTE: El nombre del campo debe coincidir exactamente con el nombre
    // del campo file definido en la colección 'plan_sanitario' de PocketBase
    if (data.plan_vacunacion_archivo) {
      formData.append('plan_vacunacion_archivo', data.plan_vacunacion_archivo);
    }
    if (data.plan_desparasitacion_archivo) {
      formData.append('plan_desparasitacion_archivo', data.plan_desparasitacion_archivo);
    }
    if (data.protocolo_vigilancia_archivo) {
      formData.append('protocolo_vigilancia_archivo', data.protocolo_vigilancia_archivo);
    }
    if (data.programa_muestreo_archivo) {
      formData.append('programa_muestreo_archivo', data.programa_muestreo_archivo);
    }

    const newPlan = await pb.collection('plan_sanitario').create(formData);

    console.log(`✅ Plan sanitario creado exitosamente: ${newPlan.id}`);
    return {
      success: true,
      data: newPlan as PlanSanitario,
      message: 'Plan sanitario creado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear plan sanitario:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al procesar el plan sanitario en el servidor',
        error,
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al crear plan sanitario',
      error,
    };
  }
}

/**
 * Update - Actualizar un plan sanitario existente
 * PATCH /api/collections/plan_sanitario/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del plan sanitario
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @param data - Datos a actualizar
 * @returns Plan sanitario actualizado
 */
export async function updatePlanSanitario(
  token: string,
  id: string,
  userId: string,
  data: UpdatePlanSanitarioData
) {
  const pb = new PocketBase('https://api.appsphere.pro');

  try {
    pb.authStore.save(token);

    // Verificar que el usuario sea el propietario antes de actualizar
    const record = await pb.collection('plan_sanitario').getOne(id);
    if (record.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    // Validar archivos si existen
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes

    if (data.plan_vacunacion_archivo) {
      if (!allowedTypes.includes(data.plan_vacunacion_archivo.type)) {
        throw new Error('Archivo de plan de vacunación: Tipo no válido. Solo se permiten JPG, PNG o PDF');
      }
      if (data.plan_vacunacion_archivo.size > maxSize) {
        throw new Error('Archivo de plan de vacunación: Tamaño máximo 5MB');
      }
    }

    if (data.plan_desparasitacion_archivo) {
      if (!allowedTypes.includes(data.plan_desparasitacion_archivo.type)) {
        throw new Error('Archivo de plan de desparasitación: Tipo no válido. Solo se permiten JPG, PNG o PDF');
      }
      if (data.plan_desparasitacion_archivo.size > maxSize) {
        throw new Error('Archivo de plan de desparasitación: Tamaño máximo 5MB');
      }
    }

    if (data.protocolo_vigilancia_archivo) {
      if (!allowedTypes.includes(data.protocolo_vigilancia_archivo.type)) {
        throw new Error('Archivo de protocolo de vigilancia: Tipo no válido. Solo se permiten JPG, PNG o PDF');
      }
      if (data.protocolo_vigilancia_archivo.size > maxSize) {
        throw new Error('Archivo de protocolo de vigilancia: Tamaño máximo 5MB');
      }
    }

    if (data.programa_muestreo_archivo) {
      if (!allowedTypes.includes(data.programa_muestreo_archivo.type)) {
        throw new Error('Archivo de programa de muestreo: Tipo no válido. Solo se permiten JPG, PNG o PDF');
      }
      if (data.programa_muestreo_archivo.size > maxSize) {
        throw new Error('Archivo de programa de muestreo: Tamaño máximo 5MB');
      }
    }

    // Preparar FormData para archivos
    const formData = new FormData();
    
    if (data.plan_vacunacion !== undefined) formData.append('plan_vacunacion', data.plan_vacunacion);
    if (data.plan_vacunacion_observaciones !== undefined) formData.append('plan_vacunacion_observaciones', data.plan_vacunacion_observaciones);
    if (data.plan_desparasitacion !== undefined) formData.append('plan_desparasitacion', data.plan_desparasitacion);
    if (data.plan_desparasitacion_observaciones !== undefined) formData.append('plan_desparasitacion_observaciones', data.plan_desparasitacion_observaciones);
    if (data.protocolo_vigilancia !== undefined) formData.append('protocolo_vigilancia', data.protocolo_vigilancia);
    if (data.protocolo_vigilancia_observaciones !== undefined) formData.append('protocolo_vigilancia_observaciones', data.protocolo_vigilancia_observaciones);
    if (data.programa_muestreo !== undefined) formData.append('programa_muestreo', data.programa_muestreo);
    if (data.programa_muestreo_observaciones !== undefined) formData.append('programa_muestreo_observaciones', data.programa_muestreo_observaciones);
    if (data.farm !== undefined) formData.append('farm', data.farm);

    // Agregar archivos si existen
    // IMPORTANTE: El nombre del campo debe coincidir exactamente con el nombre
    // del campo file definido en la colección 'plan_sanitario' de PocketBase
    if (data.plan_vacunacion_archivo) {
      formData.append('plan_vacunacion_archivo', data.plan_vacunacion_archivo);
    }
    if (data.plan_desparasitacion_archivo) {
      formData.append('plan_desparasitacion_archivo', data.plan_desparasitacion_archivo);
    }
    if (data.protocolo_vigilancia_archivo) {
      formData.append('protocolo_vigilancia_archivo', data.protocolo_vigilancia_archivo);
    }
    if (data.programa_muestreo_archivo) {
      formData.append('programa_muestreo_archivo', data.programa_muestreo_archivo);
    }

    const updatedPlan = await pb.collection('plan_sanitario').update(id, formData);

    console.log(`✅ Plan sanitario actualizado exitosamente: ${updatedPlan.id}`);
    return {
      success: true,
      data: updatedPlan as PlanSanitario,
      message: 'Plan sanitario actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar plan sanitario:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al procesar la actualización del plan sanitario en el servidor',
        error,
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al actualizar plan sanitario',
      error,
    };
  }
}

/**
 * Delete - Eliminar un plan sanitario
 * DELETE /api/collections/plan_sanitario/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del plan sanitario a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deletePlanSanitario(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Verificar que el usuario sea el propietario antes de eliminar
    const record = await pb.collection('plan_sanitario').getOne(id);
    if (record.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('plan_sanitario').delete(id);

    console.log(`✅ Plan sanitario eliminado exitosamente`);
    return {
      success: true,
      message: 'Plan sanitario eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar plan sanitario:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar plan sanitario',
      error,
    };
  }
}

/**
 * Buscar planes sanitarios por observaciones
 * GET /api/collections/plan_sanitario/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param searchTerm - Término de búsqueda
 * @param farmId - ID de la granja (opcional para filtrar por granja)
 * @returns Array de planes sanitarios
 */
export async function searchPlanSanitario(
  token: string,
  userId: string,
  searchTerm: string,
  farmId?: string
): Promise<PlanSanitario[] | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `(plan_vacunacion_observaciones ~ "${searchTerm}" || plan_desparasitacion_observaciones ~ "${searchTerm}" || protocolo_vigilancia_observaciones ~ "${searchTerm}" || programa_muestreo_observaciones ~ "${searchTerm}") && user="${userId}"`;
    
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }
    
    const result = await pb.collection('plan_sanitario').getList(1, 50, {
      filter: filter,
      sort: '-created',
      expand: 'farm,user',
    });

    console.log(`✅ Se encontraron ${result.totalItems} plan(es) sanitario(s) que coinciden con "${searchTerm}"`);
    return result.items as PlanSanitario[];
  } catch (error: any) {
    console.error("❌ Error al buscar planes sanitarios:", error.message);
    return null;
  }
}

/**
 * Obtener URL del archivo
 * @param record - Registro de PocketBase
 * @param filename - Nombre del campo de archivo
 * @returns URL completa del archivo
 */
export function getFileUrl(record: any, filename: string): string {
  const pb = new PocketBase('https://api.appsphere.pro');
  return pb.files.getUrl(record, filename);
}
