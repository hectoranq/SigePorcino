import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de Plan de Bienestar Animal
export interface PlanBienestarAnimal {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  // Equipamiento - JSON string que contiene array de equipos
  equipment_json?: string;
  // Eutanasia
  sistema_aturdimiento?: string;
  sistema_matanza?: string;
  persona_encargada_eutanasia?: string; // ID del staff
  // Mutilaciones - Castración
  se_castra?: string; // si/no/no_procede
  separacion_castrados?: string;
  num_animales_presentes?: number;
  se_liman_dientes?: string;
  // Mutilaciones - Raboteo
  registro_mordeduras?: string; // si/no
  fecha_ultima_cria_rabos_integros?: string;
  se_cortan_rabos?: string;
  peticion_cliente?: string;
  tiene_documento_peticion?: string;
  fecha_documento_peticion?: string;
  porcentaje_lesiones_grado_1?: number;
  porcentaje_lesiones_grado_2?: number;
  fecha_registro_lesiones_grado_2?: string;
  fecha_modificacion_condiciones?: string;
  // Relaciones
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

// Interfaz para crear un Plan de Bienestar Animal
export interface CreatePlanBienestarAnimalData {
  equipment_json?: string;
  sistema_aturdimiento?: string;
  sistema_matanza?: string;
  persona_encargada_eutanasia?: string;
  se_castra?: string;
  separacion_castrados?: string;
  num_animales_presentes?: number;
  se_liman_dientes?: string;
  registro_mordeduras?: string;
  fecha_ultima_cria_rabos_integros?: string;
  se_cortan_rabos?: string;
  peticion_cliente?: string;
  tiene_documento_peticion?: string;
  fecha_documento_peticion?: string;
  porcentaje_lesiones_grado_1?: number;
  porcentaje_lesiones_grado_2?: number;
  fecha_registro_lesiones_grado_2?: string;
  fecha_modificacion_condiciones?: string;
  farm: string;
}

// Interfaz para actualizar un Plan de Bienestar Animal
export interface UpdatePlanBienestarAnimalData {
  equipment_json?: string;
  sistema_aturdimiento?: string;
  sistema_matanza?: string;
  persona_encargada_eutanasia?: string;
  se_castra?: string;
  separacion_castrados?: string;
  num_animales_presentes?: number;
  se_liman_dientes?: string;
  registro_mordeduras?: string;
  fecha_ultima_cria_rabos_integros?: string;
  se_cortan_rabos?: string;
  peticion_cliente?: string;
  tiene_documento_peticion?: string;
  fecha_documento_peticion?: string;
  porcentaje_lesiones_grado_1?: number;
  porcentaje_lesiones_grado_2?: number;
  fecha_registro_lesiones_grado_2?: string;
  fecha_modificacion_condiciones?: string;
}

/**
 * Buscar plan de bienestar animal por ID de granja
 * GET /api/collections/plan_bienestar_animal/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - ID de la granja
 * @returns Plan de bienestar animal o null
 */
export async function getPlanBienestarAnimalByFarmId(
  token: string,
  userId: string,
  farmId: string
): Promise<PlanBienestarAnimal | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const result = await pb.collection('plan_bienestar_animal').getList(1, 1, {
      filter: `farm="${farmId}" && user="${userId}"`,
      sort: '-created',
      expand: 'farm,user,persona_encargada_eutanasia',
    });

    if (result.totalItems === 0) {
      console.log(`ℹ️ No se encontró plan de bienestar animal para la granja ID: ${farmId}`);
      return null;
    }

    console.log(`✅ Se encontró plan de bienestar animal para la granja ID: ${farmId}`);
    return result.items[0] as PlanBienestarAnimal;
  } catch (error: any) {
    console.error("❌ Error al obtener plan de bienestar animal por farmId:", error.message);
    return null;
  }
}

/**
 * Create - Crear un nuevo plan de bienestar animal
 * POST /api/collections/plan_bienestar_animal/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param data - Datos del plan de bienestar animal
 * @returns Plan de bienestar animal creado
 */
export async function createPlanBienestarAnimal(
  token: string,
  userId: string,
  data: CreatePlanBienestarAnimalData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const planData = {
      ...data,
      user: userId,
    };

    const newPlan = await pb.collection('plan_bienestar_animal').create(planData);

    console.log(`✅ Plan de bienestar animal creado exitosamente: ${newPlan.id}`);
    return {
      success: true,
      data: newPlan as PlanBienestarAnimal,
      message: 'Plan de bienestar animal creado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear plan de bienestar animal:', error);
    throw {
      success: false,
      message: error?.message || 'Error al crear plan de bienestar animal',
      error,
    };
  }
}

/**
 * Update - Actualizar un plan de bienestar animal existente
 * PATCH /api/collections/plan_bienestar_animal/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del plan de bienestar animal
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @param data - Datos a actualizar
 * @returns Plan de bienestar animal actualizado
 */
export async function updatePlanBienestarAnimal(
  token: string,
  id: string,
  userId: string,
  data: UpdatePlanBienestarAnimalData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Verificar que el usuario sea el propietario antes de actualizar
    const record = await pb.collection('plan_bienestar_animal').getOne(id);
    if (record.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const updatedPlan = await pb.collection('plan_bienestar_animal').update(id, data);

    console.log(`✅ Plan de bienestar animal actualizado exitosamente: ${updatedPlan.id}`);
    return {
      success: true,
      data: updatedPlan as PlanBienestarAnimal,
      message: 'Plan de bienestar animal actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar plan de bienestar animal:', error);
    throw {
      success: false,
      message: error?.message || 'Error al actualizar plan de bienestar animal',
      error,
    };
  }
}

/**
 * Delete - Eliminar un plan de bienestar animal
 * DELETE /api/collections/plan_bienestar_animal/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del plan de bienestar animal a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deletePlanBienestarAnimal(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Verificar que el usuario sea el propietario antes de eliminar
    const record = await pb.collection('plan_bienestar_animal').getOne(id);
    if (record.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('plan_bienestar_animal').delete(id);

    console.log(`✅ Plan de bienestar animal eliminado exitosamente`);
    return {
      success: true,
      message: 'Plan de bienestar animal eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar plan de bienestar animal:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar plan de bienestar animal',
      error,
    };
  }
}
