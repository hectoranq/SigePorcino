import PocketBase from 'pocketbase';

const pb = new PocketBase("https://api.appsphere.pro");

// Interface para tipar la respuesta de Farm
export interface Farm {
  collectionId: string;
  collectionName: string;
  id: string;
  REGA: string;
  farm_name: string;
  locality: string;
  province: string;
  address: string;
  groups: string;
  species: string;
  zootechnical_classification: string;
  health_qualification: string;
  user: string; // RELATION_RECORD_ID
  created: string;
  updated: string;
}

/**
 * Obtiene las granjas (farms) asociadas a un usuario por su ID
 * @param userId - ID del usuario
 * @returns Array de granjas del usuario o null si no existe el usuario/granjas
 */
export async function getFarmsByUserId(userId: string): Promise<Farm[] | null> {
  try {
    // Buscar las granjas relacionadas con ese usuario
    const farmsResult = await pb.collection('farms').getList(1, 50, {
      filter: `user="${userId}"`,
      sort: '-created', // Ordenar por fecha de creación (más reciente primero)
    });

    if (farmsResult.totalItems === 0) {
      console.log(`ℹ️ No se encontraron granjas para el usuario ID: ${userId}`);
      return null;
    }

    console.log(`✅ Se encontraron ${farmsResult.totalItems} granja(s) para el usuario ID: ${userId}`);
    return farmsResult.items as Farm[];

  } catch (error) {
    console.error("❌ Error al obtener granjas por userId:", error.message);
    return null;
  }
}

/**
 * Obtiene las granjas (farms) asociadas a un usuario por su email
 * @param email - Email del usuario
 * @returns Array de granjas del usuario o null si no existe el usuario
 */
export async function getFarmsByEmail(email: string): Promise<Farm[] | null> {
  try {
    // 1. Primero buscar el usuario por email
    const userResult = await pb.collection('users').getList(1, 1, {
      filter: `email="${email}"`,
    });

    // Si no existe el usuario, retornar null
    if (userResult.totalItems === 0) {
      console.log(`ℹ️ No se encontró usuario con email: ${email}`);
      return null;
    }

    const userId = userResult.items[0].id;

    // 2. Usar el método getFarmsByUserId
    return await getFarmsByUserId(userId);

  } catch (error) {
    console.error("❌ Error al obtener granjas por email:", error.message);
    return null;
  }
}