import PocketBase from 'pocketbase';

export async function registerPayment({ user_id, plan_id, file }: {
  user_id: string;
  plan_id: string;
  file: File; // El archivo a subir (por ejemplo, comprobante de pago)
}) {
  const pb = new PocketBase('https://api.appsphere.pro');

  // Creamos un FormData para enviar el archivo y los datos
  const formData = new FormData();
  formData.append('user_id', user_id);
  formData.append('plan_id', plan_id);
  formData.append('file', file); // El campo debe llamarse igual que en la colección de PocketBase

  // Crea el registro en la colección payments
  const record = await pb.collection('payments').create(formData);

  return record;
}