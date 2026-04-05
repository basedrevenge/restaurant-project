import axios from 'axios';
import { MenuItem, Reservation } from './types';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

export const getMenu = async (): Promise<MenuItem[]> => {
  const res = await api.get('/menu/');
  return res.data;
};

export const createReservation = async (data: Reservation) => {
  const res = await api.post('/reserve/', data);
  return res.data;
};