const PB_URL = "https://api.appsphere.pro";

export interface EnfermedadEntry {
  id?: string;
  risk_factor_id: string;
  nombre: string;
  n_animales_afectados: number;
  en_tratamiento: boolean;
  separacion_afectados: boolean;
  created?: string;
  updated?: string;
}

export interface CreateEnfermedadEntryData {
  risk_factor_id: string;
  nombre: string;
  n_animales_afectados: number;
  en_tratamiento: boolean;
  separacion_afectados: boolean;
}

export interface UpdateEnfermedadEntryData {
  nombre?: string;
  n_animales_afectados?: number;
  en_tratamiento?: boolean;
  separacion_afectados?: boolean;
}

export const getEnfermedadesEntriesByRiskFactorId = async (
  token: string,
  riskFactorId: string
): Promise<EnfermedadEntry[]> => {
  try {
    const response = await fetch(
      `${PB_URL}/api/collections/enfermedades_entries/records?filter=(risk_factor_id='${riskFactorId}')`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener entradas de enfermedades");
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching enfermedades entries:", error);
    throw error;
  }
};

export const createEnfermedadEntry = async (
  token: string,
  data: CreateEnfermedadEntryData
): Promise<EnfermedadEntry> => {
  try {
    const response = await fetch(
      `${PB_URL}/api/collections/enfermedades_entries/records`,
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
      throw new Error("Error al crear entrada de enfermedad");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating enfermedad entry:", error);
    throw error;
  }
};

export const updateEnfermedadEntry = async (
  token: string,
  id: string,
  data: UpdateEnfermedadEntryData
): Promise<EnfermedadEntry> => {
  try {
    const response = await fetch(
      `${PB_URL}/api/collections/enfermedades_entries/records/${id}`,
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
      throw new Error("Error al actualizar entrada de enfermedad");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating enfermedad entry:", error);
    throw error;
  }
};

export const deleteEnfermedadEntry = async (
  token: string,
  id: string
): Promise<void> => {
  try {
    const response = await fetch(
      `${PB_URL}/api/collections/enfermedades_entries/records/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar entrada de enfermedad");
    }
  } catch (error) {
    console.error("Error deleting enfermedad entry:", error);
    throw error;
  }
};

export const deleteEnfermedadesEntriesByRiskFactorId = async (
  token: string,
  riskFactorId: string
): Promise<void> => {
  try {
    const entries = await getEnfermedadesEntriesByRiskFactorId(token, riskFactorId);
    
    for (const entry of entries) {
      if (entry.id) {
        await deleteEnfermedadEntry(token, entry.id);
      }
    }
  } catch (error) {
    console.error("Error deleting enfermedades entries by risk factor:", error);
    throw error;
  }
};
