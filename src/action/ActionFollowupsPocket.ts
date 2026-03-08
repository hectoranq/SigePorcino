import PocketBase from 'pocketbase';

// Interfaz para Seguimiento de Medidas
export interface ActionFollowup {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  measure_id: string;
  followup_date: string;
  start_date: string;
  end_date: string;
  implementation_difficulties: string;
  corrective_actions: string;
  implementation_result: string;
  improvement_proposal: string;
  observations: string;
  created?: string;
  updated?: string;
}

export interface CreateActionFollowupData {
  measure_id: string;
  followup_date: string;
  start_date: string;
  end_date: string;
  implementation_difficulties: string;
  corrective_actions: string;
  implementation_result: string;
  improvement_proposal: string;
  observations: string;
}

export interface UpdateActionFollowupData {
  followup_date?: string;
  start_date?: string;
  end_date?: string;
  implementation_difficulties?: string;
  corrective_actions?: string;
  implementation_result?: string;
  improvement_proposal?: string;
  observations?: string;
}

/**
 * Obtener seguimientos por medida
 */
export async function getActionFollowupsByMeasureId(
  token: string,
  measureId: string
): Promise<ActionFollowup[]> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const result = await pb.collection('raboteo_action_followups').getList(1, 50, {
      filter: `measure_id="${measureId}"`,
      sort: '-followup_date',
    });

    console.log(`✅ Se encontraron ${result.totalItems} seguimiento(s)`);
    return result.items as ActionFollowup[];
  } catch (error: any) {
    console.error("❌ Error al obtener seguimientos:", error.message);
    return [];
  }
}

/**
 * Crear seguimiento
 */
export async function createActionFollowup(
  token: string,
  data: CreateActionFollowupData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const newFollowup = await pb.collection('raboteo_action_followups').create(data);

    console.log(`✅ Seguimiento creado exitosamente: ${newFollowup.id}`);
    return {
      success: true,
      data: newFollowup as ActionFollowup,
      message: 'Seguimiento creado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear seguimiento:', error);
    throw {
      success: false,
      message: error?.message || 'Error al crear seguimiento',
      error,
    };
  }
}

/**
 * Actualizar seguimiento
 */
export async function updateActionFollowup(
  token: string,
  id: string,
  data: UpdateActionFollowupData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const updatedFollowup = await pb.collection('raboteo_action_followups').update(id, data);

    console.log(`✅ Seguimiento actualizado exitosamente: ${updatedFollowup.id}`);
    return {
      success: true,
      data: updatedFollowup as ActionFollowup,
      message: 'Seguimiento actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar seguimiento:', error);
    throw {
      success: false,
      message: error?.message || 'Error al actualizar seguimiento',
      error,
    };
  }
}

/**
 * Eliminar seguimiento
 */
export async function deleteActionFollowup(token: string, id: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    await pb.collection('raboteo_action_followups').delete(id);

    console.log(`✅ Seguimiento eliminado exitosamente`);
    return {
      success: true,
      message: 'Seguimiento eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar seguimiento:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar seguimiento',
      error,
    };
  }
}
