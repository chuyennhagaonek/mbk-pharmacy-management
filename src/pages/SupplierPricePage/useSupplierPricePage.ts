import { useState, useEffect } from 'react';
import { SupplierPrice, Partner, Product, UoM } from '@/types';
import { supplierPriceService } from '@/services/partnerService';
import { partnerService } from '@/services/partnerService';
import { productService } from '@/services/productService';
import { uomService } from '@/services/uomService';
import { toast } from '@/hooks/use-toast';

export const useSupplierPricePage = () => {
  const [supplierPrices, setSupplierPrices] = useState<SupplierPrice[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [uoms, setUoms] = useState<UoM[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<SupplierPrice | null>(null);

  const fetchSupplierPrices = async () => {
    try {
      setLoading(true);
      const response = await supplierPriceService.getList();
      setSupplierPrices(response.data.data || []);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description:
          error.message || 'Không thể tải danh sách giá nhà cung cấp',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPartners = async () => {
    try {
      const response = await partnerService.getList();
      setPartners(response.data.data?.filter((p) => p.is_supplier) || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getList();
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchUoms = async () => {
    try {
      const response = await uomService.getList();
      setUoms(response.data.data || []);
    } catch (error) {
      console.error('Error fetching uoms:', error);
    }
  };

  useEffect(() => {
    fetchSupplierPrices();
    fetchPartners();
    fetchProducts();
    fetchUoms();
  }, []);

  const handleCreate = () => {
    setEditingPrice(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (price: SupplierPrice) => {
    setEditingPrice(price);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa giá này?')) return;

    try {
      await supplierPriceService.delete(id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa giá nhà cung cấp',
      });
      fetchSupplierPrices();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xóa giá',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async (data: SupplierPrice) => {
    try {
      if (editingPrice?.id) {
        await supplierPriceService.update({ ...data, id: editingPrice.id });
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật giá',
        });
      } else {
        await supplierPriceService.create(data);
        toast({
          title: 'Thành công',
          description: 'Đã tạo giá mới',
        });
      }
      setIsDialogOpen(false);
      fetchSupplierPrices();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể lưu giá',
        variant: 'destructive',
      });
    }
  };

  return {
    supplierPrices,
    partners,
    products,
    uoms,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    editingPrice,
    handleCreate,
    handleEdit,
    handleDelete,
    handleSave,
  };
};
