import React, { useState } from 'react';
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Search,
  Package,
} from 'lucide-react';
import { Badge } from '@/components/atoms/badge';
import { Button } from '@/components/atoms/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from '@/components/atoms/dropdown-menu';
import { Input } from '@/components/atoms/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog';
import { Label } from '@/components/atoms/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';
import { useProductsPage } from './useProductsPage';
import { Product, ProductCategory } from '@/types';

const ProductsPage = () => {
  const {
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
    isCategoryDialogOpen,
    setIsCategoryDialogOpen,
    editingCategory,
    activeTab,
    setActiveTab,
    handleCreateCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleSaveCategory,
  } = useProductsPage();

  const [searchTerm, setSearchTerm] = useState('');
  const [showActive, setShowActive] = useState(true);
  const [showInactive, setShowInactive] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    code: '',
    tracking: 'none',
    description: '',
    active: true,
  });
  const [categoryFormData, setCategoryFormData] = useState<
    Partial<ProductCategory>
  >({
    name: '',
    active: true,
  });

  React.useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
    } else {
      setFormData({
        name: '',
        code: '',
        tracking: 'none',
        description: '',
        active: true,
      });
    }
  }, [editingProduct, isDialogOpen]);

  React.useEffect(() => {
    if (editingCategory) {
      setCategoryFormData(editingCategory);
    } else {
      setCategoryFormData({
        name: '',
        active: true,
      });
    }
  }, [editingCategory, isCategoryDialogOpen]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      (showActive && product.active) || (showInactive && !product.active);
    return matchesSearch && matchesStatus;
  });

  const filteredCategories = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.uom) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    handleSave(formData as Product);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name) {
      alert('Vui lòng nhập tên danh mục');
      return;
    }
    handleSaveCategory(categoryFormData as ProductCategory);
  };

  const handleExportExcel = () => {
    const csvData = [
      ['Mã SP', 'Tên Sản Phẩm', 'Danh Mục', 'Đơn Vị', 'Tracking', 'Trạng Thái'],
      ...filteredProducts.map((p) => [
        p.code || '',
        p.name,
        p.category?.name || '',
        p.uom?.name || '',
        p.tracking || 'none',
        p.active ? 'Hoạt động' : 'Ẩn',
      ]),
    ];
    const csvContent = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">Quản Lý Sản Phẩm</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b">
        <button
          className={`pb-2 px-4 ${
            activeTab === 'product'
              ? 'border-b-2 border-primary font-semibold'
              : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('product')}
        >
          Sản Phẩm
        </button>
        <button
          className={`pb-2 px-4 ${
            activeTab === 'category'
              ? 'border-b-2 border-primary font-semibold'
              : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('category')}
        >
          Danh Mục
        </button>
      </div>

      {/* Product Tab */}
      {activeTab === 'product' && (
        <>
          <div className="flex items-center mb-4">
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Lọc
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Lọc theo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={showActive}
                    onCheckedChange={setShowActive}
                  >
                    Đang hoạt động
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={showInactive}
                    onCheckedChange={setShowInactive}
                  >
                    Đã ẩn
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1"
                onClick={handleExportExcel}
              >
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Xuất Excel
                </span>
              </Button>
              <Button size="sm" className="h-8 gap-1" onClick={handleCreate}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Thêm Sản Phẩm
                </span>
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center">
                <div className="relative flex-1 md:grow-0">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Đang tải...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã SP</TableHead>
                      <TableHead>Tên Sản Phẩm</TableHead>
                      <TableHead>Danh Mục</TableHead>
                      <TableHead>Đơn Vị</TableHead>
                      <TableHead>Tracking</TableHead>
                      <TableHead>Trạng Thái</TableHead>
                      <TableHead>
                        <span className="sr-only">Hành động</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.code || '-'}
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category?.name || '-'}</TableCell>
                        <TableCell>{product.uom?.name || '-'}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.tracking === 'none'
                                ? 'secondary'
                                : 'default'
                            }
                          >
                            {product.tracking}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={product.active ? 'default' : 'secondary'}
                          >
                            {product.active ? 'Hoạt động' : 'Ẩn'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleEdit(product)}
                              >
                                Sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  product.id && handleDelete(product.id)
                                }
                                className="text-red-600"
                              >
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Dialog Form */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[525px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
                  </DialogTitle>
                  <DialogDescription>
                    Điền thông tin sản phẩm. Nhấn lưu khi hoàn tất.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Tên SP *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">
                      Mã SP
                    </Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Danh Mục *
                    </Label>
                    <Select
                      value={formData.category?.id?.toString()}
                      onValueChange={(value) => {
                        const cat = categories.find(
                          (c) => c.id?.toString() === value
                        );
                        if (cat)
                          setFormData({
                            ...formData,
                            category: { id: cat.id!, name: cat.name },
                          });
                      }}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id!.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="uom" className="text-right">
                      Đơn Vị *
                    </Label>
                    <Select
                      value={formData.uom?.id?.toString()}
                      onValueChange={(value) => {
                        const u = uoms.find(
                          (um) => um.id?.toString() === value
                        );
                        if (u)
                          setFormData({
                            ...formData,
                            uom: { id: u.id!, name: u.name },
                          });
                      }}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn đơn vị" />
                      </SelectTrigger>
                      <SelectContent>
                        {uoms.map((u) => (
                          <SelectItem key={u.id} value={u.id!.toString()}>
                            {u.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tracking" className="text-right">
                      Tracking
                    </Label>
                    <Select
                      value={formData.tracking}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, tracking: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="lot">Lot</SelectItem>
                        <SelectItem value="serial">Serial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Mô Tả
                    </Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Lưu</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Category Tab */}
      {activeTab === 'category' && (
        <>
          <div className="flex items-center mb-4">
            <div className="ml-auto flex items-center gap-2">
              <Button
                size="sm"
                className="h-8 gap-1"
                onClick={handleCreateCategory}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Thêm Danh Mục
                </span>
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center">
                <div className="relative flex-1 md:grow-0">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm danh mục..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên Danh Mục</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead>
                      <span className="sr-only">Hành động</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={category.active ? 'default' : 'secondary'}
                        >
                          {category.active ? 'Hoạt động' : 'Ẩn'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEditCategory(category)}
                            >
                              Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                category.id && handleDeleteCategory(category.id)
                              }
                              className="text-red-600"
                            >
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Category Dialog */}
          <Dialog
            open={isCategoryDialogOpen}
            onOpenChange={setIsCategoryDialogOpen}
          >
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleCategorySubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
                  </DialogTitle>
                  <DialogDescription>
                    Điền thông tin danh mục sản phẩm. Nhấn lưu khi hoàn tất.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="catName" className="text-right">
                      Tên Danh Mục *
                    </Label>
                    <Input
                      id="catName"
                      value={categoryFormData.name}
                      onChange={(e) =>
                        setCategoryFormData({
                          ...categoryFormData,
                          name: e.target.value,
                        })
                      }
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Lưu</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default ProductsPage;
