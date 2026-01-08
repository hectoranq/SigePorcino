import PocketBase from 'pocketbase';

// Interfaz para un curso individual
export interface CursoFormacion {
  descripcion: string;
  horasLectivas: string;
}

// Interfaz para el tipo de datos del Plan de Formación
export interface PlanFormacion {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  cursos_formacion: CursoFormacion[]; // Array JSON de cursos
  personal_con_formacion: string; // "si" o "no"
  personal_con_experiencia: string; // "si" o "no"
  personal_con_titulacion: string; // "si" o "no"
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

// Interfaz para crear un Plan de Formación
export interface CreatePlanFormacionData {
  cursos_formacion: CursoFormacion[];
  personal_con_formacion: string;
  personal_con_experiencia: string;
  personal_con_titulacion: string;
  farm: string;
}

// Interfaz para actualizar un Plan de Formación
export interface UpdatePlanFormacionData {
  cursos_formacion?: CursoFormacion[];
  personal_con_formacion?: string;
  personal_con_experiencia?: string;
  personal_con_titulacion?: string;
  farm?: string;
}

/**
 * List/Search - Obtener todos los planes de formación
 * GET /api/collections/plan_formacion/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de planes de formación
 */
export async function listPlanFormacion(
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

    const records = await pb.collection('plan_formacion').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user',
    });

    console.log(`✅ Planes de formación obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Planes de formación obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener planes de formación:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener planes de formación',
      error,
    };
  }
}

/**
 * View - Obtener un plan de formación específico por ID
 * GET /api/collections/plan_formacion/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del plan de formación
 */
export async function getPlanFormacionById(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('plan_formacion').getOne(id, {
      expand: 'farm,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Plan de formación obtenido: ${record.id}`);
    return {
      success: true,
      data: record as PlanFormacion,
      message: 'Plan de formación obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener plan de formación:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener plan de formación',
      error,
    };
  }
}

/**
 * Buscar planes de formación por ID de granja
 * GET /api/collections/plan_formacion/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - ID de la granja
 * @returns Array de planes de formación
 */
export async function getPlanFormacionByFarmId(
  token: string,
  userId: string,
  farmId: string
): Promise<PlanFormacion[] | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const result = await pb.collection('plan_formacion').getList(1, 50, {
      filter: `farm="${farmId}" && user="${userId}"`,
      sort: '-created',
      expand: 'farm,user',
    });

    if (result.totalItems === 0) {
      console.log(`ℹ️ No se encontraron planes de formación para la granja ID: ${farmId}`);
      return [];
    }

    console.log(`✅ Se encontraron ${result.totalItems} plan(es) de formación para la granja ID: ${farmId}`);
    return result.items as PlanFormacion[];
  } catch (error: any) {
    console.error("❌ Error al obtener planes de formación por farmId:", error.message);
    return null;
  }
}

/**
 * Create - Crear un nuevo plan de formación
 * POST /api/collections/plan_formacion/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param data - Datos del plan de formación
 * @returns Plan de formación creado
 */
export async function createPlanFormacion(
  token: string,
  userId: string,
  data: CreatePlanFormacionData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.cursos_formacion || !Array.isArray(data.cursos_formacion) || data.cursos_formacion.length === 0) {
      throw new Error('Debe incluir al menos un curso de formación');
    }

    if (!data.personal_con_formacion || !data.personal_con_experiencia || !data.personal_con_titulacion) {
      throw new Error('Faltan campos requeridos de registro de personal');
    }

    if (!data.farm) {
      throw new Error('Falta relación requerida: farm');
    }

    // Validar que cada curso tenga los campos requeridos
    for (const curso of data.cursos_formacion) {
      if (!curso.descripcion || !curso.horasLectivas) {
        throw new Error('Cada curso debe tener descripción y horas lectivas');
      }
    }

    const newPlan = await pb.collection('plan_formacion').create({
      ...data,
      user: userId,
    });

    console.log(`✅ Plan de formación creado exitosamente: ${newPlan.id}`);
    return {
      success: true,
      data: newPlan as PlanFormacion,
      message: 'Plan de formación creado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear plan de formación:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al procesar el plan de formación en el servidor',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al crear plan de formación',
      error,
    };
  }
}

/**
 * Update - Actualizar un plan de formación existente
 * PATCH /api/collections/plan_formacion/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del plan de formación
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @param data - Datos a actualizar
 * @returns Plan de formación actualizado
 */
export async function updatePlanFormacion(
  token: string,
  id: string,
  userId: string,
  data: UpdatePlanFormacionData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Verificar que el usuario sea el propietario antes de actualizar
    const record = await pb.collection('plan_formacion').getOne(id);
    if (record.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    // Validar cursos si se están actualizando
    if (data.cursos_formacion) {
      if (!Array.isArray(data.cursos_formacion) || data.cursos_formacion.length === 0) {
        throw new Error('Debe incluir al menos un curso de formación');
      }
      
      for (const curso of data.cursos_formacion) {
        if (!curso.descripcion || !curso.horasLectivas) {
          throw new Error('Cada curso debe tener descripción y horas lectivas');
        }
      }
    }

    const updatedPlan = await pb.collection('plan_formacion').update(id, data);

    console.log(`✅ Plan de formación actualizado exitosamente: ${updatedPlan.id}`);
    return {
      success: true,
      data: updatedPlan as PlanFormacion,
      message: 'Plan de formación actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar plan de formación:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al procesar la actualización del plan de formación en el servidor',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al actualizar plan de formación',
      error,
    };
  }
}

/**
 * Delete - Eliminar un plan de formación
 * DELETE /api/collections/plan_formacion/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del plan de formación a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deletePlanFormacion(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Verificar que el usuario sea el propietario antes de eliminar
    const record = await pb.collection('plan_formacion').getOne(id);
    if (record.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('plan_formacion').delete(id);

    console.log(`✅ Plan de formación eliminado exitosamente`);
    return {
      success: true,
      message: 'Plan de formación eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar plan de formación:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar plan de formación',
      error,
    };
  }
}

/**
 * Buscar planes de formación por descripción de curso
 * GET /api/collections/plan_formacion/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param searchTerm - Término de búsqueda
 * @param farmId - ID de la granja (opcional para filtrar por granja)
 * @returns Array de planes de formación
 */
export async function searchPlanFormacion(
  token: string,
  userId: string,
  searchTerm: string,
  farmId?: string
): Promise<PlanFormacion[] | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Nota: La búsqueda en campos JSON puede ser limitada en PocketBase
    // Se puede buscar por campos de texto o usar filtros personalizados
    let filter = `user="${userId}"`;
    
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }
    
    const result = await pb.collection('plan_formacion').getList(1, 50, {
      filter: filter,
      sort: '-created',
      expand: 'farm,user',
    });

    // Filtrar en cliente por descripción de curso si es necesario
    const filtered = result.items.filter((plan: any) => {
      return plan.cursos_formacion?.some((curso: CursoFormacion) => 
        curso.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    console.log(`✅ Se encontraron ${filtered.length} plan(es) de formación que coinciden con "${searchTerm}"`);
    return filtered as PlanFormacion[];
  } catch (error: any) {
    console.error("❌ Error al buscar planes de formación:", error.message);
    return null;
  }
}
