import PocketBase from 'pocketbase';

// Interface para productos utilizados
interface Productos {
  despedac: boolean;
  zotal: boolean;
  ratibromPellet: boolean;
  ratibromCeboFresco: boolean;
  extras?: string[];
}

// Interface para instalaciones
interface Instalaciones {
  paredes: boolean;
  suelos: boolean;
  comederosSilos: boolean;
  extras?: string[];
}

// Interface para aparatos
interface Aparatos {
  maquinasLavado: boolean;
  pulverizadores: boolean;
  desinfectante: boolean;
  extras?: string[];
}

// Interface para archivo
interface Archivo {
  archivoGranja: boolean;
  extras?: string[];
}

// Interface para el tipo de datos de Plan LDD
export interface PlanLDD {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  productos: Productos;
  instalaciones: Instalaciones;
  aparatos: Aparatos;
  trabajador_seleccionado?: string; // RELATION_RECORD_ID
  trabajador_nombre: string;
  descripcion_limpieza: string;
  descripcion_desinsectacion: string;
  descripcion_desratizacion: string;
  instalaciones_periodicidad: string;
  utiliaje_periodicidad: string;
  trabajador_analisis_seleccionado?: string; // RELATION_RECORD_ID
  trabajador_analisis_nombre: string;
  equipos_periodicidad: string;
  utensilios_periodicidad: string;
  archivo: Archivo;
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

// Interface para crear un Plan LDD
export interface CreatePlanLDDData {
  productos: Productos;
  instalaciones: Instalaciones;
  aparatos: Aparatos;
  trabajador_seleccionado?: string;
  trabajador_nombre: string;
  descripcion_limpieza: string;
  descripcion_desinsectacion: string;
  descripcion_desratizacion: string;
  instalaciones_periodicidad: string;
  utiliaje_periodicidad: string;
  trabajador_analisis_seleccionado?: string;
  trabajador_analisis_nombre: string;
  equipos_periodicidad: string;
  utensilios_periodicidad: string;
  archivo: Archivo;
  farm: string;
}

// Interface para actualizar un Plan LDD
export interface UpdatePlanLDDData {
  productos?: Productos;
  instalaciones?: Instalaciones;
  aparatos?: Aparatos;
  trabajador_seleccionado?: string;
  trabajador_nombre?: string;
  descripcion_limpieza?: string;
  descripcion_desinsectacion?: string;
  descripcion_desratizacion?: string;
  instalaciones_periodicidad?: string;
  utiliaje_periodicidad?: string;
  trabajador_analisis_seleccionado?: string;
  trabajador_analisis_nombre?: string;
  equipos_periodicidad?: string;
  utensilios_periodicidad?: string;
  archivo?: Archivo;
  farm?: string;
}

/**
 * List/Search - Obtener todos los planes LDD
 * GET /api/collections/plan_ldd/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de planes LDD
 */
export async function listPlanLDD(
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

    const records = await pb.collection('plan_ldd').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user,trabajador_seleccionado,trabajador_analisis_seleccionado',
    });

    console.log(`✅ Planes LDD obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Planes LDD obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener planes LDD:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener planes LDD',
      error,
    };
  }
}

/**
 * View - Obtener un plan LDD específico por ID
 * GET /api/collections/plan_ldd/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del plan LDD
 */
export async function getPlanLDDById(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('plan_ldd').getOne(id, {
      expand: 'farm,user,trabajador_seleccionado,trabajador_analisis_seleccionado',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Plan LDD obtenido: ${record.id}`);
    return {
      success: true,
      data: record as PlanLDD,
      message: 'Plan LDD obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener plan LDD:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener plan LDD',
      error,
    };
  }
}

/**
 * Buscar planes LDD por ID de granja
 * GET /api/collections/plan_ldd/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - ID de la granja
 * @returns Array de planes LDD
 */
