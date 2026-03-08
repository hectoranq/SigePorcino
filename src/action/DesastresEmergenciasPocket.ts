import PocketBase from "pocketbase";

const pb = new PocketBase('https://api.appsphere.pro');

// ===========================
// TypeScript Interfaces
// ===========================

export interface DisasterEmergencyPlan {
  id?: string;
  user_id: string;
  farm_id: string;
  
  // Section 1: Risk Evaluation
  riesgo_incendio?: boolean;
  riesgo_inundacion?: boolean;
  riesgo_terremoto?: boolean;
  riesgo_fallo_electrico?: boolean;
  riesgo_fallo_agua?: boolean;
  riesgo_enfermedad?: boolean;
  riesgo_otros?: boolean;
  nivel_riesgo?: string; // "bajo" | "medio" | "alto"
  
  // Section 2: Action Protocol
  protocolo_evacuacion?: string;
  plan_comunicacion?: string;
  
  // Section 3: Documentation
  documentos_plan?: string; // File path/URL
  
  // Section 4: Farm Data (readonly, populated from farm)
  farm_name?: string;
  rega_code?: string;
  
  // Metadata
  created?: string;
  updated?: string;
}

export interface EmergencyContact {
  id?: string;
  disaster_plan_id: string;
  nombre: string;
  cargo: string;
  telefono: string;
  email?: string;
  created?: string;
  updated?: string;
}

// ===========================
// Conversion Functions
// ===========================

function convertToApiFormat(data: DisasterEmergencyPlan): Record<string, any> {
  return {
    user_id: data.user_id,
    farm_id: data.farm_id,
    riesgo_incendio: data.riesgo_incendio || false,
    riesgo_inundacion: data.riesgo_inundacion || false,
    riesgo_terremoto: data.riesgo_terremoto || false,
    riesgo_fallo_electrico: data.riesgo_fallo_electrico || false,
    riesgo_fallo_agua: data.riesgo_fallo_agua || false,
    riesgo_enfermedad: data.riesgo_enfermedad || false,
    riesgo_otros: data.riesgo_otros || false,
    nivel_riesgo: data.nivel_riesgo || "",
    protocolo_evacuacion: data.protocolo_evacuacion || "",
    plan_comunicacion: data.plan_comunicacion || "",
    documentos_plan: data.documentos_plan || "",
    farm_name: data.farm_name || "",
    rega_code: data.rega_code || "",
  };
}

function convertFromApiFormat(record: any): DisasterEmergencyPlan {
  return {
    id: record.id,
    user_id: record.user_id,
    farm_id: record.farm_id,
    riesgo_incendio: record.riesgo_incendio,
    riesgo_inundacion: record.riesgo_inundacion,
    riesgo_terremoto: record.riesgo_terremoto,
    riesgo_fallo_electrico: record.riesgo_fallo_electrico,
    riesgo_fallo_agua: record.riesgo_fallo_agua,
    riesgo_enfermedad: record.riesgo_enfermedad,
    riesgo_otros: record.riesgo_otros,
    nivel_riesgo: record.nivel_riesgo,
    protocolo_evacuacion: record.protocolo_evacuacion,
    plan_comunicacion: record.plan_comunicacion,
    documentos_plan: record.documentos_plan,
    farm_name: record.farm_name,
    rega_code: record.rega_code,
    created: record.created,
    updated: record.updated,
  };
}

function convertContactToApiFormat(data: EmergencyContact): Record<string, any> {
  return {
    disaster_plan_id: data.disaster_plan_id,
    nombre: data.nombre || "",
    cargo: data.cargo || "",
    telefono: data.telefono || "",
    email: data.email || "",
  };
}

function convertContactFromApiFormat(record: any): EmergencyContact {
  return {
    id: record.id,
    disaster_plan_id: record.disaster_plan_id,
    nombre: record.nombre,
    cargo: record.cargo,
    telefono: record.telefono,
    email: record.email,
    created: record.created,
    updated: record.updated,
  };
}

// ===========================
// CRUD Functions - Disaster Plans
// ===========================

