import { useState, useEffect } from 'react';
import { Product, ProductCategory, UoM } from '@/types';
import {
  productService,
  productCategoryService,
} from '@/services/productService';
import { uomService } from '@/services/uomService';
import { toast } from '@/hooks/use-toast';

export const useProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [uoms, setUoms] = useState<UoM[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ProductCategory | null>(null);
  const [activeTab, setActiveTab] = useState<'product' | 'category'>('product');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getList();
      setProducts(response.data.data || []);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tải danh sách sản phẩm',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productCategoryService.getList();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
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
    fetchProducts();
    fetchCategories();
    fetchUoms();
  }, []);

  const handleCreate = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

    try {
      await productService.delete(id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa sản phẩm',
      });
      fetchProducts();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xóa sản phẩm',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async (data: Product) => {
    try {
      if (editingProduct?.id) {
        await productService.update({ ...data, id: editingProduct.id });
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật sản phẩm',
        });
      } else {
        await productService.create(data);
        toast({
          title: 'Thành công',
          description: 'Đã tạo sản phẩm mới',
        });
      }
      setIsDialogOpen(false);
      fetchProducts();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể lưu sản phẩm',
        variant: 'destructive',
      });
    }
  };

  // Category handlers
  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: ProductCategory) => {
    setEditingCategory(category);
    setIsCategoryDialogOpen(true);
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;

    try {
      await productCategoryService.delete(id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa danh mục',
      });
      fetchCategories();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xóa danh mục',
        variant: 'destructive',
      });
    }
  };

  const handleSaveCategory = async (data: ProductCategory) => {
    try {
      if (editingCategory?.id) {
        await productCategoryService.update({
          ...data,
          id: editingCategory.id,
        });
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật danh mục',
        });
      } else {
        await productCategoryService.create(data);
        toast({
          title: 'Thành công',
          description: 'Đã tạo danh mục mới',
        });
      }
      setIsCategoryDialogOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể lưu danh mục',
        variant: 'destructive',
      });
    }
  };

  return {
    products,
    categories,
    uoms,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    editingProduct,
    handleCreate,
    handleEdit,
    handleDelete,
    handleSave,
    // Category
    isCategoryDialogOpen,
    setIsCategoryDialogOpen,
    editingCategory,
    activeTab,
    setActiveTab,
    handleCreateCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleSaveCategory,
  };
};
