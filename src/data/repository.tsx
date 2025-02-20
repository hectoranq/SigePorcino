import axios from 'axios';
import Plan, { PlanData } from '../models/plans';


const api = axios.create({
  baseURL: 'https://api.appsphere.pro/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


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

export const registerUser = async (data) => {
  try {
    const response = await api.post('/collections/users/records', data);
    return response.data;
  } catch (error) {
    console.error('Error al registrar al usuario:', error);
    throw error;
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