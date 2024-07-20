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
import { FaPenToSquare } from 'react-icons/fa6';
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { format } from 'date-fns';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { FaCheckCircle } from 'react-icons/fa';
import { UserType } from '@/models';
import useMainStore from '@/stores/mainStore';
import { useEffect } from 'react';

const columns: ColumnDef<UserType>[] | null = [
  /*  {
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
  }, */
  {
    accessorKey: 'username',
    header: () => (useMainStore.getState().usersLoading ? null : 'User name'),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('username')}</div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) =>
      useMainStore.getState().usersLoading ? null : (
        <Button
          variant="ghost"
          disabled={useMainStore.getState().usersLoading}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    cell: ({ row }) => (
      <div className="lowercase">
        {format(new Date(row.getValue('createdAt')), 'yyyy-MM-dd HH:mm:ss')}
      </div>
    ),
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ row }) => (
      <div className="lowercase">
        {format(new Date(row.getValue('updatedAt')), 'yyyy-MM-dd HH:mm:ss')}
      </div>
    ),
  },
  {
    accessorKey: 'id',
    header: 'UUID',
  },
];

const UsersPage: React.FC = () => {
  useEffect(() => {
    useMainStore.setState({ usersNotificationCounter: 0 });
  }, []);
  const { toast } = useToast();
  const { users, usersLoading } = useMainStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedRow, setSelectedRow] = useState<UserType | null>(null);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    updatedAt: false,
    id: false,
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: users ? users : [],
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

  const handleAddUser = () => {
    const newUser: UserType = {
      id: uuidv4(),
      username,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users
      ? useMainStore.setState({ users: [...users, newUser] })
      : useMainStore.setState({ users: [newUser] });
    setUsername('');
    setEmail('');
    toast({
      title: 'User added',
      description: (
        <div className="flex items-center">
          <FaCheckCircle className="mr-2 text-green-500" />
          <span>You have successfully added a new user.</span>
        </div>
      ),
    });
  };

  const handleRowClick = (row: UserType) => {
    setSelectedRow(row);
    setIsEditMode(true);
    setIsSheetOpen(true);
  };

  return (
    <div className="bg-slate-50 px-12 py-2 h-full">
      <main className="w-full bg-slate-50 ">
        <div className="flex items-center py-4 gap-4">
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
                disabled={usersLoading}
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
                      {isEditMode ? 'Edit Content' : 'Add Content'}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex gap-6 py-4">
                    <div className="w-1/3 flex flex-col items-center"></div>
                    <div className="flex-1">
                      <div className="grid gap-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-right">
                            User Name
                          </Label>
                          <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="col-span-3"
                            disabled={usersLoading}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            email
                          </Label>
                          <Input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4"></div>
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
                      <Button onClick={handleAddUser} className="w-full">
                        Save changes
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Input
            placeholder="Filter title..."
            value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('title')?.setFilterValue(event.target.value)
            }
            disabled={usersLoading}
            className="max-w-sm"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={usersLoading}>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border bg-white">
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
                    {usersLoading ? (
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

export default UsersPage;
