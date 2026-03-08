import PocketBase from "pocketbase";

const pb = new PocketBase('https://api.appsphere.pro');

// ===========================
// TypeScript Interfaces
// ===========================

export interface PhaseEnvironmental {
  fase: string;
  // Temperatura
  sensores_temperatura: boolean;
  sensores_temp_altura_animales: boolean;
  control_temperatura: boolean;
  registro_temperatura: boolean;
  // Humedad
  sensores_humedad: boolean;
  sensores_hum_altura_animales: boolean;
  control_humedad: boolean;
  registro_humedad: boolean;
}

export interface PlanBienestarStep5 {
  id?: string;
  user_id: string;
  farm_id: string;
  
  // Fases productivas con datos ambientales (stored as JSON array)
  fases_ambiental?: string; // JSON string of PhaseEnvironmental[]
  
  // Gases y Ventilación
  gases_indicados?: string;
  gases_registrados?: boolean;
  extractores_ventiladores?: boolean;
  apertura_automatica_ventanas?: boolean;
  apertura_automatica_chimeneas?: boolean;
  cumbreras?: boolean;
  coolings?: boolean;
  nebulizacion?: boolean;
  ventilacion_total_artificial?: boolean;
  calefaccion?: boolean;
  iluminacion?: string;
  
  // Metadata
  created?: string;
  updated?: string;
}

// ===========================
// Conversion Functions
// ===========================

function convertToApiFormat(data: PlanBienestarStep5): Record<string, any> {
  return {
    user_id: data.user_id,
    farm_id: data.farm_id,
    fases_ambiental: data.fases_ambiental || "",
    gases_indicados: data.gases_indicados || "",
    gases_registrados: data.gases_registrados || false,
    extractores_ventiladores: data.extractores_ventiladores || false,
    apertura_automatica_ventanas: data.apertura_automatica_ventanas || false,
    apertura_automatica_chimeneas: data.apertura_automatica_chimeneas || false,
    cumbreras: data.cumbreras || false,
    coolings: data.coolings || false,
    nebulizacion: data.nebulizacion || false,
    ventilacion_total_artificial: data.ventilacion_total_artificial || false,
    calefaccion: data.calefaccion || false,
    iluminacion: data.iluminacion || "",
  };
}

function convertFromApiFormat(record: any): PlanBienestarStep5 {
  return {
    id: record.id,
    user_id: record.user_id,
    farm_id: record.farm_id,
    fases_ambiental: record.fases_ambiental,
    gases_indicados: record.gases_indicados,
    gases_registrados: record.gases_registrados,
    extractores_ventiladores: record.extractores_ventiladores,
    apertura_automatica_ventanas: record.apertura_automatica_ventanas,
    apertura_automatica_chimeneas: record.apertura_automatica_chimeneas,
    cumbreras: record.cumbreras,
    coolings: record.coolings,
    nebulizacion: record.nebulizacion,
    ventilacion_total_artificial: record.ventilacion_total_artificial,
    calefaccion: record.calefaccion,
    iluminacion: record.iluminacion,
    created: record.created,
    updated: record.updated,
  };
}

// ===========================
// CRUD Functions
// ===========================

export async function getPlanBienestarStep5ByFarmId(
  token: string,
  userId: string,
  farmId: string
): Promise<{ success: boolean; data?: PlanBienestarStep5; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const records = await pb.collection("plan_bienestar_step5").getList(1, 1, {
      filter: `user_id="${userId}" && farm_id="${farmId}"`,
      sort: "-created",
    });

    if (records.items.length > 0) {
      const plan = convertFromApiFormat(records.items[0]);
      return { success: true, data: plan };
    }
    
    return { success: false, message: "No se encontró el registro" };
  } catch (error: any) {
    console.error("❌ Error getting plan bienestar step 5:", error);
    return { success: false, message: error.message };
  }
}

export async function createPlanBienestarStep5(
  token: string,
  data: PlanBienestarStep5
): Promise<{ success: boolean; data?: PlanBienestarStep5; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const apiData = convertToApiFormat(data);
    const record = await pb.collection("plan_bienestar_step5").create(apiData);
    const plan = convertFromApiFormat(record);
    
    console.log("✅ Plan bienestar step 5 creado exitosamente");
    return { success: true, data: plan, message: "Registro creado exitosamente" };
  } catch (error: any) {
    console.error("❌ Error creating plan bienestar step 5:", error);
    return { success: false, message: error.message };
  }
}

export async function updatePlanBienestarStep5(
  token: string,
  planId: string,
  data: PlanBienestarStep5
): Promise<{ success: boolean; data?: PlanBienestarStep5; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const apiData = convertToApiFormat(data);
    const record = await pb.collection("plan_bienestar_step5").update(planId, apiData);
    const plan = convertFromApiFormat(record);
    
    console.log("✅ Plan bienestar step 5 actualizado exitosamente");
    return { success: true, data: plan, message: "Registro actualizado exitosamente" };
  } catch (error: any) {
    console.error("❌ Error updating plan bienestar step 5:", error);
    return { success: false, message: error.message };
  }
}
