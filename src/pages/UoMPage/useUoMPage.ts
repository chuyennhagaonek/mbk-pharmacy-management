import { useState, useEffect } from 'react';
import { UoM, UoMCategory } from '@/types';
import { uomService, uomCategoryService } from '@/services/uomService';
import { toast } from '@/hooks/use-toast';

export const useUoMPage = () => {
  const [uoms, setUoms] = useState<UoM[]>([]);
  const [categories, setCategories] = useState<UoMCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUoMDialogOpen, setIsUoMDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingUoM, setEditingUoM] = useState<UoM | null>(null);
  const [editingCategory, setEditingCategory] = useState<UoMCategory | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<'uom' | 'category'>('uom');

  const fetchUoMs = async () => {
    try {
      setLoading(true);
      const response = await uomService.getList();
      setUoms(response.data.data || []);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tải danh sách đơn vị',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await uomCategoryService.getList();
      setCategories(response.data.data || []);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tải danh sách nhóm đơn vị',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchUoMs();
    fetchCategories();
  }, []);

  const handleCreateUoM = () => {
    setEditingUoM(null);
    setIsUoMDialogOpen(true);
  };

  const handleEditUoM = (uom: UoM) => {
    setEditingUoM(uom);
    setIsUoMDialogOpen(true);
  };

  const handleDeleteUoM = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa đơn vị này?')) return;

    try {
      await uomService.delete(id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa đơn vị',
      });
      fetchUoMs();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xóa đơn vị',
        variant: 'destructive',
      });
    }
  };

  const handleSaveUoM = async (data: UoM) => {
    try {
      if (editingUoM?.id) {
        await uomService.update({ ...data, id: editingUoM.id });
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật đơn vị',
        });
      } else {
        await uomService.create(data);
        toast({
          title: 'Thành công',
          description: 'Đã tạo đơn vị mới',
        });
      }
      setIsUoMDialogOpen(false);
      fetchUoMs();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể lưu đơn vị',
        variant: 'destructive',
      });
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: UoMCategory) => {
    setEditingCategory(category);
    setIsCategoryDialogOpen(true);
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa nhóm đơn vị này?')) return;

    try {
      await uomCategoryService.delete(id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa nhóm đơn vị',
      });
      fetchCategories();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xóa nhóm đơn vị',
        variant: 'destructive',
      });
    }
  };

  const handleSaveCategory = async (data: UoMCategory) => {
    try {
      if (editingCategory?.id) {
        await uomCategoryService.update({ ...data, id: editingCategory.id });
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật nhóm đơn vị',
        });
      } else {
        await uomCategoryService.create(data);
        toast({
          title: 'Thành công',
          description: 'Đã tạo nhóm đơn vị mới',
        });
      }
      setIsCategoryDialogOpen(false);
      fetchCategories();
      fetchUoMs();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể lưu nhóm đơn vị',
        variant: 'destructive',
      });
    }
  };

  return {
    uoms,
    categories,
    loading,
    isUoMDialogOpen,
    setIsUoMDialogOpen,
    isCategoryDialogOpen,
    setIsCategoryDialogOpen,
    editingUoM,
    editingCategory,
    activeTab,
    setActiveTab,
    handleCreateUoM,
    handleEditUoM,
    handleDeleteUoM,
    handleSaveUoM,
    handleCreateCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleSaveCategory,
  };
};
