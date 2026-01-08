import PocketBase from 'pocketbase';

// Interfaz para el tipo de datos de empresas vinculadas y gestores
export interface LinkedCompanyManager {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  tipo_persona: 'empresa' | 'persona';
  dni_cif: string;
  nombre: string;
  apellidos?: string;
  direccion: string;
  poblacion: string;
  provincia: string;
  telefono: string;
  email: string;
  fecha_inicio: string; // ISO 8601 date string
  fecha_finalizacion: string; // ISO 8601 date string
  tipo_vinculacion: string[]; // Array de tipos de vinculación seleccionados
  farm: string; // ID de la granja relacionada
  user: string; // ID del usuario propietario
  created?: string;
  updated?: string;
}

/**
 * List/Search - Obtener todas las empresas vinculadas y gestores
 * GET /api/collections/linked_companies_managers/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Registros por página (default: 50)
 * @returns Lista de empresas vinculadas y gestores
 */
export async function listLinkedCompaniesManagers(
  token: string,
  userId: string,
  farmId?: string,
  page: number = 1,
  perPage: number = 50
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Construir filtro
    let filter = `user="${userId}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('linked_companies_managers').getList(page, perPage, {
      filter,
      sort: '-created',
      expand: 'farm,user',
    });

    console.log(`✅ Empresas vinculadas obtenidas: ${records.items.length}`);
    return {
      success: true,
      data: records,
      message: 'Empresas vinculadas obtenidas exitosamente',
    };
  } catch (error) {
    console.error('❌ Error al obtener empresas vinculadas:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener empresas vinculadas',
      error,
    };
  }
}

/**
 * View - Obtener una empresa vinculada o gestor específico por ID
 * GET /api/collections/linked_companies_managers/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Datos de la empresa vinculada o gestor
 */
export async function getLinkedCompanyManager(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const record = await pb.collection('linked_companies_managers').getOne(id, {
      expand: 'farm,user',
    });

    // Validar que el usuario sea el propietario
    if (record.user !== userId) {
      throw new Error('No tienes permisos para ver este registro');
    }

    console.log(`✅ Empresa vinculada obtenida: ${record.nombre}`);
    return {
      success: true,
      data: record,
      message: 'Empresa vinculada obtenida exitosamente',
    };
  } catch (error) {
    console.error('❌ Error al obtener empresa vinculada:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener empresa vinculada',
      error,
    };
  }
}

/**
 * Create - Crear una nueva empresa vinculada o gestor
 * POST /api/collections/linked_companies_managers/records
 * @param token - Token de autenticación del usuario
 * @param data - Datos de la empresa vinculada o gestor
 * @returns Registro creado
 */
export async function createLinkedCompanyManager(token: string, data: Omit<LinkedCompanyManager, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>) {
  try {
    debugger;
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Validar datos requeridos
    if (!data.tipo_persona || !data.dni_cif || !data.nombre) {
      throw new Error('Faltan campos requeridos: tipo_persona, dni_cif, nombre');
    }

    if (!data.user || !data.farm) {
      throw new Error('Faltan relaciones requeridas: user, farm');
    }

    // Asegurar que tipo_vinculacion sea un array
    if (!Array.isArray(data.tipo_vinculacion)) {
      data.tipo_vinculacion = [];
    }

    const record = await pb.collection('linked_companies_managers').create(data);

    console.log(`✅ Empresa vinculada creada: ${record.nombre}`);
    return {
      success: true,
      data: record,
      message: 'Empresa vinculada creada exitosamente',
    };
  } catch (error) {
    console.error('❌ Error al crear empresa vinculada:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al crear empresa vinculada',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al crear empresa vinculada',
      error,
    };
  }
}

/**
 * Update - Actualizar una empresa vinculada o gestor existente
 * PATCH /api/collections/linked_companies_managers/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a actualizar
 * @param data - Datos a actualizar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Registro actualizado
 */
export async function updateLinkedCompanyManager(
  token: string,
  id: string,
  data: Partial<Omit<LinkedCompanyManager, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>>,
  userId: string
) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('linked_companies_managers').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para actualizar este registro');
    }

    const record = await pb.collection('linked_companies_managers').update(id, data);

    console.log(`✅ Empresa vinculada actualizada: ${record.nombre}`);
    return {
      success: true,
      data: record,
      message: 'Empresa vinculada actualizada exitosamente',
    };
  } catch (error) {
    console.error('❌ Error al actualizar empresa vinculada:', error);
    
    // Manejar errores específicos de PocketBase
    if (error?.response?.data) {
      const pbError = error.response.data;
      throw {
        success: false,
        message: pbError.message || 'Error al actualizar empresa vinculada',
        errors: pbError.data || {},
      };
    }
    
    throw {
      success: false,
      message: error?.message || 'Error al actualizar empresa vinculada',
      error,
    };
  }
}

/**
 * Delete - Eliminar una empresa vinculada o gestor
 * DELETE /api/collections/linked_companies_managers/records/:id
 * @param token - Token de autenticación del usuario
 * @param id - ID del registro a eliminar
 * @param userId - ID del usuario autenticado (para validar permisos)
 * @returns Confirmación de eliminación
 */
export async function deleteLinkedCompanyManager(token: string, id: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Primero verificar que el usuario sea el propietario
    const existingRecord = await pb.collection('linked_companies_managers').getOne(id);
    
    if (existingRecord.user !== userId) {
      throw new Error('No tienes permisos para eliminar este registro');
    }

    await pb.collection('linked_companies_managers').delete(id);

    console.log(`✅ Empresa vinculada eliminada: ${id}`);
    return {
      success: true,
      message: 'Empresa vinculada eliminada exitosamente',
    };
  } catch (error) {
    console.error('❌ Error al eliminar empresa vinculada:', error);
    throw {
      success: false,
      message: error?.message || 'Error al eliminar empresa vinculada',
      error,
    };
  }
}

/**
 * Funciones auxiliares
 */

/**
 * Buscar empresas vinculadas por DNI/CIF
 */
export async function searchByDniCif(token: string, dniCif: string, userId: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const records = await pb.collection('linked_companies_managers').getList(1, 50, {
      filter: `user="${userId}" && dni_cif~"${dniCif}"`,
      expand: 'farm,user',
    });

    return {
      success: true,
      data: records,
      message: 'Búsqueda completada',
    };
  } catch (error) {
    console.error('❌ Error en búsqueda:', error);
    throw {
      success: false,
      message: error?.message || 'Error en la búsqueda',
      error,
    };
  }
}

/**
 * Obtener empresas vinculadas por tipo de vinculación
 */
export async function getByTipoVinculacion(token: string, tipoVinculacion: string, userId: string, farmId?: string) {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `user="${userId}" && tipo_vinculacion~"${tipoVinculacion}"`;
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }

    const records = await pb.collection('linked_companies_managers').getList(1, 50, {
      filter,
      expand: 'farm,user',
    });

    return {
      success: true,
      data: records,
      message: 'Registros obtenidos exitosamente',
    };
  } catch (error) {
    console.error('❌ Error al obtener por tipo de vinculación:', error);
    throw {
      success: false,
      message: error?.message || 'Error al obtener registros',
      error,
    };
  }
}

export default {
  listLinkedCompaniesManagers,
  getLinkedCompanyManager,
  createLinkedCompanyManager,
  updateLinkedCompanyManager,
  deleteLinkedCompanyManager,
  searchByDniCif,
  getByTipoVinculacion,
};
