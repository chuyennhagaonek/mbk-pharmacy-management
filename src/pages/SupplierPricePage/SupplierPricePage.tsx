import React, { useState } from 'react';
import { MoreHorizontal, PlusCircle, Search, DollarSign } from 'lucide-react';
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
import { useSupplierPricePage } from './useSupplierPricePage';
import { SupplierPrice } from '@/types';

const SupplierPricePage = () => {
  const {
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
  } = useSupplierPricePage();

  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<SupplierPrice>>({
    price: 0,
    currency: 'VND',
  });

  React.useEffect(() => {
    if (editingPrice) {
      setFormData(editingPrice);
    } else {
      setFormData({
        price: 0,
        currency: 'VND',
      });
    }
  }, [editingPrice, isDialogOpen]);

  const filteredPrices = supplierPrices.filter(
    (price) =>
      price.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product || !formData.supplier || !formData.uom) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    handleSave(formData as SupplierPrice);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">
          Quản Lý Giá Nhà Cung Cấp
        </h1>
      </div>

      <div className="flex items-center mb-4">
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="h-8 gap-1" onClick={handleCreate}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Thêm Giá
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
                placeholder="Tìm kiếm..."
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
                  <TableHead>Sản Phẩm</TableHead>
                  <TableHead>Nhà Cung Cấp</TableHead>
                  <TableHead>Đơn Vị</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Tiền Tệ</TableHead>
                  <TableHead>Ghi Chú</TableHead>
                  <TableHead>
                    <span className="sr-only">Hành động</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrices.map((price) => (
                  <TableRow key={price.id}>
                    <TableCell className="font-medium">
                      {price.product?.name || '-'}
                    </TableCell>
                    <TableCell>{price.supplier?.name || '-'}</TableCell>
                    <TableCell>{price.uom?.name || '-'}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('vi-VN').format(price.price || 0)}
                    </TableCell>
                    <TableCell>{price.currency || 'VND'}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {price.notes || '-'}
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
                          <DropdownMenuItem onClick={() => handleEdit(price)}>
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => price.id && handleDelete(price.id)}
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
                {editingPrice ? 'Sửa Giá' : 'Thêm Giá Mới'}
              </DialogTitle>
              <DialogDescription>
                Điền thông tin giá nhà cung cấp. Nhấn lưu khi hoàn tất.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product" className="text-right">
                  Sản Phẩm *
                </Label>
                <Select
                  value={formData.product?.id?.toString()}
                  onValueChange={(value) => {
                    const prod = products.find(
                      (p) => p.id?.toString() === value
                    );
                    if (prod)
                      setFormData({
                        ...formData,
                        product: { id: prod.id!, name: prod.name },
                      });
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn sản phẩm" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((prod) => (
                      <SelectItem key={prod.id} value={prod.id!.toString()}>
                        {prod.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="supplier" className="text-right">
                  Nhà CC *
                </Label>
                <Select
                  value={formData.supplier?.id?.toString()}
                  onValueChange={(value) => {
                    const partner = partners.find(
                      (p) => p.id?.toString() === value
                    );
                    if (partner)
                      setFormData({
                        ...formData,
                        supplier: { id: partner.id!, name: partner.name },
                      });
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn nhà cung cấp" />
                  </SelectTrigger>
                  <SelectContent>
                    {partners.map((partner) => (
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
                <Label htmlFor="uom" className="text-right">
                  Đơn Vị *
                </Label>
                <Select
                  value={formData.uom?.id?.toString()}
                  onValueChange={(value) => {
                    const u = uoms.find((um) => um.id?.toString() === value);
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
                <Label htmlFor="price" className="text-right">
                  Giá *
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currency" className="text-right">
                  Tiền Tệ
                </Label>
                <Input
                  id="currency"
                  value={formData.currency || 'VND'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currency: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Ghi Chú
                </Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
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
    </div>
  );
};

export default SupplierPricePage;