export async function getPlanLDDByFarmId(
  token: string,
  userId: string,
  farmId: string
): Promise<PlanLDD[] | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const result = await pb.collection('plan_ldd').getList(1, 50, {
      filter: `farm="${farmId}" && user="${userId}"`,
      sort: '-created',
      expand: 'farm,user,trabajador_seleccionado,trabajador_analisis_seleccionado',
    });

    if (result.totalItems === 0) {
      console.log(`ℹ️ No se encontraron planes LDD para la granja ID: ${farmId}`);
      return [];
    }

    console.log(`✅ Se encontraron ${result.totalItems} plan(es) LDD para la granja ID: ${farmId}`);
    return result.items as PlanLDD[];
  } catch (error: any) {
    console.error("❌ Error al obtener planes LDD por farmId:", error.message);
    return null;
  }
}

/**
 * Create - Crear un nuevo plan LDD
 * POST /api/collections/plan_ldd/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param data - Datos del plan LDD
 * @returns Plan LDD creado
 */
export async function createPlanLDD(
  token: string,
  userId: string,
  data: CreatePlanLDDData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const planData = {
      ...data,
      user: userId,
    };

    const newPlan = await pb.collection('plan_ldd').create(planData);

    console.log(`✅ Plan LDD creado exitosamente: ${newPlan.id}`);
    return {
      success: true,
      data: newPlan as PlanLDD,
      message: 'Plan LDD creado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear plan LDD:', error);
    throw {
      success: false,
      message: error?.message || 'Error al crear plan LDD',
      error,
    };
  }
}

/**
 * Update - Actualizar un plan LDD existente
 * PATCH /api/collections/plan_ldd/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del plan LDD
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @param data - Datos a actualizar
 * @returns Plan LDD actualizado
 */
export async function updatePlanLDD(
  token: string,
  id: string,
  userId: string,
  data: UpdatePlanLDDData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Verificar que el usuario sea el propietario antes de actualizar
    const record = await pb.collection('plan_ldd').getOne(id);
    if (record.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const updatedPlan = await pb.collection('plan_ldd').update(id, data);

    console.log(`✅ Plan LDD actualizado exitosamente: ${updatedPlan.id}`);
    return {
      success: true,
      data: updatedPlan as PlanLDD,
      message: 'Plan LDD actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar plan LDD:', error);
    throw {
      success: false,
      message: error?.message || 'Error al actualizar plan LDD',
      error,
    };
  }
}

/**
 * Delete - Eliminar un plan LDD
 * DELETE /api/collections/plan_ldd/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del plan LDD a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deletePlanLDD(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Verificar que el usuario sea el propietario antes de eliminar
    const record = await pb.collection('plan_ldd').getOne(id);
    if (record.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('plan_ldd').delete(id);

    console.log(`✅ Plan LDD eliminado exitosamente`);
    return {
      success: true,
      message: 'Plan LDD eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar plan LDD:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar plan LDD',
      error,
    };
  }
}

/**
 * Buscar planes LDD por descripción
 * GET /api/collections/plan_ldd/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param searchTerm - Término de búsqueda
 * @param farmId - ID de la granja (opcional para filtrar por granja)
 * @returns Array de planes LDD
 */
export async function searchPlanLDD(
  token: string,
  userId: string,
  searchTerm: string,
  farmId?: string
): Promise<PlanLDD[] | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `(descripcion_limpieza ~ "${searchTerm}" || descripcion_desinsectacion ~ "${searchTerm}" || descripcion_desratizacion ~ "${searchTerm}") && user="${userId}"`;
    
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }
    
    const result = await pb.collection('plan_ldd').getList(1, 50, {
      filter: filter,
      sort: '-created',
      expand: 'farm,user,trabajador_seleccionado,trabajador_analisis_seleccionado',
    });

    console.log(`✅ Se encontraron ${result.totalItems} plan(es) LDD que coinciden con "${searchTerm}"`);
    return result.items as PlanLDD[];
  } catch (error: any) {
    console.error("❌ Error al buscar planes LDD:", error.message);
    return null;
  }
}
