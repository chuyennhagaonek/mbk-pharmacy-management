import api from './api';
import { Product, ProductCategory, ListResponse } from '@/types';

// Product Category APIs
export const productCategoryService = {
  getList: () => api.get<ListResponse<ProductCategory>>('/product/category'),

  getInfo: (id: number) =>
    api.get<ProductCategory>('/product/category/info', { params: { id } }),

  create: (data: ProductCategory) =>
    api.post<ProductCategory>('/product/category', data),

  update: (data: ProductCategory) =>
    api.put<ProductCategory>('/product/category', data),

  delete: (id: number) => api.delete('/product/category', { params: { id } }),
};

// Product APIs
export const productService = {
  getList: () => api.get<ListResponse<Product>>('/product/'),

  getInfo: (id: number) =>
    api.get<Product>('/product/info', { params: { id } }),

  create: (data: Product) => api.post<Product>('/product/', data),

  update: (data: Product) => api.put<Product>('/product/', data),

  delete: (id: number) => api.delete('/product/', { params: { id } }),
};
