import api from './api';
import { Partner, SupplierPrice, ListResponse } from '@/types';

// Partner APIs
export const partnerService = {
  getList: () => api.get<ListResponse<Partner>>('/partner'),

  getInfo: (id: number) =>
    api.get<Partner>('/partner/info', { params: { id } }),

  create: (data: Partner) => api.post<Partner>('/partner/', data),

  update: (data: Partner) => api.put<Partner>('/partner/', data),

  delete: (id: number) => api.delete('/partner/', { params: { id } }),
};

// Supplier Price APIs
export const supplierPriceService = {
  getList: () => api.get<ListResponse<SupplierPrice>>('/partner/supplier'),

  getInfo: (id: number) =>
    api.get<SupplierPrice>('/partner/supplier/info', { params: { id } }),

  create: (data: SupplierPrice) =>
    api.post<SupplierPrice>('/partner/supplier', data),

  update: (data: SupplierPrice) =>
    api.put<SupplierPrice>('/partner/supplier', data),

  delete: (id: number) => api.delete('/partner/supplier', { params: { id } }),
};
