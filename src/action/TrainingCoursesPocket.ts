import PocketBase from 'pocketbase';

// Interface para tipar la respuesta de TrainingCourse
export interface TrainingCourse {
  collectionId: string;
  collectionName: string;
  id: string;
  nombreCurso: string;
  horasLectivas: number;
  descripcion?: string;
  farm: string; // RELATION_RECORD_ID
  createdBy?: string; // RELATION_RECORD_ID
  created: string;
  updated: string;
}

// Interface para crear un curso
export interface CreateTrainingCourseData {
  nombreCurso: string;
  horasLectivas: number;
  descripcion?: string;
  farm: string;
  createdBy?: string;
}

// Interface para actualizar un curso
export interface UpdateTrainingCourseData {
  nombreCurso?: string;
  horasLectivas?: number;
  descripcion?: string;
  farm?: string;
}

/**
 * Lista cursos de formación con filtros opcionales
 * Regla: @request.auth.id = user.id
 * GET /api/collections/training_courses/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - (Opcional) Filtrar por granja específica
 * @param page - Número de página (default: 1)
 * @param perPage - Elementos por página (default: 50)
 * @returns Lista de cursos de formación
 */
export async function listTrainingCourses(
  token: string,
  userId: string,
  farmId?: string,
  page: number = 1,
  perPage: number = 50
): Promise<{ items: TrainingCourse[]; totalItems: number; totalPages: number } | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Construir filtro
    let filter = `farm="${farmId}"`;

    const result = await pb.collection('training_courses').getList(page, perPage, {
      filter: filter,
      sort: '-created',
    });

    console.log(`✅ Se encontraron ${result.totalItems} curso(s) de formación`);
    return {
      items: result.items as TrainingCourse[],
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    };
  } catch (error: any) {
    console.error("❌ Error al listar cursos de formación:", error.message);
    return null;
  }
}

/**
 * Busca cursos de formación por ID de granja
 * Regla: @request.auth.id = user.id
 * GET /api/collections/training_courses/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param farmId - ID de la granja
 * @returns Array de cursos de formación
 */
export async function getTrainingCoursesByFarmId(
  token: string,
  userId: string,
  farmId: string
): Promise<TrainingCourse[] | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const result = await pb.collection('training_courses').getList(1, 50, {
      filter: `farm="${farmId}" && user="${userId}"`,
      sort: '-created',
    });

    if (result.totalItems === 0) {
      console.log(`ℹ️ No se encontraron cursos para la granja ID: ${farmId}`);
      return [];
    }

    console.log(`✅ Se encontraron ${result.totalItems} curso(s) para la granja ID: ${farmId}`);
    return result.items as TrainingCourse[];
  } catch (error: any) {
    console.error("❌ Error al obtener cursos por farmId:", error.message);
    return null;
  }
}

/**
 * Obtiene un curso de formación específico por ID
 * Regla: @request.auth.id = user.id
 * GET /api/collections/training_courses/records/:id
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param id - ID del curso de formación
 * @returns Curso de formación o null si no existe
 */
export async function getTrainingCourseById(
  token: string,
  userId: string,
  id: string
): Promise<TrainingCourse | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const course = await pb.collection('training_courses').getOne(id);
    
    console.log(`✅ Curso de formación encontrado: ${course.nombreCurso}`);
    return course as TrainingCourse;
  } catch (error: any) {
    console.error("❌ Error al obtener curso de formación:", error.message);
    return null;
  }
}

/**
 * Crea un nuevo curso de formación
 * Regla: @request.auth.id != ""
 * POST /api/collections/training_courses/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param data - Datos del curso de formación
 * @param farmId - (Opcional) ID de la granja
 * @returns Curso de formación creado o null si hay error
 */
export async function createTrainingCourse(
  token: string,
  userId: string,
  data: CreateTrainingCourseData,
  farmId?: string
): Promise<TrainingCourse | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    // Asegurarse de que createdBy siempre tenga el userId
    const courseData = {
      ...data,
      createdBy: userId,
      farm: farmId || data.farm,
    };

    const newCourse = await pb.collection('training_courses').create(courseData);
    
    console.log(`✅ Curso de formación creado exitosamente: ${newCourse.nombreCurso}`);
    return newCourse as TrainingCourse;
  } catch (error: any) {
    console.error("❌ Error al crear curso de formación:", error.message);
    return null;
  }
}

/**
 * Actualiza un curso de formación existente
 * Regla: @request.auth.id = user.id
 * PATCH /api/collections/training_courses/records/:id
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param id - ID del curso de formación
 * @param data - Datos a actualizar
 * @returns Curso de formación actualizado o null si hay error
 */
export async function updateTrainingCourse(
  token: string,
  userId: string,
  id: string,
  data: UpdateTrainingCourseData
): Promise<TrainingCourse | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    const updatedCourse = await pb.collection('training_courses').update(id, data);
    
    console.log(`✅ Curso de formación actualizado exitosamente: ${updatedCourse.nombreCurso}`);
    return updatedCourse as TrainingCourse;
  } catch (error: any) {
    console.error("❌ Error al actualizar curso de formación:", error.message);
    return null;
  }
}

/**
 * Elimina un curso de formación
 * Regla: @request.auth.id = user.id
 * DELETE /api/collections/training_courses/records/:id
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param id - ID del curso de formación a eliminar
 * @returns true si se eliminó correctamente, false si hubo error
 */
export async function deleteTrainingCourse(
  token: string,
  userId: string,
  id: string
): Promise<boolean> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    await pb.collection('training_courses').delete(id);
    
    console.log(`✅ Curso de formación eliminado exitosamente`);
    return true;
  } catch (error: any) {
    console.error("❌ Error al eliminar curso de formación:", error.message);
    return false;
  }
}

/**
 * Busca cursos de formación por nombre
 * Regla: @request.auth.id = user.id
 * GET /api/collections/training_courses/records
 * @param token - Token de autenticación del usuario
 * @param userId - ID del usuario autenticado
 * @param searchTerm - Término de búsqueda
 * @param farmId - ID de la granja (opcional para filtrar por granja)
 * @returns Array de cursos de formación
 */
export async function searchTrainingCourses(
  token: string,
  userId: string,
  searchTerm: string,
  farmId?: string
): Promise<TrainingCourse[] | null> {
  try {
    const pb = new PocketBase('https://api.appsphere.pro');
    pb.authStore.save(token);

    let filter = `nombreCurso ~ "${searchTerm}" && user="${userId}"`;
    
    if (farmId) {
      filter += ` && farm="${farmId}"`;
    }
    
    const result = await pb.collection('training_courses').getList(1, 50, {
      filter: filter,
      sort: '-created',
    });

    console.log(`✅ Se encontraron ${result.totalItems} curso(s) que coinciden con "${searchTerm}"`);
    return result.items as TrainingCourse[];
  } catch (error: any) {
    console.error("❌ Error al buscar cursos de formación:", error.message);
    return null;
  }
}
