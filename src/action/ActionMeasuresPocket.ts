import PocketBase from 'pocketbase';

// Interfaz para Medidas de Acción
export interface ActionMeasure {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  action_plan_id: string;
  measure_category: string; // Enriquecimiento, Inspeccion_Formacion, etc.
  measure_description: string;
  start_date: string;
  end_date: string;
  created?: string;
  updated?: string;
}

export interface CreateActionMeasureData {
  action_plan_id: string;
  measure_category: string;
  measure_description: string;
  start_date: string;
  end_date: string;
}

export interface UpdateActionMeasureData {
  measure_category?: string;
  measure_description?: string;
  start_date?: string;
  end_date?: string;
}

/**
 * Obtener medidas por plan de acción
 */
export async function getActionMeasuresByPlanId(
  token: string,
  planId: string
): Promise<ActionMeasure[]> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const result = await pb.collection('raboteo_action_measures').getList(1, 50, {
      filter: `action_plan_id="${planId}"`,
      sort: 'start_date',
    });

    console.log(`✅ Se encontraron ${result.totalItems} medida(s)`);
    return result.items as ActionMeasure[];
  } catch (error: any) {
    console.error("❌ Error al obtener medidas:", error.message);
    return [];
  }
}

/**
 * Crear medida
 */
export async function createActionMeasure(
  token: string,
  data: CreateActionMeasureData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const newMeasure = await pb.collection('raboteo_action_measures').create(data);

    console.log(`✅ Medida creada exitosamente: ${newMeasure.id}`);
    return {
      success: true,
      data: newMeasure as ActionMeasure,
      message: 'Medida creada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear medida:', error);
    throw {
      success: false,
      message: error?.message || 'Error al crear medida',
      error,
    };
  }
}

/**
 * Actualizar medida
 */
export async function updateActionMeasure(
  token: string,
  id: string,
  data: UpdateActionMeasureData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const updatedMeasure = await pb.collection('raboteo_action_measures').update(id, data);

    console.log(`✅ Medida actualizada exitosamente: ${updatedMeasure.id}`);
    return {
      success: true,
      data: updatedMeasure as ActionMeasure,
      message: 'Medida actualizada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar medida:', error);
    throw {
      success: false,
      message: error?.message || 'Error al actualizar medida',
      error,
    };
  }
}

/**
 * Eliminar medida
 */
export async function deleteActionMeasure(token: string, id: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    await pb.collection('raboteo_action_measures').delete(id);

    console.log(`✅ Medida eliminada exitosamente`);
    return {
      success: true,
      message: 'Medida eliminada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar medida:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar medida',
      error,
    };
  }
}
