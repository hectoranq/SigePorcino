import PocketBase from "pocketbase";

const pb = new PocketBase('https://api.appsphere.pro');

// ===========================
// TypeScript Interfaces
// ===========================

export interface PhaseManagement {
  fase: string;
  num_inspecciones_dia: number;
  num_inspecciones_equipamiento_dia: number;
}

export interface PlanBienestarStep2 {
  id?: string;
  user_id: string;
  farm_id: string;
  
  // Fases productivas con datos de manejo (stored as JSON array)
  fases_manejo?: string; // JSON string of PhaseManagement[]
  
  // Management data
  frecuencia_limpieza?: string;
  num_trabajadores?: number;
  trabajadores_formacion_bienestar?: number;
  separacion_tamanos?: boolean;
  separacion_enfermos_heridos?: boolean;
  separacion_otros?: string;
  
  // Metadata
  created?: string;
  updated?: string;
}

// ===========================
// Conversion Functions
// ===========================

function convertToApiFormat(data: PlanBienestarStep2): Record<string, any> {
  return {
    user_id: data.user_id,
    farm_id: data.farm_id,
    fases_manejo: data.fases_manejo || "",
    frecuencia_limpieza: data.frecuencia_limpieza || "",
    num_trabajadores: data.num_trabajadores || 0,
    trabajadores_formacion_bienestar: data.trabajadores_formacion_bienestar || 0,
    separacion_tamanos: data.separacion_tamanos || false,
    separacion_enfermos_heridos: data.separacion_enfermos_heridos || false,
    separacion_otros: data.separacion_otros || "",
  };
}

function convertFromApiFormat(record: any): PlanBienestarStep2 {
  return {
    id: record.id,
    user_id: record.user_id,
    farm_id: record.farm_id,
    fases_manejo: record.fases_manejo,
    frecuencia_limpieza: record.frecuencia_limpieza,
    num_trabajadores: record.num_trabajadores,
    trabajadores_formacion_bienestar: record.trabajadores_formacion_bienestar,
    separacion_tamanos: record.separacion_tamanos,
    separacion_enfermos_heridos: record.separacion_enfermos_heridos,
    separacion_otros: record.separacion_otros,
    created: record.created,
    updated: record.updated,
  };
}

// ===========================
// CRUD Functions
// ===========================

export async function getPlanBienestarStep2ByFarmId(
  token: string,
  userId: string,
  farmId: string
): Promise<{ success: boolean; data?: PlanBienestarStep2; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const records = await pb.collection("plan_bienestar_step2").getList(1, 1, {
      filter: `user_id="${userId}" && farm_id="${farmId}"`,
      sort: "-created",
    });

    if (records.items.length > 0) {
      const plan = convertFromApiFormat(records.items[0]);
      return { success: true, data: plan };
    }
    
    return { success: false, message: "No se encontró el registro" };
  } catch (error: any) {
    console.error("❌ Error getting plan bienestar step 2:", error);
    return { success: false, message: error.message };
  }
}

export async function createPlanBienestarStep2(
  token: string,
  data: PlanBienestarStep2
): Promise<{ success: boolean; data?: PlanBienestarStep2; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const apiData = convertToApiFormat(data);
    const record = await pb.collection("plan_bienestar_step2").create(apiData);
    const plan = convertFromApiFormat(record);
    
    console.log("✅ Plan bienestar step 2 creado exitosamente");
    return { success: true, data: plan, message: "Registro creado exitosamente" };
  } catch (error: any) {
    console.error("❌ Error creating plan bienestar step 2:", error);
    return { success: false, message: error.message };
  }
}

export async function updatePlanBienestarStep2(
  token: string,
  planId: string,
  data: PlanBienestarStep2
): Promise<{ success: boolean; data?: PlanBienestarStep2; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const apiData = convertToApiFormat(data);
    const record = await pb.collection("plan_bienestar_step2").update(planId, apiData);
    const plan = convertFromApiFormat(record);
    
    console.log("✅ Plan bienestar step 2 actualizado exitosamente");
    return { success: true, data: plan, message: "Registro actualizado exitosamente" };
  } catch (error: any) {
    console.error("❌ Error updating plan bienestar step 2:", error);
    return { success: false, message: error.message };
  }
}
