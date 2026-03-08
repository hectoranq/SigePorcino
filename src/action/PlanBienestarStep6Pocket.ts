import PocketBase from "pocketbase";

const pb = new PocketBase('https://api.appsphere.pro');

// ===========================
// TypeScript Interfaces
// ===========================

export interface PlanBienestarStep6 {
  id?: string;
  user_id: string;
  farm_id: string;
  
  // Plan de Acción
  riesgos_identificados?: string;
  riesgos_inmediatos?: string;
  riesgos_corto_plazo?: string;
  riesgos_medio_plazo?: string;
  riesgos_largo_plazo?: string;
  num_asuntos_tratar?: string;
  personas_responsables?: string;
  indicadores_exito?: string;
  
  // Metadata
  created?: string;
  updated?: string;
}

// ===========================
// Conversion Functions
// ===========================

function convertToApiFormat(data: PlanBienestarStep6): Record<string, any> {
  return {
    user_id: data.user_id,
    farm_id: data.farm_id,
    riesgos_identificados: data.riesgos_identificados || "",
    riesgos_inmediatos: data.riesgos_inmediatos || "",
    riesgos_corto_plazo: data.riesgos_corto_plazo || "",
    riesgos_medio_plazo: data.riesgos_medio_plazo || "",
    riesgos_largo_plazo: data.riesgos_largo_plazo || "",
    num_asuntos_tratar: data.num_asuntos_tratar || "",
    personas_responsables: data.personas_responsables || "",
    indicadores_exito: data.indicadores_exito || "",
  };
}

function convertFromApiFormat(record: any): PlanBienestarStep6 {
  return {
    id: record.id,
    user_id: record.user_id,
    farm_id: record.farm_id,
    riesgos_identificados: record.riesgos_identificados,
    riesgos_inmediatos: record.riesgos_inmediatos,
    riesgos_corto_plazo: record.riesgos_corto_plazo,
    riesgos_medio_plazo: record.riesgos_medio_plazo,
    riesgos_largo_plazo: record.riesgos_largo_plazo,
    num_asuntos_tratar: record.num_asuntos_tratar,
    personas_responsables: record.personas_responsables,
    indicadores_exito: record.indicadores_exito,
    created: record.created,
    updated: record.updated,
  };
}

// ===========================
// CRUD Functions
// ===========================

export async function getPlanBienestarStep6ByFarmId(
  token: string,
  userId: string,
  farmId: string
): Promise<{ success: boolean; data?: PlanBienestarStep6; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const records = await pb.collection("plan_bienestar_step6").getList(1, 1, {
      filter: `user_id="${userId}" && farm_id="${farmId}"`,
      sort: "-created",
    });

    if (records.items.length > 0) {
      const plan = convertFromApiFormat(records.items[0]);
      return { success: true, data: plan };
    }
    
    return { success: false, message: "No se encontró el registro" };
  } catch (error: any) {
    console.error("❌ Error getting plan bienestar step 6:", error);
    return { success: false, message: error.message };
  }
}

export async function createPlanBienestarStep6(
  token: string,
  data: PlanBienestarStep6
): Promise<{ success: boolean; data?: PlanBienestarStep6; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const apiData = convertToApiFormat(data);
    const record = await pb.collection("plan_bienestar_step6").create(apiData);
    const plan = convertFromApiFormat(record);
    
    console.log("✅ Plan bienestar step 6 creado exitosamente");
    return { success: true, data: plan, message: "Registro creado exitosamente" };
  } catch (error: any) {
    console.error("❌ Error creating plan bienestar step 6:", error);
    return { success: false, message: error.message };
  }
}

export async function updatePlanBienestarStep6(
  token: string,
  planId: string,
  data: PlanBienestarStep6
): Promise<{ success: boolean; data?: PlanBienestarStep6; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const apiData = convertToApiFormat(data);
    const record = await pb.collection("plan_bienestar_step6").update(planId, apiData);
    const plan = convertFromApiFormat(record);
    
    console.log("✅ Plan bienestar step 6 actualizado exitosamente");
    return { success: true, data: plan, message: "Registro actualizado exitosamente" };
  } catch (error: any) {
    console.error("❌ Error updating plan bienestar step 6:", error);
    return { success: false, message: error.message };
  }
}
