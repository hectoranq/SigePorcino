import PocketBase from 'pocketbase';

// Interfaz para Planes de Acción
export interface ActionPlan {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  evaluation_id: string;
  plan_name: string;
  plan_date: string;
  created?: string;
  updated?: string;
}

export interface CreateActionPlanData {
  evaluation_id: string;
  plan_name: string;
  plan_date: string;
}

export interface UpdateActionPlanData {
  plan_name?: string;
  plan_date?: string;
}

/**
 * Obtener plan de acción por evaluación
 */
export async function getActionPlanByEvaluationId(
  token: string,
  evaluationId: string
): Promise<ActionPlan | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const result = await pb.collection('raboteo_action_plans').getList(1, 1, {
      filter: `evaluation_id="${evaluationId}"`,
      expand: 'evaluation_id',
    });

    if (result.totalItems === 0) {
      return null;
    }

    console.log(`✅ Plan de acción encontrado`);
    return result.items[0] as ActionPlan;
  } catch (error: any) {
    console.error("❌ Error al obtener plan de acción:", error.message);
    return null;
  }
}

/**
 * Crear plan de acción
 */
export async function createActionPlan(
  token: string,
  data: CreateActionPlanData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const newPlan = await pb.collection('raboteo_action_plans').create(data);

    console.log(`✅ Plan de acción creado exitosamente: ${newPlan.id}`);
    return {
      success: true,
      data: newPlan as ActionPlan,
      message: 'Plan de acción creado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear plan de acción:', error);
    throw {
      success: false,
      message: error?.message || 'Error al crear plan de acción',
      error,
    };
  }
}

/**
 * Actualizar plan de acción
 */
export async function updateActionPlan(
  token: string,
  id: string,
  data: UpdateActionPlanData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const updatedPlan = await pb.collection('raboteo_action_plans').update(id, data);

    console.log(`✅ Plan de acción actualizado exitosamente: ${updatedPlan.id}`);
    return {
      success: true,
      data: updatedPlan as ActionPlan,
      message: 'Plan de acción actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar plan de acción:', error);
    throw {
      success: false,
      message: error?.message || 'Error al actualizar plan de acción',
      error,
    };
  }
}

/**
 * Eliminar plan de acción
 */
export async function deleteActionPlan(token: string, id: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    await pb.collection('raboteo_action_plans').delete(id);

    console.log(`✅ Plan de acción eliminado exitosamente`);
    return {
      success: true,
      message: 'Plan de acción eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar plan de acción:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar plan de acción',
      error,
    };
  }
}
