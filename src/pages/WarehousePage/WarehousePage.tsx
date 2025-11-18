import React, { useState } from 'react';
import {
  File,
  MoreHorizontal,
  PlusCircle,
  Search,
  Warehouse as WarehouseIcon,
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
import { useWarehousePage } from './useWarehousePage';
import { Warehouse, StockLocation } from '@/types';

const WarehousePage = () => {
  const {
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
  } = useWarehousePage();

  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseFormData, setWarehouseFormData] = useState<
    Partial<Warehouse>
  >({
    name: '',
    code: '',
    address: '',
    notes: '',
    active: true,
  });
  const [locationFormData, setLocationFormData] = useState<
    Partial<StockLocation>
  >({
    name: '',
    code: '',
    usage_type: 'internal',
    notes: '',
    active: true,
  });

  React.useEffect(() => {
    if (editingWarehouse) {
      setWarehouseFormData(editingWarehouse);
    } else {
      setWarehouseFormData({
        name: '',
        code: '',
        address: '',
        notes: '',
        active: true,
      });
    }
  }, [editingWarehouse, isWarehouseDialogOpen]);

  React.useEffect(() => {
    if (editingLocation) {
      setLocationFormData(editingLocation);
    } else {
      setLocationFormData({
        name: '',
        code: '',
        usage_type: 'internal',
        notes: '',
        active: true,
      });
    }
  }, [editingLocation, isLocationDialogOpen]);

  const filteredWarehouses = warehouses.filter(
    (wh) =>
      wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wh.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWarehouseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warehouseFormData.name) {
      alert('Vui lòng nhập tên kho');
      return;
    }
    handleSaveWarehouse(warehouseFormData as Warehouse);
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationFormData.name) {
      alert('Vui lòng nhập tên vị trí');
      return;
    }
    handleSaveLocation(locationFormData as StockLocation);
  };

  const handleExportExcel = () => {
    if (activeTab === 'warehouse') {
      const csvData = [
        ['Mã Kho', 'Tên Kho', 'Địa Chỉ', 'Quản Lý', 'Trạng Thái'],
        ...filteredWarehouses.map((w) => [
          w.code || '',
          w.name,
          w.address || '',
          w.manager?.name || '',
          w.active ? 'Hoạt động' : 'Ẩn',
        ]),
      ];
      const csvContent = csvData.map((row) => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `warehouses_${
        new Date().toISOString().split('T')[0]
      }.csv`;
      link.click();
    } else {
      const csvData = [
        ['Mã VT', 'Tên Vị Trí', 'Kho', 'Loại', 'Trạng Thái'],
        ...filteredLocations.map((l) => [
          l.code || '',
          l.name,
          l.warehouse?.name || '',
          l.usage_type || '',
          l.active ? 'Hoạt động' : 'Ẩn',
        ]),
      ];
      const csvContent = csvData.map((row) => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `locations_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">Quản Lý Kho Hàng</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b">
        <button
          className={`pb-2 px-4 ${
            activeTab === 'warehouse'
              ? 'border-b-2 border-primary font-semibold'
              : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('warehouse')}
        >
          Kho
        </button>
        <button
          className={`pb-2 px-4 ${
            activeTab === 'location'
              ? 'border-b-2 border-primary font-semibold'
              : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('location')}
        >
          Vị Trí Kho
        </button>
      </div>

      {/* Warehouse Tab */}
      {activeTab === 'warehouse' && (
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
              <Button
                size="sm"
                className="h-8 gap-1"
                onClick={handleCreateWarehouse}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Thêm Kho
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
                    placeholder="Tìm kiếm kho..."
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
                      <TableHead>Mã Kho</TableHead>
                      <TableHead>Tên Kho</TableHead>
                      <TableHead>Địa Chỉ</TableHead>
                      <TableHead>Quản Lý</TableHead>
                      <TableHead>Trạng Thái</TableHead>
                      <TableHead>
                        <span className="sr-only">Hành động</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWarehouses.map((warehouse) => (
                      <TableRow key={warehouse.id}>
                        <TableCell className="font-medium">
                          {warehouse.code || '-'}
                        </TableCell>
                        <TableCell>{warehouse.name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {warehouse.address || '-'}
                        </TableCell>
                        <TableCell>{warehouse.manager?.name || '-'}</TableCell>
                        <TableCell>
                          <Badge
                            variant={warehouse.active ? 'default' : 'secondary'}
                          >
                            {warehouse.active ? 'Hoạt động' : 'Ẩn'}
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
                                onClick={() => handleEditWarehouse(warehouse)}
                              >
                                Sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  warehouse.id &&
                                  handleDeleteWarehouse(warehouse.id)
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

          {/* Warehouse Dialog */}
          <Dialog
            open={isWarehouseDialogOpen}
            onOpenChange={setIsWarehouseDialogOpen}
          >
            <DialogContent className="sm:max-w-[525px]">
              <form onSubmit={handleWarehouseSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingWarehouse ? 'Sửa Kho' : 'Thêm Kho Mới'}
                  </DialogTitle>
                  <DialogDescription>
                    Điền thông tin kho hàng. Nhấn lưu khi hoàn tất.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Tên Kho *
                    </Label>
                    <Input
                      id="name"
                      value={warehouseFormData.name}
                      onChange={(e) =>
                        setWarehouseFormData({
                          ...warehouseFormData,
                          name: e.target.value,
                        })
                      }
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">
                      Mã Kho
                    </Label>
                    <Input
                      id="code"
                      value={warehouseFormData.code}
                      onChange={(e) =>
                        setWarehouseFormData({
                          ...warehouseFormData,
                          code: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Địa Chỉ
                    </Label>
                    <Input
                      id="address"
                      value={warehouseFormData.address}
                      onChange={(e) =>
                        setWarehouseFormData({
                          ...warehouseFormData,
                          address: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="manager" className="text-right">
                      Quản Lý
                    </Label>
                    <Select
                      value={warehouseFormData.manager?.id?.toString()}
                      onValueChange={(value) => {
                        const partner = partners.find(
                          (p) => p.id?.toString() === value
                        );
                        if (partner)
                          setWarehouseFormData({
                            ...warehouseFormData,
                            manager: { id: partner.id!, name: partner.name },
                          });
                      }}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn người quản lý" />
                      </SelectTrigger>
                      <SelectContent>
                        {partners
                          .filter((p) => p.is_employee)
                          .map((partner) => (
                            <SelectItem
                              key={partner.id}
                              value={partner.id!.toString()}
                            >
                              {partner.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Ghi Chú
                    </Label>
                    <Input
                      id="notes"
                      value={warehouseFormData.notes}
                      onChange={(e) =>
                        setWarehouseFormData({
                          ...warehouseFormData,
                          notes: e.target.value,
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

      {/* Location Tab */}
      {activeTab === 'location' && (
        <>
          <div className="flex items-center mb-4">
            <div className="ml-auto flex items-center gap-2">
              <Button
                size="sm"
                className="h-8 gap-1"
                onClick={handleCreateLocation}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Thêm Vị Trí
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
                    placeholder="Tìm kiếm vị trí..."
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
                    <TableHead>Mã VT</TableHead>
                    <TableHead>Tên Vị Trí</TableHead>
                    <TableHead>Kho</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead>
                      <span className="sr-only">Hành động</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLocations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">
                        {location.code || '-'}
                      </TableCell>
                      <TableCell>{location.name}</TableCell>
                      <TableCell>{location.warehouse?.name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{location.usage_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={location.active ? 'default' : 'secondary'}
                        >
                          {location.active ? 'Hoạt động' : 'Ẩn'}
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
                              onClick={() => handleEditLocation(location)}
                            >
                              Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                location.id && handleDeleteLocation(location.id)
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

          {/* Location Dialog */}
          <Dialog
            open={isLocationDialogOpen}
            onOpenChange={setIsLocationDialogOpen}
          >
            <DialogContent className="sm:max-w-[525px]">
              <form onSubmit={handleLocationSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingLocation ? 'Sửa Vị Trí' : 'Thêm Vị Trí Mới'}
                  </DialogTitle>
                  <DialogDescription>
                    Điền thông tin vị trí kho. Nhấn lưu khi hoàn tất.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="locName" className="text-right">
                      Tên VT *
                    </Label>
                    <Input
                      id="locName"
                      value={locationFormData.name}
                      onChange={(e) =>
                        setLocationFormData({
                          ...locationFormData,
                          name: e.target.value,
                        })
                      }
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="locCode" className="text-right">
                      Mã VT
                    </Label>
                    <Input
                      id="locCode"
                      value={locationFormData.code}
                      onChange={(e) =>
                        setLocationFormData({
                          ...locationFormData,
                          code: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="warehouse" className="text-right">
                      Kho
                    </Label>
                    <Select
                      value={locationFormData.warehouse?.id?.toString()}
                      onValueChange={(value) => {
                        const wh = warehouses.find(
                          (w) => w.id?.toString() === value
                        );
                        if (wh)
                          setLocationFormData({
                            ...locationFormData,
                            warehouse: { id: wh.id!, name: wh.name },
                          });
                      }}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn kho" />
                      </SelectTrigger>
                      <SelectContent>
                        {warehouses.map((wh) => (
                          <SelectItem key={wh.id} value={wh.id!.toString()}>
                            {wh.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="usageType" className="text-right">
                      Loại
                    </Label>
                    <Select
                      value={locationFormData.usage_type}
                      onValueChange={(value: any) =>
                        setLocationFormData({
                          ...locationFormData,
                          usage_type: value,
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">Internal</SelectItem>
                        <SelectItem value="supplier">Supplier</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="inventory">Inventory</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="transit">Transit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="locNotes" className="text-right">
                      Ghi Chú
                    </Label>
                    <Input
                      id="locNotes"
                      value={locationFormData.notes}
                      onChange={(e) =>
                        setLocationFormData({
                          ...locationFormData,
                          notes: e.target.value,
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
    </div>
  );
};

export default WarehousePage;
