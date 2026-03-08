import PocketBase from "pocketbase";

const pb = new PocketBase('https://api.appsphere.pro');

// ===========================
// TypeScript Interfaces
// ===========================

export interface PhaseFeeding {
  fase: string;
  alimentacion_ad_libitum: boolean;
  tipo_comedero: string;
  longitud_comedero: string;
  tipo_bebederos: string;
  num_bebederos: string;
}

export interface PlanBienestarStep3 {
  id?: string;
  user_id: string;
  farm_id: string;
  
  // Fases productivas con datos de alimentación (stored as JSON array)
  fases_alimentacion?: string; // JSON string of PhaseFeeding[]
  
  // Feeding data
  alimentacion_racionada?: boolean;
  num_comidas_dia?: number;
  porcentaje_fibra_pienso?: number;
  origen_agua_bebida?: string;
  control_calidad_agua?: boolean;
  
  // Metadata
  created?: string;
  updated?: string;
}

// ===========================
// Conversion Functions
// ===========================

function convertToApiFormat(data: PlanBienestarStep3): Record<string, any> {
  return {
    user_id: data.user_id,
    farm_id: data.farm_id,
    fases_alimentacion: data.fases_alimentacion || "",
    alimentacion_racionada: data.alimentacion_racionada || false,
    num_comidas_dia: data.num_comidas_dia || 0,
    porcentaje_fibra_pienso: data.porcentaje_fibra_pienso || 0,
    origen_agua_bebida: data.origen_agua_bebida || "",
    control_calidad_agua: data.control_calidad_agua || false,
  };
}

function convertFromApiFormat(record: any): PlanBienestarStep3 {
  return {
    id: record.id,
    user_id: record.user_id,
    farm_id: record.farm_id,
    fases_alimentacion: record.fases_alimentacion,
    alimentacion_racionada: record.alimentacion_racionada,
    num_comidas_dia: record.num_comidas_dia,
    porcentaje_fibra_pienso: record.porcentaje_fibra_pienso,
    origen_agua_bebida: record.origen_agua_bebida,
    control_calidad_agua: record.control_calidad_agua,
    created: record.created,
    updated: record.updated,
  };
}

// ===========================
// CRUD Functions
// ===========================

export async function getPlanBienestarStep3ByFarmId(
  token: string,
  userId: string,
  farmId: string
): Promise<{ success: boolean; data?: PlanBienestarStep3; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const records = await pb.collection("plan_bienestar_step3").getList(1, 1, {
      filter: `user_id="${userId}" && farm_id="${farmId}"`,
      sort: "-created",
    });

    if (records.items.length > 0) {
      const plan = convertFromApiFormat(records.items[0]);
      return { success: true, data: plan };
    }
    
    return { success: false, message: "No se encontró el registro" };
  } catch (error: any) {
    console.error("❌ Error getting plan bienestar step 3:", error);
    return { success: false, message: error.message };
  }
}

export async function createPlanBienestarStep3(
  token: string,
  data: PlanBienestarStep3
): Promise<{ success: boolean; data?: PlanBienestarStep3; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const apiData = convertToApiFormat(data);
    const record = await pb.collection("plan_bienestar_step3").create(apiData);
    const plan = convertFromApiFormat(record);
    
    console.log("✅ Plan bienestar step 3 creado exitosamente");
    return { success: true, data: plan, message: "Registro creado exitosamente" };
  } catch (error: any) {
    console.error("❌ Error creating plan bienestar step 3:", error);
    return { success: false, message: error.message };
  }
}

export async function updatePlanBienestarStep3(
  token: string,
  planId: string,
  data: PlanBienestarStep3
): Promise<{ success: boolean; data?: PlanBienestarStep3; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const apiData = convertToApiFormat(data);
    const record = await pb.collection("plan_bienestar_step3").update(planId, apiData);
    const plan = convertFromApiFormat(record);
    
    console.log("✅ Plan bienestar step 3 actualizado exitosamente");
    return { success: true, data: plan, message: "Registro actualizado exitosamente" };
  } catch (error: any) {
    console.error("❌ Error updating plan bienestar step 3:", error);
    return { success: false, message: error.message };
  }
}
