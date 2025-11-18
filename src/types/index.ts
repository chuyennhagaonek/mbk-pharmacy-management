// Common Types
export interface IdName {
  id: number;
  name: string;
}

export interface ListResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
  total?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// User & Auth Types
export interface User {
  user_id: number;
  username: string;
  role: 'admin' | 'warehouse' | 'sales' | 'employee';
  partner_id?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Product Types
export type TrackingType = 'none' | 'lot' | 'serial';

export interface ProductCategory {
  id?: number;
  name: string;
  description?: string;
  parent_id?: number;
  active?: boolean;
}

export interface Product {
  id?: number;
  name: string;
  code?: string;
  uom: IdName;
  tracking?: TrackingType;
  description?: string;
  category: IdName;
  active?: boolean;
}

// Partner Types
export interface Partner {
  id?: number;
  name: string;
  code?: string;
  phone?: string;
  email?: string;
  address?: string;
  is_customer?: boolean;
  is_supplier?: boolean;
  is_employee?: boolean;
  active?: boolean;
}

export interface SupplierPrice {
  id?: number;
  supplier: IdName;
  product: IdName;
  uom?: IdName;
  price?: number;
  currency?: string;
  effective_date?: string;
  expiration_date?: string;
  notes?: string;
}

// UoM Types
export interface UoMCategory {
  id?: number;
  name: string;
  active?: boolean;
}

export interface UoM {
  id?: number;
  name: string;
  category: IdName;
  factor?: number;
  rounding?: number;
  active?: boolean;
}

// Storage Types
export interface Warehouse {
  id?: number;
  name: string;
  code?: string;
  address?: string;
  manager?: IdName;
  active?: boolean;
  notes?: string;
}

export type LocationUsageType =
  | 'internal'
  | 'supplier'
  | 'customer'
  | 'inventory'
  | 'production'
  | 'transit';

export interface StockLocation {
  id?: number;
  name: string;
  code?: string;
  warehouse?: IdName;
  parent?: IdName;
  usage_type?: LocationUsageType;
  active?: boolean;
  notes?: string;
}

export type PickingType =
  | 'incoming'
  | 'outgoing'
  | 'internal'
  | 'inventory'
  | 'production';

export type PickingState =
  | 'draft'
  | 'waiting'
  | 'confirmed'
  | 'assigned'
  | 'done'
  | 'cancel';

export interface StockPicking {
  id?: number;
  name: string;
  origin?: string;
  picking_type?: PickingType;
  location_id: number;
  location_dest_id: number;
  scheduled_date?: string;
  notes?: string;
  active?: boolean;
  state?: PickingState;
}
