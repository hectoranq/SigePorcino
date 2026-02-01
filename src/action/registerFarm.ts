import PocketBase from 'pocketbase';

/**
 * Registrar una nueva granja
 * @param formData - FormData con los datos de la granja
 * @param userId - ID del usuario propietario
 * @param token - (Opcional) Token de autenticación del usuario
 * @returns Registro creado
 */
export async function registerFarm(formData: FormData, userId: string, token?: string) {
  try {
    const REGA = formData.get('REGA') as string;
    const farm_name = formData.get('farm_name') as string;
    const locality = formData.get('locality') as string;
    const province = formData.get('province') as string;
    const address = formData.get('address') as string;
    const groups = formData.get('group') as string;
    const species = formData.get('species') as string;
    const zootechnical_classification = formData.get('zootechnical_classification') as string;
    const health_qualification = formData.get('health_qualification') as string;

    // Validar datos requeridos
    if (!REGA || !farm_name) {
      throw new Error('Faltan campos requeridos: REGA, farm_name');
    }

    if (!locality || !province || !address) {
      throw new Error('Faltan campos requeridos: locality, province, address');
    }

    if (!groups || !species) {
      throw new Error('Faltan campos requeridos: groups, species');
    }

    if (!userId) {
      throw new Error('Falta el ID del usuario');
    }

    const pb = new PocketBase("https://api.appsphere.pro");
    
    // Si hay token, autenticar
    if (token) {
      pb.authStore.save(token);
    }

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
      user: userId,
    });

    console.log(`✅ Granja creada: ${newFarm.farm_name}`);
    return {
      success: true,
      data: newFarm,
      message: 'Granja registrada exitosamente',
    };
  } catch (error: any) {
    console.error('❌ Error al crear granja:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      return {
        success: false,
        message: pbError.message || 'Error al crear granja',
        errors: pbError.data || {},
      };
    }
    
    return {
      success: false,
      message: error?.message || 'Error al crear granja',
      error,
    };
  }
}