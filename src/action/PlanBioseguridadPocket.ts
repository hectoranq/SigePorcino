import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de Plan de Bioseguridad
export interface PlanBioseguridad {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  // Animales y material genético
  proveedores_acreditados: string[];
  inspeccion_entrada: string;
  inspeccion_entrada_obs: string;
  cuarentena: string;
  cuarentena_obs: string;
  consumo_electricidad: string;
  entradas_combustible: string;
  registro_consumo_obs: string;
  limpieza_desinfeccion: string;
  limpieza_desinfeccion_protocolo: string;
  desinsectacion: string;
  desinsectacion_protocolo: string;
  desratizacion: string;
  desratizacion_protocolo: string;
  control_diario_instalaciones: string;
  control_diario_instalaciones_protocolo: string;
  muelle_carga_descarga_obs: string;
  protocolo_manejo_animales: string;
  protocolo_manejo_animales_obs: string;
  utilizacion_material_genetico: string;
  utilizacion_material_genetico_proveedor: string;
  utilizacion_material_genetico_obs: string;
  // Trabajadores y visitantes
  registro_entradas: string;
  registro_entradas_obs: string;
  vestuarios_separacion: string;
  vestuarios_separacion_obs: string;
  ropa_calzado_exclusivo: string;
  ropa_calzado_protocolo: string;
  ropa_calzado_personal: string;
  protocolo_acceso_personas: string;
  protocolo_acceso_personas_texto: string;
  indicaciones_carteleria: string;
  indicaciones_carteleria_obs: string;
  arco_desinfeccion: string;
  vado_sanitario: string;
  mochila: string;
  control_vehiculos_productos: string;
  control_vehiculos_limpieza: string;
  control_vehiculos_obs: string;
  // Alimentación y agua
  descarga_sacos_pienso: string;
  descarga_sacos_proveedores: string[];
  descarga_granel: string;
  descarga_granel_proveedores: string[];
  sistema_suministro_alimentos: string;
  descarga_sacos_descripcion: string;
  descarga_granel_descripcion: string;
  almacenamiento_sacos_descripcion: string;
  almacenamiento_granel_descripcion: string;
  analiticas_agua: string;
  limpieza_tuberias_agua: string;
  control_suministro_agua_obs: string;
  // Instalaciones
  mantenimiento_aislamiento: string;
  mantenimiento_aislamiento_obs: string;
  descripcion_sistema_manejo: string;
  // Servicios auxiliares
  empresas_servicios_auxiliares: string[];
  protocolos_autocontrol: string;
  medidas_correctoras: string;
  // Relaciones
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

// Interfaz para crear un Plan de Bioseguridad
export interface CreatePlanBioseguridadData {
  proveedores_acreditados: string[];
  inspeccion_entrada: string;
  inspeccion_entrada_obs: string;
  cuarentena: string;
  cuarentena_obs: string;
  consumo_electricidad: string;
  entradas_combustible: string;
  registro_consumo_obs: string;
  limpieza_desinfeccion: string;
  limpieza_desinfeccion_protocolo: string;
  desinsectacion: string;
  desinsectacion_protocolo: string;
  desratizacion: string;
  desratizacion_protocolo: string;
  control_diario_instalaciones: string;
  control_diario_instalaciones_protocolo: string;
  muelle_carga_descarga_obs: string;
  protocolo_manejo_animales: string;
  protocolo_manejo_animales_obs: string;
  utilizacion_material_genetico: string;
  utilizacion_material_genetico_proveedor: string;
  utilizacion_material_genetico_obs: string;
  registro_entradas: string;
  registro_entradas_obs: string;
  vestuarios_separacion: string;
  vestuarios_separacion_obs: string;
  ropa_calzado_exclusivo: string;
  ropa_calzado_protocolo: string;
  ropa_calzado_personal: string;
  protocolo_acceso_personas: string;
  protocolo_acceso_personas_texto: string;
  indicaciones_carteleria: string;
  indicaciones_carteleria_obs: string;
  arco_desinfeccion: string;
  vado_sanitario: string;
  mochila: string;
  control_vehiculos_productos: string;
  control_vehiculos_limpieza: string;
  control_vehiculos_obs: string;
  descarga_sacos_pienso: string;
  descarga_sacos_proveedores: string[];
  descarga_granel: string;
  descarga_granel_proveedores: string[];
  sistema_suministro_alimentos: string;
  descarga_sacos_descripcion: string;
  descarga_granel_descripcion: string;
  almacenamiento_sacos_descripcion: string;
  almacenamiento_granel_descripcion: string;
  analiticas_agua: string;
  limpieza_tuberias_agua: string;
  control_suministro_agua_obs: string;
  mantenimiento_aislamiento: string;
  mantenimiento_aislamiento_obs: string;
  descripcion_sistema_manejo: string;
  empresas_servicios_auxiliares: string[];
  protocolos_autocontrol: string;
  medidas_correctoras: string;
  farm: string;
}

// Interfaz para actualizar un Plan de Bioseguridad
export interface UpdatePlanBioseguridadData {
  proveedores_acreditados?: string[];
  inspeccion_entrada?: string;
  inspeccion_entrada_obs?: string;
  cuarentena?: string;
  cuarentena_obs?: string;
  consumo_electricidad?: string;
  entradas_combustible?: string;
  registro_consumo_obs?: string;
  limpieza_desinfeccion?: string;
  limpieza_desinfeccion_protocolo?: string;
  desinsectacion?: string;
  desinsectacion_protocolo?: string;
  desratizacion?: string;
  desratizacion_protocolo?: string;
  control_diario_instalaciones?: string;
  control_diario_instalaciones_protocolo?: string;
  muelle_carga_descarga_obs?: string;
  protocolo_manejo_animales?: string;
  protocolo_manejo_animales_obs?: string;
  utilizacion_material_genetico?: string;
  utilizacion_material_genetico_proveedor?: string;
  utilizacion_material_genetico_obs?: string;
  registro_entradas?: string;
  registro_entradas_obs?: string;
  vestuarios_separacion?: string;
  vestuarios_separacion_obs?: string;
  ropa_calzado_exclusivo?: string;
  ropa_calzado_protocolo?: string;
  ropa_calzado_personal?: string;
  protocolo_acceso_personas?: string;
  protocolo_acceso_personas_texto?: string;
  indicaciones_carteleria?: string;
  indicaciones_carteleria_obs?: string;
  arco_desinfeccion?: string;
  vado_sanitario?: string;
  mochila?: string;
  control_vehiculos_productos?: string;
  control_vehiculos_limpieza?: string;
  control_vehiculos_obs?: string;
  descarga_sacos_pienso?: string;
  descarga_sacos_proveedores?: string[];
  descarga_granel?: string;
  descarga_granel_proveedores?: string[];
  sistema_suministro_alimentos?: string;
  descarga_sacos_descripcion?: string;
  descarga_granel_descripcion?: string;
  almacenamiento_sacos_descripcion?: string;
  almacenamiento_granel_descripcion?: string;
  analiticas_agua?: string;
  limpieza_tuberias_agua?: string;
  control_suministro_agua_obs?: string;
  mantenimiento_aislamiento?: string;
  mantenimiento_aislamiento_obs?: string;
  descripcion_sistema_manejo?: string;
  empresas_servicios_auxiliares?: string[];
  protocolos_autocontrol?: string;
  medidas_correctoras?: string;
  farm?: string;
}

/**
 * List/Search - Obtener todos los planes de bioseguridad
 * GET /api/collections/plan_bioseguridad/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de planes de bioseguridad
 */
export async function listPlanBioseguridad(
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

    const records = await pb.collection('plan_bioseguridad').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user',
    });

    console.log(`✅ Planes de bioseguridad obtenidos: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Planes de bioseguridad obtenidos exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener planes de bioseguridad:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener planes de bioseguridad',
      error,
    };
  }
}

/**
 * View - Obtener un plan de bioseguridad específico por ID
 * GET /api/collections/plan_bioseguridad/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos del plan de bioseguridad
 */
export async function getPlanBioseguridadById(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('plan_bioseguridad').getOne(id, {
      expand: 'farm,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Plan de bioseguridad obtenido: ${record.id}`);
    return {
      success: true,
      data: record as PlanBioseguridad,
      message: 'Plan de bioseguridad obtenido exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al obtener plan de bioseguridad:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener plan de bioseguridad',
      error,
    };
  }
}

