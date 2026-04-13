const PB_URL = "https://api.appsphere.pro";

export interface LazaretoEntry {
  id?: string;
  risk_factor_id: string;
  fecha_entrada: string;
  lote_edad: string;
  motivo: string;
  cantidad_animales: number;
  created?: string;
  updated?: string;
}

export interface CreateLazaretoEntryData {
  risk_factor_id: string;
  fecha_entrada: string;
  lote_edad: string;
  motivo: string;
  cantidad_animales: number;
}

export interface UpdateLazaretoEntryData {
  fecha_entrada?: string;
  lote_edad?: string;
  motivo?: string;
  cantidad_animales?: number;
}

export const getLazaretoEntriesByRiskFactorId = async (
  token: string,
  riskFactorId: string
): Promise<LazaretoEntry[]> => {
  try {
    const response = await fetch(
      `${PB_URL}/api/collections/lazareto_entries/records?filter=(risk_factor_id='${riskFactorId}')`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener entradas de lazareto");
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching lazareto entries:", error);
    throw error;
  }
};

export const createLazaretoEntry = async (
  token: string,
  data: CreateLazaretoEntryData
): Promise<LazaretoEntry> => {
  try {
    const response = await fetch(
      `${PB_URL}/api/collections/lazareto_entries/records`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Error al crear entrada de lazareto");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating lazareto entry:", error);
    throw error;
  }
};

export const updateLazaretoEntry = async (
  token: string,
  id: string,
  data: UpdateLazaretoEntryData
): Promise<LazaretoEntry> => {
  try {
    const response = await fetch(
      `${PB_URL}/api/collections/lazareto_entries/records/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Error al actualizar entrada de lazareto");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating lazareto entry:", error);
    throw error;
  }
};

export const deleteLazaretoEntry = async (
  token: string,
  id: string
): Promise<void> => {
  try {
    const response = await fetch(
      `${PB_URL}/api/collections/lazareto_entries/records/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar entrada de lazareto");
    }
  } catch (error) {
    console.error("Error deleting lazareto entry:", error);
    throw error;
  }
};

export const deleteLazaretoEntriesByRiskFactorId = async (
  token: string,
  riskFactorId: string
): Promise<void> => {
  try {
    const entries = await getLazaretoEntriesByRiskFactorId(token, riskFactorId);
    
    for (const entry of entries) {
      if (entry.id) {
        await deleteLazaretoEntry(token, entry.id);
      }
    }
  } catch (error) {
    console.error("Error deleting lazareto entries by risk factor:", error);
    throw error;
  }
};
