'use server';


import PocketBase from 'pocketbase';

export async function registerFarm(formData: FormData, userId: string) {
  const REGA = formData.get('REGA') as string;
  const farm_name = formData.get('farm_name') as string;
  const locality = formData.get('locality') as string;
  const province = formData.get('province') as string;
  const address = formData.get('address') as string;
  const groups = formData.get('group') as string;
  const species = formData.get('species') as string;
  const zootechnical_classification = formData.get('zootechnical_classification') as string;
  const health_qualification = formData.get('health_qualification') as string;

  const pb = new PocketBase("https://api.appsphere.pro");

  // Crea el registro de la granja
  const newFarm = await pb.collection('farms').create({
    REGA,
    farm_name,
    locality,
    province,
    address,
    groups,
    species,
    zootechnical_classification,
    health_qualification,
    user: userId, // Debes pasar el ID del usuario relacionado
  });

  return newFarm;
}