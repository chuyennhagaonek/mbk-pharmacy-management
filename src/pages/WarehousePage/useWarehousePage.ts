import { useState, useEffect } from 'react';
import { Warehouse, StockLocation, Partner } from '@/types';
import { warehouseService, locationService } from '@/services/storageService';
import { partnerService } from '@/services/partnerService';
import { toast } from '@/hooks/use-toast';

export const useWarehousePage = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [locations, setLocations] = useState<StockLocation[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [isWarehouseDialogOpen, setIsWarehouseDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null
  );
  const [editingLocation, setEditingLocation] = useState<StockLocation | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<'warehouse' | 'location'>(
    'warehouse'
  );

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await warehouseService.getList();
      setWarehouses(response.data.data || []);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tải danh sách kho',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await locationService.getList();
      setLocations(response.data.data || []);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tải danh sách vị trí',
        variant: 'destructive',
      });
    }
  };

  const fetchPartners = async () => {
    try {
      const response = await partnerService.getList();
      setPartners(response.data.data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  useEffect(() => {
    fetchWarehouses();
    fetchLocations();
    fetchPartners();
  }, []);

  const handleCreateWarehouse = () => {
    setEditingWarehouse(null);
    setIsWarehouseDialogOpen(true);
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setIsWarehouseDialogOpen(true);
  };

  const handleDeleteWarehouse = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa kho này?')) return;

    try {
      await warehouseService.delete(id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa kho',
      });
      fetchWarehouses();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xóa kho',
        variant: 'destructive',
      });
    }
  };

  const handleSaveWarehouse = async (data: Warehouse) => {
    try {
      if (editingWarehouse?.id) {
        await warehouseService.update({ ...data, id: editingWarehouse.id });
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật kho',
        });
      } else {
        await warehouseService.create(data);
        toast({
          title: 'Thành công',
          description: 'Đã tạo kho mới',
        });
      }
      setIsWarehouseDialogOpen(false);
      fetchWarehouses();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể lưu kho',
        variant: 'destructive',
      });
    }
  };

  const handleCreateLocation = () => {
    setEditingLocation(null);
    setIsLocationDialogOpen(true);
  };

  const handleEditLocation = (location: StockLocation) => {
    setEditingLocation(location);
    setIsLocationDialogOpen(true);
  };

  const handleDeleteLocation = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa vị trí này?')) return;

    try {
      await locationService.delete(id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa vị trí',
      });
      fetchLocations();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xóa vị trí',
        variant: 'destructive',
      });
    }
  };

  const handleSaveLocation = async (data: StockLocation) => {
    try {
      if (editingLocation?.id) {
        await locationService.update({ ...data, id: editingLocation.id });
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật vị trí',
        });
      } else {
        await locationService.create(data);
        toast({
          title: 'Thành công',
          description: 'Đã tạo vị trí mới',
        });
      }
      setIsLocationDialogOpen(false);
      fetchLocations();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể lưu vị trí',
        variant: 'destructive',
      });
    }
  };

  return {
    warehouses,
    locations,
    partners,
    loading,
    isWarehouseDialogOpen,
    setIsWarehouseDialogOpen,
    isLocationDialogOpen,
    setIsLocationDialogOpen,
    editingWarehouse,
    editingLocation,
    activeTab,
    setActiveTab,
    handleCreateWarehouse,
    handleEditWarehouse,
    handleDeleteWarehouse,
    handleSaveWarehouse,
    handleCreateLocation,
    handleEditLocation,
    handleDeleteLocation,
    handleSaveLocation,
  };
};
