import PocketBase from 'pocketbase';

const pb = new PocketBase("https://api.appsphere.pro");

// Interface para el resultado de emailExists
export interface EmailExistsResult {
  exists: boolean;
  userId: string | null;
}

/**
 * Verifica si existe un email en la base de datos y retorna su ID
 * @param email - Email a validar
 * @returns Objeto con exists (boolean) y userId (string | null)
 */
export async function emailExists(email: string): Promise<EmailExistsResult> {
  try {
    const result = await pb.collection('users').getList(1, 1, {
      filter: `email="${email}"`,
    });
    
    if (result.totalItems > 0) {
      return {
        exists: true,
        userId: result.items[0].id
      };
    } else {
      return {
        exists: false,
        userId: null
      };
    }
  } catch (error) {
    console.error("❌ Error al validar email:", error.message);
    return {
      exists: false,
      userId: null
    }; // Por seguridad, si hay error, asumimos que no existe
  }
}