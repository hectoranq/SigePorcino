import axios from 'axios';
import Plan, { PlanData } from '../models/plans';


const api = axios.create({
  baseURL: 'http://38.242.147.212:8090/api',
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

