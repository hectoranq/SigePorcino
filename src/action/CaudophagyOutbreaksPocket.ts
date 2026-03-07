import PocketBase from 'pocketbase';

// Interfaz para Brotes de Caudofagia
export interface CaudophagyOutbreak {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  facility_id: string; // ID de la instalación relacionada
  outbreak_phase: string; // Misma fase que la instalación
  outbreak_date: string;
  percentage_animals: number;
  observations: string;
  created?: string;
  updated?: string;
}

export interface CreateCaudophagyOutbreakData {
  facility_id: string;
  outbreak_phase: string;
  outbreak_date: string;
  percentage_animals: number;
  observations: string;
}

export interface UpdateCaudophagyOutbreakData {
  outbreak_phase?: string;
  outbreak_date?: string;
  percentage_animals?: number;
  observations?: string;
}

/**
 * Obtener brotes por instalación
 */
export async function getCaudophagyOutbreaksByFacilityId(
  token: string,
  facilityId: string
): Promise<CaudophagyOutbreak[]> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const result = await pb.collection('caudophagy_outbreaks').getList(1, 4, {
      filter: `facility_id="${facilityId}"`,
      sort: '-outbreak_date',
    });

    console.log(`✅ Se encontraron ${result.totalItems} brote(s)`);
    return result.items as CaudophagyOutbreak[];
  } catch (error: any) {
    console.error("❌ Error al obtener brotes:", error.message);
    return [];
  }
}

/**
 * Crear brote
 */
export async function createCaudophagyOutbreak(
  token: string,
  data: CreateCaudophagyOutbreakData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const newOutbreak = await pb.collection('caudophagy_outbreaks').create(data);

    console.log(`✅ Brote creado exitosamente: ${newOutbreak.id}`);
    return {
      success: true,
      data: newOutbreak as CaudophagyOutbreak,
      message: 'Brote creado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear brote:', error);
    throw {
      success: false,
      message: error?.message || 'Error al crear brote',
      error,
    };
  }
}

/**
 * Actualizar brote
 */
export async function updateCaudophagyOutbreak(
  token: string,
  id: string,
  data: UpdateCaudophagyOutbreakData
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const updatedOutbreak = await pb.collection('caudophagy_outbreaks').update(id, data);

    console.log(`✅ Brote actualizado exitosamente: ${updatedOutbreak.id}`);
    return {
      success: true,
      data: updatedOutbreak as CaudophagyOutbreak,
      message: 'Brote actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al actualizar brote:', error);
    throw {
      success: false,
      message: error?.message || 'Error al actualizar brote',
      error,
    };
  }
}

/**
 * Eliminar brote
 */
export async function deleteCaudophagyOutbreak(token: string, id: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    await pb.collection('caudophagy_outbreaks').delete(id);

    console.log(`✅ Brote eliminado exitosamente`);
    return {
      success: true,
      message: 'Brote eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al eliminar brote:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar brote',
      error,
    };
  }
}
