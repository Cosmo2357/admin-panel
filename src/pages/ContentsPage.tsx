import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { ContentType } from '@/models';
import useMainStore from '@/stores/mainStore';
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
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCheckCircle } from 'react-icons/fa';
import { FaUpload, FaPlus, FaArrowsToCircle } from 'react-icons/fa6';
import { v4 as uuidv4 } from 'uuid';

const columns: ColumnDef<ContentType>[] | null = [
  {
    id: 'select',
    header: ({ table }) =>
      useMainStore.getState().contentsLoading ? null : (
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
    accessorKey: 'title',
    header: () => (useMainStore.getState().contentsLoading ? null : 'Title'),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('title')}</div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('description')}</div>
    ),
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('image')}</div>
    ),
  },
  {
    accessorKey: 'contentType',
    header: () =>
      useMainStore.getState().contentsLoading ? null : 'Content Type',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('contentType')}</div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) =>
      useMainStore.getState().contentsLoading ? null : (
        <Button
          variant="ghost"
          disabled={useMainStore.getState().contentsLoading}
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
];

const ContentPage: React.FC = () => {
  const { toast } = useToast();
  const { contents, contentsLoading } = useMainStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedRow, setSelectedRow] = useState<ContentType | null>(null);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    image: false,
    description: false,
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState('');

  const table = useReactTable({
    data: contents ? contents : [],
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

  const [image, setImage] = useState<string | ArrayBuffer | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) setImage(event.target?.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png', 'jpg'],
    },
  });

  const handleAddContent = () => {
    const newContent: ContentType = {
      id: uuidv4(),
      title,
      description,
      image,
      contentType,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    contents
      ? useMainStore.setState({ contents: [...contents, newContent] })
      : useMainStore.setState({ contents: [newContent] });
    setTitle('');
    setDescription('');
    setContentType('');
    setImage(null);
    toast({
      title: 'Content Added',
      description: (
        <div className="flex items-center">
          <FaCheckCircle className="mr-2 text-green-500" />
          <span>You have successfully added a new content.</span>
        </div>
      ),
    });
  };

  const handleRowClick = (row: ContentType) => {
    setSelectedRow(row);
    setIsEditMode(true);
    setIsSheetOpen(true);
  };

  return (
    <div className="bg-slate-50 px-12 py-2 h-full">
      <main className="w-full bg-slate-50">
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
                className="w-auto"
                disabled={contentsLoading}
              >
                <FaPlus className="mr-2" />
                New Content
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
                    <div className="w-1/3 flex flex-col items-center">
                      <div
                        {...getRootProps()}
                        className="w-full h-48 border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 cursor-pointer relative"
                      >
                        <input {...getInputProps()} />
                        {image ? (
                          <img
                            src={image as string}
                            alt="Content"
                            className="max-h-48 object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center">
                            <FaUpload className="text-3xl mb-2" />
                            <span>Drag & drop or click to upload</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="grid gap-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="title" className="text-right">
                            Title
                          </Label>
                          <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="col-span-3"
                            disabled={contentsLoading}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="contentType" className="text-right">
                            Content Type
                          </Label>
                          <Input
                            id="contentType"
                            value={contentType}
                            onChange={(e) => setContentType(e.target.value)}
                            className="col-span-3"
                          />
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
                      <Button onClick={handleAddContent} className="w-full">
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
            disabled={contentsLoading}
            className="max-w-sm"
          />

          <Button variant="outline" className="w-auto" disabled={true}>
            <FaArrowsToCircle className="mr-2" />
            Make Group
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={contentsLoading}>
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
                    {contentsLoading ? (
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
      <main className="w-full bg-slate-50"></main>
    </div>
  );
};

export default ContentPage;
