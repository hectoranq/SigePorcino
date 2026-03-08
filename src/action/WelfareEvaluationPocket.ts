import PocketBase from 'pocketbase';

// Interfaz para Evaluación de Bienestar
export interface WelfareEvaluation {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  farm_name: string;
  owner_name: string;
  rega_code: string;
  evaluation_date: string;
  zootechnical_class: string;
  health_qualification: string;
  integrator: string;
  created?: string;
  updated?: string;
}

export interface CreateWelfareEvaluationData {
  farm: string;
  farm_name: string;
  owner_name: string;
  rega_code: string;
  evaluation_date: string;
  zootechnical_class: string;
  health_qualification: string;
  integrator: string;
}

export interface UpdateWelfareEvaluationData {
  farm_name?: string;
  owner_name?: string;
  rega_code?: string;
  evaluation_date?: string;
  zootechnical_class?: string;
  health_qualification?: string;
  integrator?: string;
}

/**
 * Obtener evaluación por ID de granja
 */
export async function getWelfareEvaluationByFarmId(
  token: string,
  userId: string,
  farmId: string
): Promise<WelfareEvaluation[]> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const result = await pb.collection('welfare_evaluation').getList(1, 50, {
      filter: `farm="${farmId}" && user="${userId}"`,
      sort: '-created',
      expand: 'farm,user',
    });

    console.log(`✅ Se encontraron ${result.totalItems} evaluación(es) para la granja ID: ${farmId}`);
    return result.items as WelfareEvaluation[];
  } catch (error: any) {
    console.error("❌ Error al obtener evaluaciones:", error.message);
    return [];
  }
}

/**
 * Obtener evaluación por ID
 */
export async function getWelfareEvaluationById(
  token: string,
  id: string,
  userId: string
): Promise<WelfareEvaluation | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('welfare_evaluation').getOne(id, {
      expand: 'farm,user',
    });

    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Evaluación obtenida: ${record.id}`);
    return record as WelfareEvaluation;
  } catch (error: any) {
    console.error('❌ Error al obtener evaluación:', error);
    return null;
  }
}

/**
 * Crear evaluación
 */
export async function createWelfareEvaluation(
  token: string,
  userId: string,
  data: CreateWelfareEvaluationData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const evaluationData = {
      ...data,
      user: userId,
    };

    const newEvaluation = await pb.collection('welfare_evaluation').create(evaluationData);

    console.log(`✅ Evaluación creada exitosamente: ${newEvaluation.id}`);
    return {
      success: true,
      data: newEvaluation as WelfareEvaluation,
      message: 'Evaluación creada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear evaluación:', error);
    throw {
      success: false,
      message: error?.message || 'Error al crear evaluación',
      error,
    };
  }
}

/**
 * Actualizar evaluación
 */
export async function updateWelfareEvaluation(
  token: string,
  id: string,
  userId: string,
  data: UpdateWelfareEvaluationData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('welfare_evaluation').getOne(id);
    if (record.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const updatedEvaluation = await pb.collection('welfare_evaluation').update(id, data);

    console.log(`✅ Evaluación actualizada exitosamente: ${updatedEvaluation.id}`);
    return {
      success: true,
      data: updatedEvaluation as WelfareEvaluation,
      message: 'Evaluación actualizada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar evaluación:', error);
    throw {
      success: false,
      message: error?.message || 'Error al actualizar evaluación',
      error,
    };
  }
}

/**
 * Eliminar evaluación
 */
export async function deleteWelfareEvaluation(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('welfare_evaluation').getOne(id);
    if (record.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('welfare_evaluation').delete(id);

    console.log(`✅ Evaluación eliminada exitosamente`);
    return {
      success: true,
      message: 'Evaluación eliminada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar evaluación:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar evaluación',
      error,
    };
  }
}
