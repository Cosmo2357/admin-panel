import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { PaymentType } from '@/models';
import { FaPenToSquare } from 'react-icons/fa6';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import useMainStore from '@/stores/mainStore';
import { FaCircleCheck } from 'react-icons/fa6';
import { Checkbox } from '@radix-ui/react-checkbox';
import { PaymentStatusType } from '@/models';

const columns: ColumnDef<PaymentType>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      useMainStore.getState().usersLoading ? null : (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()} // prevent opening the sheet
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      let icon;
      if (status === PaymentStatusType.SUCCESS)
        icon = <FaCircleCheck className="text-green-500" />;
      else if (status === PaymentStatusType.FAILED)
        icon = <FaTimesCircle className="text-red-500" />;
      else if (status === PaymentStatusType.PENDING)
        icon = <FaHourglassHalf className="text-yellow-500" />;
      return (
        <div className="flex items-center">
          {icon}
          <span className="ml-2 capitalize">{status}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'username',
    header: 'Username',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      return <div>{amount}</div>;
    },
  },
  {
    accessorKey: 'subscriptionType',
    header: 'Subscription Type',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => (
      <div>{new Date(row.getValue('createdAt')).toLocaleString()}</div>
    ),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ row }) => (
      <div>{new Date(row.getValue('updatedAt')).toLocaleString()}</div>
    ),
  },
  {
    accessorKey: 'id',
    header: 'UUID',
  },
];

const PaymentsPage: React.FC = () => {
  const { toast } = useToast();
  const { payments, paymentsLoading } = useMainStore();

  const [status, setStatus] = useState<PaymentStatusType | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [subscriptionType, setSubscriptionType] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedRow, setSelectedRow] = useState<PaymentType | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    updatedAt: false,
  });

  const table = useReactTable({
    data: payments ? payments : [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleAddPayment = () => {
    const newPayment: PaymentType = {
      id: uuidv4(),
      status: status || PaymentStatusType.PENDING,
      username,
      email,
      amount: Number(amount),
      subscriptionType,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    payments
      ? useMainStore.setState({ payments: [...payments, newPayment] })
      : useMainStore.setState({ payments: [newPayment] });
    setStatus(null);
    setUsername('');
    setEmail('');
    setAmount('');
    setSubscriptionType('');
    toast({
      title: 'Payment Added',
      description: (
        <div className="flex items-center">
          <FaCheckCircle className="mr-2 text-green-500" />
          <span>You have successfully added a new payment.</span>
        </div>
      ),
    });
  };

  const handleRowClick = (row: PaymentType) => {
    setSelectedRow(row);
    setIsEditMode(true);
    setIsSheetOpen(true);
  };

  return (
    <div className="bg-slate-50 px-12 py-2 h-full">
      <header className="w-full bg-slate-50">
        <div className="flex items-center py-4  gap-4">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger
              asChild
              onClick={() => {
                setIsEditMode(false);
                //setIsSheetOpen(true);
              }}
            >
              <Button
                variant="outline"
                className="w-32"
                disabled={paymentsLoading}
              >
                <FaPenToSquare className="mr-2" />
                Add
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-3/4">
              <div className="flex justify-center">
                <div className="w-full max-w-4xl">
                  <SheetHeader>
                    <SheetTitle>
                      {' '}
                      {isEditMode ? 'Edit Payment' : 'Add Payment'}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex gap-6 py-4">
                    <div className="flex-1">
                      <div className="grid gap-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="status" className="text-right">
                            Status
                          </Label>
                          <Input
                            id="status"
                            value={status || ''}
                            onChange={(e) =>
                              setStatus(e.target.value as PaymentStatusType)
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-right">
                            Username
                          </Label>
                          <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            Email
                          </Label>
                          <Input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            Amount
                          </Label>
                          <Input
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="subscriptionType"
                            className="text-right"
                          >
                            Subscription Type
                          </Label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button className="col-span-3 w-full">
                                {subscriptionType || 'Select Type'}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {['Monthly', 'Yearly'].map((type) => (
                                <DropdownMenuItem
                                  key={type}
                                  onClick={() => setSubscriptionType(type)}
                                >
                                  {type}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                  <SheetFooter className="flex justify-end mt-4">
                    <SheetClose asChild>
                      <Button variant="outline" className="mr-2">
                        Cancel
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button onClick={handleAddPayment} className="w-full">
                        Save changes
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main className="flex-1">
        <div className="rounded-md border bg-white ">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                    className="hover:bg-gray-100 h-14 cursor-pointer"
                    onClick={() => handleRowClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {paymentsLoading ? (
                      <>
                        <div className="flex gap-4 mb-4">
                          <Skeleton className="flex-1 h-9 rounded-md" />
                          <Skeleton className="flex-1 h-9 rounded-md" />
                          <Skeleton className="flex-1 h-9 rounded-md" />
                          <Skeleton className="flex-1 h-9 rounded-md" />
                        </div>
                        <Skeleton className="w-full h-9 rounded-md mb-4" />
                        <Skeleton className="w-full h-9 rounded-md" />
                      </>
                    ) : (
                      'No results.'
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default PaymentsPage;
