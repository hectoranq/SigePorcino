import PocketBase from 'pocketbase';
import useUserStore from '../_store/user';

const pb = new PocketBase("https://api.appsphere.pro");


export async function validateUserPassword(email: string, password: string): Promise<boolean> {
  try {
    const authData = await pb.collection('users').authWithPassword(email, password);
    // Guardar los datos en el store si la autenticación es exitosa
    useUserStore.getState().setUser(authData.record, authData.token);
    return true;
  } catch (error) {
    return false;
  }
}