/**
 * Buscar planes de bioseguridad por ID de granja
 * GET /api/collections/plan_bioseguridad/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - ID de la granja
 * @returns Array de planes de bioseguridad
 */
export async function getPlanBioseguridadByFarmId(
  token: string,
  userId: string,
  farmId: string
): Promise<PlanBioseguridad[] | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const result = await pb.collection('plan_bioseguridad').getList(1, 50, {
      filter: `farm="${farmId}" && user="${userId}"`,
      sort: '-created',
      expand: 'farm,user',
    });

    if (result.totalItems === 0) {
      console.log(`ℹ️ No se encontraron planes de bioseguridad para la granja ID: ${farmId}`);
      return [];
    }

    console.log(`✅ Se encontraron ${result.totalItems} plan(es) de bioseguridad para la granja ID: ${farmId}`);
    return result.items as PlanBioseguridad[];
  } catch (error: any) {
    console.error("❌ Error al obtener planes de bioseguridad por farmId:", error.message);
    return null;
  }
}

/**
 * Create - Crear un nuevo plan de bioseguridad
 * POST /api/collections/plan_bioseguridad/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param data - Datos del plan de bioseguridad
 * @returns Plan de bioseguridad creado
 */
export async function createPlanBioseguridad(
  token: string,
  userId: string,
  data: CreatePlanBioseguridadData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const planData = {
      ...data,
      user: userId,
    };

    const newPlan = await pb.collection('plan_bioseguridad').create(planData);

    console.log(`✅ Plan de bioseguridad creado exitosamente: ${newPlan.id}`);
    return {
      success: true,
      data: newPlan as PlanBioseguridad,
      message: 'Plan de bioseguridad creado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear plan de bioseguridad:', error);
    throw {
      success: false,
      message: error?.message || 'Error al crear plan de bioseguridad',
      error,
    };
  }
}

