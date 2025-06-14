import PocketBase from 'pocketbase';

const pb = new PocketBase("https://api.appsphere.pro");
export async function emailExists(email: string): Promise<boolean> {
  try {
    const result = await pb.collection('users').getList(1, 1, {
      filter: `email="${email}"`,
    });
    return result.totalItems > 0;
  } catch (error) {
    console.error("❌ Error al validar email:", error.message);
    return false; // Por seguridad, si hay error, asumimos que no existe
  }
}