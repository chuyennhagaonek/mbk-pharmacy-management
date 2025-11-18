import api from './api';
import { UoM, UoMCategory, ListResponse } from '@/types';

// UoM Category APIs
export const uomCategoryService = {
  getList: () => api.get<ListResponse<UoMCategory>>('/uom/category'),

  getInfo: (id: number) =>
    api.get<UoMCategory>('/uom/category/info', { params: { id } }),

  create: (data: UoMCategory) => api.post<UoMCategory>('/uom/category', data),

  update: (data: UoMCategory) => api.put<UoMCategory>('/uom/category', data),

  delete: (id: number) => api.delete('/uom/category', { params: { id } }),
};

// UoM APIs
export const uomService = {
  getList: () => api.get<ListResponse<UoM>>('/uom'),

  getInfo: (id: number) => api.get<UoM>('/uom/info', { params: { id } }),

  create: (data: UoM) => api.post<UoM>('/uom/', data),

  update: (data: UoM) => api.put<UoM>('/uom/', data),

  delete: (id: number) => api.delete('/uom/', { params: { id } }),
};