/**
 * Update - Actualizar un plan de bioseguridad existente
 * PATCH /api/collections/plan_bioseguridad/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del plan de bioseguridad
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @param data - Datos a actualizar
 * @returns Plan de bioseguridad actualizado
 */
export async function updatePlanBioseguridad(
  token: string,
  id: string,
  userId: string,
  data: UpdatePlanBioseguridadData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Verificar que el usuario sea el propietario antes de actualizar
    const record = await pb.collection('plan_bioseguridad').getOne(id);
    if (record.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const updatedPlan = await pb.collection('plan_bioseguridad').update(id, data);

    console.log(`✅ Plan de bioseguridad actualizado exitosamente: ${updatedPlan.id}`);
    return {
      success: true,
      data: updatedPlan as PlanBioseguridad,
      message: 'Plan de bioseguridad actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar plan de bioseguridad:', error);
    throw {
      success: false,
      message: error?.message || 'Error al actualizar plan de bioseguridad',
      error,
    };
  }
}

/**
 * Delete - Eliminar un plan de bioseguridad
 * DELETE /api/collections/plan_bioseguridad/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del plan de bioseguridad a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deletePlanBioseguridad(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Verificar que el usuario sea el propietario antes de eliminar
    const record = await pb.collection('plan_bioseguridad').getOne(id);
    if (record.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('plan_bioseguridad').delete(id);

    console.log(`✅ Plan de bioseguridad eliminado exitosamente`);
    return {
      success: true,
      message: 'Plan de bioseguridad eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar plan de bioseguridad:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar plan de bioseguridad',
      error,
    };
  }
}

/**
 * Buscar planes de bioseguridad por términos
 * GET /api/collections/plan_bioseguridad/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param searchTerm - Término de búsqueda
 * @param farmId - ID de la granja (opcional para filtrar por granja)
 * @returns Array de planes de bioseguridad
 */
export async function searchPlanBioseguridad(
  token: string,
  userId: string,
  searchTerm: string,
  farmId?: string
): Promise<PlanBioseguridad[] | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `(descripcion_sistema_manejo ~ "${searchTerm}" || protocolos_autocontrol ~ "${searchTerm}" || medidas_correctoras ~ "${searchTerm}") && user="${userId}"`;
    
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }
    
    const result = await pb.collection('plan_bioseguridad').getList(1, 50, {
      filter: filter,
      sort: '-created',
      expand: 'farm,user',
    });

    console.log(`✅ Se encontraron ${result.totalItems} plan(es) de bioseguridad que coinciden con "${searchTerm}"`);
    return result.items as PlanBioseguridad[];
  } catch (error: any) {
    console.error("❌ Error al buscar planes de bioseguridad:", error.message);
    return null;
  }
}
