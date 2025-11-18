import { useState, useEffect } from 'react';
import { Partner } from '@/types';
import { partnerService } from '@/services/partnerService';
import { toast } from '@/hooks/use-toast';

export const usePartnersPage = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await partnerService.getList();
      setPartners(response.data.data || []);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tải danh sách đối tác',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleCreate = () => {
    setEditingPartner(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa đối tác này?')) return;

    try {
      await partnerService.delete(id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa đối tác',
      });
      fetchPartners();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xóa đối tác',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async (data: Partner) => {
    try {
      if (editingPartner?.id) {
        await partnerService.update({ ...data, id: editingPartner.id });
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật đối tác',
        });
      } else {
        await partnerService.create(data);
        toast({
          title: 'Thành công',
          description: 'Đã tạo đối tác mới',
        });
      }
      setIsDialogOpen(false);
      fetchPartners();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể lưu đối tác',
        variant: 'destructive',
      });
    }
  };

  return {
    partners,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    editingPartner,
    handleCreate,
    handleEdit,
    handleDelete,
    handleSave,
  };
};
