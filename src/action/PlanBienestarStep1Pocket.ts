import PocketBase from "pocketbase";

const pb = new PocketBase('https://api.appsphere.pro' );

// ===========================
// TypeScript Interfaces
// ===========================

export interface ProductionPhase {
  fase: string;
  num_naves: number;
}

export interface PlanBienestarStep1 {
  id?: string;
  user_id: string;
  farm_id: string;
  
  // Fases productivas (stored as JSON array)
  fases_productivas?: string; // JSON string of ProductionPhase[]
  
  // General data
  orientacion_naves?: string;
  num_animales_presentes?: number;
  aislamiento_cerramientos?: string;
  aislamiento_cubierta?: string;
  densidad_carga?: number;
  tipo_suelo?: string;
  
  // Metadata
  created?: string;
  updated?: string;
}

// ===========================
// Conversion Functions
// ===========================

function convertToApiFormat(data: PlanBienestarStep1): Record<string, any> {
  return {
    user_id: data.user_id,
    farm_id: data.farm_id,
    fases_productivas: data.fases_productivas || "",
    orientacion_naves: data.orientacion_naves || "",
    num_animales_presentes: data.num_animales_presentes || 0,
    aislamiento_cerramientos: data.aislamiento_cerramientos || "",
    aislamiento_cubierta: data.aislamiento_cubierta || "",
    densidad_carga: data.densidad_carga || 0,
    tipo_suelo: data.tipo_suelo || "",
  };
}

function convertFromApiFormat(record: any): PlanBienestarStep1 {
  return {
    id: record.id,
    user_id: record.user_id,
    farm_id: record.farm_id,
    fases_productivas: record.fases_productivas,
    orientacion_naves: record.orientacion_naves,
    num_animales_presentes: record.num_animales_presentes,
    aislamiento_cerramientos: record.aislamiento_cerramientos,
    aislamiento_cubierta: record.aislamiento_cubierta,
    densidad_carga: record.densidad_carga,
    tipo_suelo: record.tipo_suelo,
    created: record.created,
    updated: record.updated,
  };
}

// ===========================
// CRUD Functions
// ===========================

export async function listPlanBienestarStep1(
  token: string,
  userId: string,
  farmId: string
): Promise<{ success: boolean; data?: PlanBienestarStep1[]; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const records = await pb.collection("plan_bienestar_step1").getList(1, 50, {
      filter: `user_id="${userId}" && farm_id="${farmId}"`,
      sort: "-created",
    });

    const plans = records.items.map(convertFromApiFormat);
    return { success: true, data: plans };
  } catch (error: any) {
    console.error("❌ Error listing plan bienestar step 1:", error);
    return { success: false, message: error.message };
  }
}

export async function getPlanBienestarStep1ByFarmId(
  token: string,
  userId: string,
  farmId: string
): Promise<{ success: boolean; data?: PlanBienestarStep1; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const records = await pb.collection("plan_bienestar_step1").getList(1, 1, {
      filter: `user_id="${userId}" && farm_id="${farmId}"`,
      sort: "-created",
    });

    if (records.items.length > 0) {
      const plan = convertFromApiFormat(records.items[0]);
      return { success: true, data: plan };
    }
    
    return { success: false, message: "No se encontró el registro" };
  } catch (error: any) {
    console.error("❌ Error getting plan bienestar step 1:", error);
    return { success: false, message: error.message };
  }
}

export async function createPlanBienestarStep1(
  token: string,
  data: PlanBienestarStep1
): Promise<{ success: boolean; data?: PlanBienestarStep1; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const apiData = convertToApiFormat(data);
    const record = await pb.collection("plan_bienestar_step1").create(apiData);
    const plan = convertFromApiFormat(record);
    
    console.log("✅ Plan bienestar step 1 creado exitosamente");
    return { success: true, data: plan, message: "Registro creado exitosamente" };
  } catch (error: any) {
    console.error("❌ Error creating plan bienestar step 1:", error);
    return { success: false, message: error.message };
  }
}

export async function updatePlanBienestarStep1(
  token: string,
  planId: string,
  data: PlanBienestarStep1
): Promise<{ success: boolean; data?: PlanBienestarStep1; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const apiData = convertToApiFormat(data);
    const record = await pb.collection("plan_bienestar_step1").update(planId, apiData);
    const plan = convertFromApiFormat(record);
    
    console.log("✅ Plan bienestar step 1 actualizado exitosamente");
    return { success: true, data: plan, message: "Registro actualizado exitosamente" };
  } catch (error: any) {
    console.error("❌ Error updating plan bienestar step 1:", error);
    return { success: false, message: error.message };
  }
}

export async function deletePlanBienestarStep1(
  token: string,
  planId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    pb.authStore.save(token);
    
    await pb.collection("plan_bienestar_step1").delete(planId);
    
    console.log("✅ Plan bienestar step 1 eliminado exitosamente");
    return { success: true, message: "Registro eliminado exitosamente" };
  } catch (error: any) {
    console.error("❌ Error deleting plan bienestar step 1:", error);
    return { success: false, message: error.message };
  }
}
