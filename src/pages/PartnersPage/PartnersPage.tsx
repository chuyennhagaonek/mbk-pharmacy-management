import React, { useState } from 'react';
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Search,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/atoms/badge';
import { Button } from '@/components/atoms/button';
import { Card, CardContent, CardHeader } from '@/components/atoms/card';
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
import { usePartnersPage } from './usePartnersPage';
import { Partner } from '@/types';

const PartnersPage = () => {
  const {
    partners,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    editingPartner,
    handleCreate,
    handleEdit,
    handleDelete,
    handleSave,
  } = usePartnersPage();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCustomer, setFilterCustomer] = useState(true);
  const [filterSupplier, setFilterSupplier] = useState(true);
  const [filterEmployee, setFilterEmployee] = useState(true);
  const [formData, setFormData] = useState<Partial<Partner>>({
    name: '',
    code: '',
    phone: '',
    email: '',
    address: '',
    is_customer: false,
    is_supplier: false,
    is_employee: false,
    active: true,
  });

  React.useEffect(() => {
    if (editingPartner) {
      setFormData(editingPartner);
    } else {
      setFormData({
        name: '',
        code: '',
        phone: '',
        email: '',
        address: '',
        is_customer: false,
        is_supplier: false,
        is_employee: false,
        active: true,
      });
    }
  }, [editingPartner, isDialogOpen]);

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      (filterCustomer && partner.is_customer) ||
      (filterSupplier && partner.is_supplier) ||
      (filterEmployee && partner.is_employee) ||
      (!partner.is_customer && !partner.is_supplier && !partner.is_employee);
    return matchesSearch && matchesType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Vui lòng nhập tên đối tác');
      return;
    }
    handleSave(formData as Partner);
  };

  const getPartnerType = (partner: Partner) => {
    const types = [];
    if (partner.is_customer) types.push('Khách hàng');
    if (partner.is_supplier) types.push('Nhà cung cấp');
    if (partner.is_employee) types.push('Nhân viên');
    return types.join(', ') || '-';
  };

  const handleExportExcel = () => {
    const csvData = [
      [
        'Mã ĐT',
        'Tên Đối Tác',
        'Loại',
        'Điện Thoại',
        'Email',
        'Địa Chỉ',
        'Trạng Thái',
      ],
      ...filteredPartners.map((p) => [
        p.code || '',
        p.name,
        getPartnerType(p),
        p.phone || '',
        p.email || '',
        p.address || '',
        p.active ? 'Hoạt động' : 'Ẩn',
      ]),
    ];
    const csvContent = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `partners_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">Quản Lý Đối Tác</h1>
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
                checked={filterCustomer}
                onCheckedChange={setFilterCustomer}
              >
                Khách hàng
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterSupplier}
                onCheckedChange={setFilterSupplier}
              >
                Nhà cung cấp
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterEmployee}
                onCheckedChange={setFilterEmployee}
              >
                Nhân viên
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
              Thêm Đối Tác
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
                placeholder="Tìm kiếm đối tác..."
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
                  <TableHead>Mã ĐT</TableHead>
                  <TableHead>Tên Đối Tác</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Điện Thoại</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Địa Chỉ</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead>
                    <span className="sr-only">Hành động</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">
                      {partner.code || '-'}
                    </TableCell>
                    <TableCell>{partner.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {partner.is_customer && (
                          <Badge variant="default">KH</Badge>
                        )}
                        {partner.is_supplier && (
                          <Badge variant="secondary">NCC</Badge>
                        )}
                        {partner.is_employee && (
                          <Badge variant="outline">NV</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{partner.phone || '-'}</TableCell>
                    <TableCell>{partner.email || '-'}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {partner.address || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={partner.active ? 'default' : 'secondary'}>
                        {partner.active ? 'Hoạt động' : 'Ẩn'}
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
                          <DropdownMenuItem onClick={() => handleEdit(partner)}>
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              partner.id && handleDelete(partner.id)
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
                {editingPartner ? 'Sửa Đối Tác' : 'Thêm Đối Tác Mới'}
              </DialogTitle>
              <DialogDescription>
                Điền thông tin đối tác. Nhấn lưu khi hoàn tất.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên ĐT *
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
                  Mã ĐT
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
                <Label htmlFor="phone" className="text-right">
                  Điện Thoại
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
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
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Loại</Label>
                <div className="col-span-3 flex flex-col gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_customer}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_customer: e.target.checked,
                        })
                      }
                    />
                    Khách hàng
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_supplier}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_supplier: e.target.checked,
                        })
                      }
                    />
                    Nhà cung cấp
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_employee}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_employee: e.target.checked,
                        })
                      }
                    />
                    Nhân viên
                  </label>
                </div>
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

export default PartnersPage;
