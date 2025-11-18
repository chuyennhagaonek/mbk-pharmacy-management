import React from 'react';
import { Button } from '@/components/atoms/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/atoms/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms/table';
import { DatePicker } from '@/components/atoms/datepicker';
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
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Search,
} from 'lucide-react';

const InventoryManagementPage = () => {
  // Placeholder data
  const transactions = [
    {
      id: 'PN001',
      medicine: 'Paracetamol 500mg',
      quantity: 100,
      type: 'Nhập',
      date: '2025-10-09',
      createdBy: 'Admin',
    },
    {
      id: 'PX001',
      medicine: 'Amoxicillin 250mg',
      quantity: 50,
      type: 'Xuất',
      date: '2025-10-09',
      createdBy: 'Admin',
    },
    {
      id: 'PN002',
      medicine: 'Berberin',
      quantity: 200,
      type: 'Nhập',
      date: '2025-10-08',
      createdBy: 'Admin',
    },
    {
      id: 'PX002',
      medicine: 'Paracetamol 500mg',
      quantity: 20,
      type: 'Xuất',
      date: '2025-10-08',
      createdBy: 'Admin',
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Lịch sử giao dịch</h1>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Nhập</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Xuất</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Thêm Giao Dịch
            </span>
          </Button>
        </div>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <div className="flex items-center">
            <div className="relative flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <DatePicker />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Phiếu</TableHead>
                <TableHead>Tên Thuốc</TableHead>
                <TableHead>Số Lượng</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Ngày Giao Dịch</TableHead>
                <TableHead>Người Tạo</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{tx.id}</TableCell>
                  <TableCell>{tx.medicine}</TableCell>
                  <TableCell>{tx.quantity}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        tx.type === 'Nhập'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </TableCell>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>{tx.createdBy}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagementPage;
