import axios from 'axios';
import Plan, { PlanData } from '../models/plans';
import useFarmFormStore from '../_store/farm'; // Asegúrate de que la ruta sea correcta


const api = axios.create({
  baseURL: 'https://api.appsphere.pro/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ParameterRecord {
  id: string;
  value: string;
  type: string;
  parent?: string;
  [key: string]: string | number | undefined; // Si tienes más campos opcionales
}


export const fetchParameters = async () => {
  try {
    const response = await api.get('/collections/parameters/records', {
      params: {
        page: 1,
        perPage: 500,
        skipTotal: 1,
        sort: 'sort_order',
        expand: 'parent',
      },
    });
    const records = response.data.items as ParameterRecord[];

    // Separar países y ciudades
    const countries = records.filter((r) => r.type === 'province');
    console.log(`🌍 Total de países encontrados: ${countries.length}`);
    const cities = records.filter((r) => r.type === 'locality');
    console.log(`🏙️ Total de ciudades encontradas: ${cities.length}`);

    // Agrupar las ciudades por ID de país
    const citiesByCountry: Record<string, ParameterRecord[]> = {};
    for (const city of cities) {
      const parentId = city.parent;
      if (!parentId) continue;

      if (!citiesByCountry[parentId]) {
        citiesByCountry[parentId] = [];
      }
      citiesByCountry[parentId].push(city);
    }

    // Construir objeto final
    const data = countries.map((country) => ({
      country: {
        value: country.id,
        label: country.value
      },
      cities: (citiesByCountry[country.id] || []).map((city) => ({
        value: city.id,
        label: city.value
      }))
    }));

    console.log("✅ Resultado:", data);
    return data;
  } catch (error) {
    console.error('Error al obtener los parámetros:', error);
    throw error;
  }
};

export const emailExistsValidate = async (email: string): Promise<boolean> => {
  try {
    const response = await api.get('/collections/users/records', {
      params: {
        page: 1,
        perPage: 1,
        filter: `email="${email}"`,
      },
    });
      console.log(`🌍 Total de países encontrados: ${response}`);
    // PocketBase responde con { items: [...], totalItems: N }
    return response.data.totalItems > 0;
  } catch (error) {
    console.error("❌ Error al validar email:", error.message);
    return false;
  }
};


export const fetchPlans = async (): Promise<Plan[]> => {
  try {
    const response = await api.get<{ items: PlanData[] }>('/collections/plans/records');
    const { items } = response.data;
      return items.map((item) => new Plan(item));
  } catch (error) {
    console.error('Error al obtener los planes:', error);
    throw error;
  }
};

export const registerPersonData = async (formData: FormData) => {
  // Extraer los campos del FormData
  const dni = formData.get('dni') as string;
  const name = formData.get('name') as string;
  const surname = formData.get('surname') as string;
  const locality = formData.get('locality') as string;
  const province = formData.get('province') as string;
  const address = formData.get('address') as string;
  const postal_code = formData.get('postal_code') as string;
  const phone_code = formData.get('phone_code') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const passwordConfirm = formData.get('passwordConfirm') as string;
  const accept_terms = formData.get('accept_terms') === 'true';

  try {
    const response = await api.post('/collections/users/records', {
      password,
      passwordConfirm,
      email,
      emailVisibility: true,
      type_user: "person",
      dni,
      first_name: name,
      last_name: surname,
      province,
      locality,
      address,
      postal_code,
      phone_number: phone_code,
      accept_terms,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const errorDetails = error?.response?.data?.data || null;
    let message = error?.response?.data?.message || 'Error al registrar la persona';

    // Si hay detalles de error, busca el primer mensaje específico
    if (errorDetails && typeof errorDetails === 'object') {
      for (const key in errorDetails) {
        if (errorDetails[key]?.message) {
          message = errorDetails[key].message as string;
          break;
        }
      }
    }

    return {
      success: false,
      message,
      errors: errorDetails,
    };
  }
};

export const registerCompanyData = async (formData: FormData) => {
  // Extraer los campos del FormData
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const companyName = formData.get('company_name') as string;
  const cif = formData.get('cif') as string;
  const province = formData.get('province') as string;
  const locality = formData.get('locality') as string;
  const address = formData.get('address') as string;
  const postalCode = formData.get('postal_code') as string;
  const phoneNumber = formData.get('phone_number') as string;
  const acceptTerms = formData.get('accept_terms') === 'true';

  try {
    const response = await api.post('/collections/users/records', {
      email,
      password,
      passwordConfirm: password,
      type_user: 'company',
      company_name: companyName,
      cif,
      province,
      locality,
      address,
      postal_code: postalCode,
      phone_number: phoneNumber,
      accept_terms: acceptTerms,
      emailVisibility: true,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const errorDetails = error?.response?.data?.data || null;
    let message = error?.response?.data?.message || 'Error al registrar la empresa';

    // Si hay detalles de error, busca el primer mensaje específico
    if (errorDetails && typeof errorDetails === 'object') {
      for (const key in errorDetails) {
        if (errorDetails[key]?.message) {
          message = errorDetails[key].message as string;
          break;
        }
      }
    }

    return {
      success: false,
      message,
      errors: errorDetails,
    };
  }
};

export const saveFarm = async (data) => {
  try {
    const response = await api.post('/collections/farms/records', data);
    return response.data;
  } catch (error) {
    console.error('Error al guardar la granja:', error);
    throw error;
  }
};

export const saveRega = async (data) => {
  try {
    const response = await api.post('/collections/rega/records', data);
    return response.data;
  } catch (error) {
    console.error('Error al guardar el REGA:', error);
    throw error;
  }
};

export const postPaymentRecord = async (data) => {
  try {
    const response = await api.post('/collections/payments/records', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al hacer guardar los planes:', error);
    throw error;
  }
};

export const login = async (data) => {
  try {
    const response = await api.post('/collections/users/auth-with-password', data, {
    });
    return response.data;
  } catch (error) {
    console.error('Error al autenticar usuario:', error);
    throw new Error('Autenticación fallida');
  }
};


export const parametersGroupsAndSpeciesGrouped = async () => {
  try {
    const response = await api.get('/collections/parameters/records', {
      params: {
        page: 1,
        perPage: 500,
        sort: 'sort_order',
      },
    });
    const records = response.data.items as ParameterRecord[];

    // Filtrar groups y species
    const groups = records.filter((r: ParameterRecord) => r.type === 'groups');
    console.log(`🌍 Total de groups encontrados: ${groups.length}`);
    const species = records.filter((r: ParameterRecord) => r.type === 'species');
    console.log(`🌍 Total de species encontrados: ${species.length}`);

    // Agrupar species por ID de group (parent)
    const speciesByGroup: Record<string, ParameterRecord[]> = {};
    for (const specie of species) {
      const parentId = specie.parent;
      if (!parentId) continue;

      if (!speciesByGroup[parentId]) {
        speciesByGroup[parentId] = [];
      }
      speciesByGroup[parentId].push(specie);
    }

    // Construir objeto final
    const data = groups.map((group: ParameterRecord) => ({
      group: {
        value: group.id,
        label: group.value
      },
      species: (speciesByGroup[group.id] || []).map((specie: ParameterRecord) => ({
        value: specie.id,
        label: specie.value
      }))
    }));

    console.log("✅ Resultado agrupado groups-species:", data);
    return data;
  } catch (error) {
    console.error("❌ Error:", error.message);
    return [];
  }
};

export interface FarmDetails {
  collectionId: string;
  collectionName: string;
  id: string;
  anio_construccion: number;
  anio_renovacion: number;
  superficie_autorizada: number;
  superficie_util: number;
  capacidad_autorizada: number;
  observaciones_superficie: string;
  orientacion_naves: string;
  delimitacion_perimetral: string;
  observaciones_delimitacion: string;
  tipo_aislamiento: string;
  numero_trabajadores: number;
  suelo_hormigon: boolean;
  suelo_metalico: boolean;
  suelo_plastico: boolean;
  empanillado_hormigon: boolean;
  empanillado_metalico: boolean;
  empanillado_plastico: boolean;
  luxometro: string;
  termometro: string;
  medidores_gases: string;
  sonometro: string;
  higrometro: string;
  rampa_carga_descarga: string;
  desplazamiento_tableros: boolean;
  desplazamiento_puertas: boolean;
  sistema_eliminacion_cadaveres: string;
  otros_carro_contenedor: boolean;
  frams: string;
  created: string;
  updated: string;
}

export const fetchFarmDetails = async (id: string, token: string): Promise<FarmDetails | undefined> => {
  try {
    console.log("TOKEN:", token);
    console.log("ID:", id);

    const filter = encodeURIComponent(`frams="${id}"`);

    const response = await api.get<{ items: FarmDetails[] }>(`/collections/farm_details/records?filter=${filter}`);
    console.log(`🌍 Total de detalles de granja encontrados: ${response.data.items.length}`);
    return response.data.items[0];
  } catch (error) {
    console.error('Error al obtener los detalles de la granja:', error);
    throw error;
  }
};

export interface FarmRecord {
  collectionId: string;
  collectionName: string;
  id: string;
  REGA: string;
  farm_name: string;
  locality: string;
  province: string;
  address: string;
  groups: string;
  species: string;
  zootechnical_classification: string;
  health_qualification: string;
  user: string;
  created: string;
  updated: string;
}

export const fetchFarmsByUserId = async (userId: string, token: string): Promise<FarmRecord[]> => {
  try {
    console.log("TOKEN:", token);
    const response = await api.get<{ items: FarmRecord[] }>(`/collections/farms/records`, {
      params: {
        filter: `user="${userId}"`,
      },
    });
    console.log(`🌍 Total de granjas encontradas para el usuario ${userId}: ${response.data.items}`);
    // Opcional: guardar en zustand si quieres
    useFarmFormStore.getState().setFormData(response.data.items[0]); // o guardar todos

    return response.data.items;
  } catch (error) {
    console.error('Error al obtener granjas del usuario:', error);
    throw error;
  }
};

export const saveFarmDetails = async (data: Partial<FarmDetails>, token: string) => {
  try {
    const response = await api.post('/collections/farm_details/records', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al guardar los detalles de la granja:', error);
    throw error;
  }
};

export const updateFarmDetails = async (
  id: string,
  data: Partial<FarmDetails>
) => {
  try {
    const response = await api.patch(`/collections/farm_details/records/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar los detalles de la granja:', error);
    throw error;
  }
};



