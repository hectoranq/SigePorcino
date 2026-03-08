import PocketBase from "pocketbase";

const pb = new PocketBase('https://api.appsphere.pro');

// ===========================
// TypeScript Interfaces
// ===========================

export interface PhaseMaterial {
  fase: string;
  tipo_material: string;
  localizacion: string;
  num_puntos_acceso: number;
  animales_activos: number;
  animales_interaccionando: number;
}

export interface PlanBienestarStep4 {
  id?: string;
  user_id: string;
  farm_id: string;
  
  // Fases productivas con datos de material manipulable (stored as JSON array)
  fases_material?: string; // JSON string of PhaseMaterial[]
  
  // Material data
  num_tipos_diferentes?: number;
  consideracion_material?: string; // "optimo" | "mejorable" | "no_apto"
  periodicidad_renovacion?: number; // en semanas
  
  // Metadata
  created?: string;
  updated?: string;
}

// ===========================
// Conversion Functions
// ===========================

function convertToApiFormat(data: PlanBienestarStep4): Record<string, any> {
  return {
    user_id: data.user_id,
    farm_id: data.farm_id,
    fases_material: data.fases_material || "",
    num_tipos_diferentes: data.num_tipos_diferentes || 0,
    consideracion_material: data.consideracion_material || "",
    periodicidad_renovacion: data.periodicidad_renovacion || 0,
  };
}

function convertFromApiFormat(record: any): PlanBienestarStep4 {
  return {
    id: record.id,
    user_id: record.user_id,
    farm_id: record.farm_id,
    fases_material: record.fases_material,
    num_tipos_diferentes: record.num_tipos_diferentes,
    consideracion_material: record.consideracion_material,
    periodicidad_renovacion: record.periodicidad_renovacion,
    created: record.created,
    updated: record.updated,
  };
}

// ===========================
// CRUD Functions
// ===========================

export async function getPlanBienestarStep4ByFarmId(
  token: string,
  userId: string,
  farmId: string
): Promise<{ success: boolean; data?: PlanBienestarStep4; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const records = await pb.collection("plan_bienestar_step4").getList(1, 1, {
      filter: `user_id="${userId}" && farm_id="${farmId}"`,
      sort: "-created",
    });

    if (records.items.length > 0) {
      const plan = convertFromApiFormat(records.items[0]);
      return { success: true, data: plan };
    }
    
    return { success: false, message: "No se encontró el registro" };
  } catch (error: any) {
    console.error("❌ Error getting plan bienestar step 4:", error);
    return { success: false, message: error.message };
  }
}

export async function createPlanBienestarStep4(
  token: string,
  data: PlanBienestarStep4
): Promise<{ success: boolean; data?: PlanBienestarStep4; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const apiData = convertToApiFormat(data);
    const record = await pb.collection("plan_bienestar_step4").create(apiData);
    const plan = convertFromApiFormat(record);
    
    console.log("✅ Plan bienestar step 4 creado exitosamente");
    return { success: true, data: plan, message: "Registro creado exitosamente" };
  } catch (error: any) {
    console.error("❌ Error creating plan bienestar step 4:", error);
    return { success: false, message: error.message };
  }
}

export async function updatePlanBienestarStep4(
  token: string,
  planId: string,
  data: PlanBienestarStep4
): Promise<{ success: boolean; data?: PlanBienestarStep4; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const apiData = convertToApiFormat(data);
    const record = await pb.collection("plan_bienestar_step4").update(planId, apiData);
    const plan = convertFromApiFormat(record);
    
    console.log("✅ Plan bienestar step 4 actualizado exitosamente");
    return { success: true, data: plan, message: "Registro actualizado exitosamente" };
  } catch (error: any) {
    console.error("❌ Error updating plan bienestar step 4:", error);
    return { success: false, message: error.message };
  }
}
