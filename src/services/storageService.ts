import api from './api';
import { Warehouse, StockLocation, StockPicking, ListResponse } from '@/types';

// Warehouse APIs
export const warehouseService = {
  getList: () => api.get<ListResponse<Warehouse>>('/storage/warehouse'),

  getInfo: (id: number) =>
    api.get<Warehouse>('/storage/warehouse/info', { params: { id } }),

  create: (data: Warehouse) => api.post<Warehouse>('/storage/warehouse', data),

  update: (data: Warehouse) => api.put<Warehouse>('/storage/warehouse', data),

  delete: (id: number) => api.delete('/storage/warehouse', { params: { id } }),
};

// Stock Location APIs
export const locationService = {
  getList: () => api.get<ListResponse<StockLocation>>('/storage/location'),

  getInfo: (id: number) =>
    api.get<StockLocation>('/storage/location/info', { params: { id } }),

  create: (data: StockLocation) =>
    api.post<StockLocation>('/storage/location', data),

  update: (data: StockLocation) =>
    api.put<StockLocation>('/storage/location', data),

  delete: (id: number) => api.delete('/storage/location', { params: { id } }),
};

// Stock Picking APIs
export const stockPickingService = {
  getList: () => api.get<ListResponse<StockPicking>>('/storage/picking'),

  getInfo: (id: number) =>
    api.get<StockPicking>('/storage/picking/info', { params: { id } }),

  create: (data: StockPicking) =>
    api.post<StockPicking>('/storage/picking', data),

  update: (data: StockPicking) =>
    api.put<StockPicking>('/storage/picking', data),

  delete: (id: number) => api.delete('/storage/picking', { params: { id } }),
};
