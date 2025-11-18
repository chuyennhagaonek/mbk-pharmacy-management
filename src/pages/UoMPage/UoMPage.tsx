import React, { useState } from 'react';
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Search,
  Ruler,
} from 'lucide-react';
import { Badge } from '@/components/atoms/badge';
import { Button } from '@/components/atoms/button';
import { Card, CardContent, CardHeader } from '@/components/atoms/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
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
import { useUoMPage } from './useUoMPage';
import { UoM, UoMCategory } from '@/types';

const UoMPage = () => {
  const {
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
  } = useUoMPage();

  const [searchTerm, setSearchTerm] = useState('');
  const [uomFormData, setUomFormData] = useState<Partial<UoM>>({
    name: '',
    factor: 1,
    rounding: 0.01,
    active: true,
  });
  const [categoryFormData, setCategoryFormData] = useState<
    Partial<UoMCategory>
  >({
    name: '',
    active: true,
  });

  React.useEffect(() => {
    if (editingUoM) {
      setUomFormData(editingUoM);
    } else {
      setUomFormData({
        name: '',
        factor: 1,
        rounding: 0.01,
        active: true,
      });
    }
  }, [editingUoM, isUoMDialogOpen]);

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

  const filteredUoMs = uoms.filter(
    (uom) =>
      uom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uom.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUoMSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uomFormData.name || !uomFormData.category) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    handleSaveUoM(uomFormData as UoM);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name) {
      alert('Vui lòng nhập tên nhóm đơn vị');
      return;
    }
    handleSaveCategory(categoryFormData as UoMCategory);
  };

  const handleExportExcel = () => {
    if (activeTab === 'uom') {
      const csvData = [
        ['Tên Đơn Vị', 'Nhóm', 'Hệ Số', 'Làm Tròn', 'Trạng Thái'],
        ...filteredUoMs.map((u) => [
          u.name,
          u.category?.name || '',
          u.factor || 1,
          u.rounding || 0.01,
          u.active ? 'Hoạt động' : 'Ẩn',
        ]),
      ];
      const csvContent = csvData.map((row) => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `uom_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } else {
      const csvData = [
        ['Tên Nhóm', 'Trạng Thái'],
        ...filteredCategories.map((c) => [
          c.name || '',
          c.active ? 'Hoạt động' : 'Ẩn',
        ]),
      ];
      const csvContent = csvData.map((row) => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `uom_categories_${
        new Date().toISOString().split('T')[0]
      }.csv`;
      link.click();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">
          Quản Lý Đơn Vị Đo Lường
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b">
        <button
          className={`pb-2 px-4 ${
            activeTab === 'uom'
              ? 'border-b-2 border-primary font-semibold'
              : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('uom')}
        >
          Đơn Vị
        </button>
        <button
          className={`pb-2 px-4 ${
            activeTab === 'category'
              ? 'border-b-2 border-primary font-semibold'
              : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('category')}
        >
          Nhóm Đơn Vị
        </button>
      </div>

      {/* UoM Tab */}
      {activeTab === 'uom' && (
        <>
          <div className="flex items-center mb-4">
            <div className="ml-auto flex items-center gap-2">
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
              <Button size="sm" className="h-8 gap-1" onClick={handleCreateUoM}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Thêm Đơn Vị
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
                    placeholder="Tìm kiếm đơn vị..."
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
                      <TableHead>Tên Đơn Vị</TableHead>
                      <TableHead>Nhóm</TableHead>
                      <TableHead>Hệ Số</TableHead>
                      <TableHead>Làm Tròn</TableHead>
                      <TableHead>Trạng Thái</TableHead>
                      <TableHead>
                        <span className="sr-only">Hành động</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUoMs.map((uom) => (
                      <TableRow key={uom.id}>
                        <TableCell className="font-medium">
                          {uom.name}
                        </TableCell>
                        <TableCell>{uom.category?.name || '-'}</TableCell>
                        <TableCell>{uom.factor || 1}</TableCell>
                        <TableCell>{uom.rounding || 0.01}</TableCell>
                        <TableCell>
                          <Badge variant={uom.active ? 'default' : 'secondary'}>
                            {uom.active ? 'Hoạt động' : 'Ẩn'}
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
                                onClick={() => handleEditUoM(uom)}
                              >
                                Sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  uom.id && handleDeleteUoM(uom.id)
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

          {/* UoM Dialog */}
          <Dialog open={isUoMDialogOpen} onOpenChange={setIsUoMDialogOpen}>
            <DialogContent className="sm:max-w-[525px]">
              <form onSubmit={handleUoMSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingUoM ? 'Sửa Đơn Vị' : 'Thêm Đơn Vị Mới'}
                  </DialogTitle>
                  <DialogDescription>
                    Điền thông tin đơn vị đo lường. Nhấn lưu khi hoàn tất.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Tên Đơn Vị *
                    </Label>
                    <Input
                      id="name"
                      value={uomFormData.name}
                      onChange={(e) =>
                        setUomFormData({ ...uomFormData, name: e.target.value })
                      }
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Nhóm *
                    </Label>
                    <Select
                      value={uomFormData.category?.id?.toString()}
                      onValueChange={(value) => {
                        const cat = categories.find(
                          (c) => c.id?.toString() === value
                        );
                        if (cat)
                          setUomFormData({
                            ...uomFormData,
                            category: { id: cat.id!, name: cat.name! },
                          });
                      }}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn nhóm đơn vị" />
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
                    <Label htmlFor="factor" className="text-right">
                      Hệ Số
                    </Label>
                    <Input
                      id="factor"
                      type="number"
                      step="0.000001"
                      value={uomFormData.factor}
                      onChange={(e) =>
                        setUomFormData({
                          ...uomFormData,
                          factor: parseFloat(e.target.value),
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rounding" className="text-right">
                      Làm Tròn
                    </Label>
                    <Input
                      id="rounding"
                      type="number"
                      step="0.000001"
                      value={uomFormData.rounding}
                      onChange={(e) =>
                        setUomFormData({
                          ...uomFormData,
                          rounding: parseFloat(e.target.value),
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
                  Thêm Nhóm
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
                    placeholder="Tìm kiếm nhóm..."
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
                    <TableHead>Tên Nhóm</TableHead>
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
                    {editingCategory
                      ? 'Sửa Nhóm Đơn Vị'
                      : 'Thêm Nhóm Đơn Vị Mới'}
                  </DialogTitle>
                  <DialogDescription>
                    Điền thông tin nhóm đơn vị. Nhấn lưu khi hoàn tất.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="catName" className="text-right">
                      Tên Nhóm *
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

export default UoMPage;