export async function listDisasterPlans(
  token: string,
  userId: string,
  farmId: string
): Promise<{ success: boolean; data?: DisasterEmergencyPlan[]; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const records = await pb.collection("disaster_emergency_plans").getList(1, 50, {
      filter: `user_id="${userId}" && farm_id="${farmId}"`,
      sort: "-created",
    });

    const plans = records.items.map(convertFromApiFormat);
    return { success: true, data: plans };
  } catch (error: any) {
    console.error("Error listing disaster plans:", error);
    return { success: false, message: error.message };
  }
}

export async function getDisasterPlanById(
  token: string,
  planId: string
): Promise<{ success: boolean; data?: DisasterEmergencyPlan; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const record = await pb.collection("disaster_emergency_plans").getOne(planId);
    const plan = convertFromApiFormat(record);
    
    return { success: true, data: plan };
  } catch (error: any) {
    console.error("Error getting disaster plan:", error);
    return { success: false, message: error.message };
  }
}

export async function createDisasterPlan(
  token: string,
  data: DisasterEmergencyPlan
): Promise<{ success: boolean; data?: DisasterEmergencyPlan; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const apiData = convertToApiFormat(data);
    const record = await pb.collection("disaster_emergency_plans").create(apiData);
    const plan = convertFromApiFormat(record);
    
    return { success: true, data: plan };
  } catch (error: any) {
    console.error("Error creating disaster plan:", error);
    return { success: false, message: error.message };
  }
}

export async function updateDisasterPlan(
  token: string,
  planId: string,
  data: DisasterEmergencyPlan
): Promise<{ success: boolean; data?: DisasterEmergencyPlan; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const apiData = convertToApiFormat(data);
    const record = await pb.collection("disaster_emergency_plans").update(planId, apiData);
    const plan = convertFromApiFormat(record);
    
    return { success: true, data: plan };
  } catch (error: any) {
    console.error("Error updating disaster plan:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteDisasterPlan(
  token: string,
  planId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    pb.authStore.save(token);
    
    await pb.collection("disaster_emergency_plans").delete(planId);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting disaster plan:", error);
    return { success: false, message: error.message };
  }
}

// ===========================
// CRUD Functions - Emergency Contacts
// ===========================

export async function listEmergencyContacts(
  token: string,
  planId: string
): Promise<{ success: boolean; data?: EmergencyContact[]; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const records = await pb.collection("emergency_contacts").getList(1, 50, {
      filter: `disaster_plan_id="${planId}"`,
      sort: "created",
    });

    const contacts = records.items.map(convertContactFromApiFormat);
    return { success: true, data: contacts };
  } catch (error: any) {
    console.error("Error listing emergency contacts:", error);
    return { success: false, message: error.message };
  }
}

export async function createEmergencyContact(
  token: string,
  data: EmergencyContact
): Promise<{ success: boolean; data?: EmergencyContact; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const apiData = convertContactToApiFormat(data);
    const record = await pb.collection("emergency_contacts").create(apiData);
    const contact = convertContactFromApiFormat(record);
    
    return { success: true, data: contact };
  } catch (error: any) {
    console.error("Error creating emergency contact:", error);
    return { success: false, message: error.message };
  }
}

export async function updateEmergencyContact(
  token: string,
  contactId: string,
  data: EmergencyContact
): Promise<{ success: boolean; data?: EmergencyContact; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const apiData = convertContactToApiFormat(data);
    const record = await pb.collection("emergency_contacts").update(contactId, apiData);
    const contact = convertContactFromApiFormat(record);
    
    return { success: true, data: contact };
  } catch (error: any) {
    console.error("Error updating emergency contact:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteEmergencyContact(
  token: string,
  contactId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    pb.authStore.save(token);
    
    await pb.collection("emergency_contacts").delete(contactId);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting emergency contact:", error);
    return { success: false, message: error.message };
  }
}

// ===========================
// File Upload Function
// ===========================

export async function uploadDisasterDocument(
  token: string,
  planId: string,
  file: File
): Promise<{ success: boolean; data?: DisasterEmergencyPlan; message?: string }> {
  try {
    pb.authStore.save(token);
    
    const formData = new FormData();
    formData.append("documentos_plan", file);
    
    const record = await pb.collection("disaster_emergency_plans").update(planId, formData);
    const plan = convertFromApiFormat(record);
    
    return { success: true, data: plan };
  } catch (error: any) {
    console.error("Error uploading document:", error);
    return { success: false, message: error.message };
  }
}
