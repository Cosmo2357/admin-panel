import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { FaArrowRightToBracket, FaUser } from 'react-icons/fa6';
import useStore from '../stores/mainStore';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const Header: React.FC = () => {
  const { toast } = useToast();
  const { logout } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleLogout = () => {
    logout();
    closeDialog();
    toast({
      title: 'Logout Successful',
      description: (
        <div className="flex items-center">
          <FaCheckCircle className="mr-2 text-green-500" />
          <span>You have successfully logged out.</span>
        </div>
      ),
    });
  };

  return (
    <header className="h-16 bg-slate-700 text-white align-middle w-full fixed top-0 left-0 z-10">
      <div className="flex justify-between items-center h-full p-4">
        <div>Admin Panel</div>

        <div className="flex items-center space-x-2 ml-auto mr-6">
          <Label htmlFor="dark-mode">Dark Mode</Label>
          <Switch id="dark-mode" /*  className="bg-slate-700" */ />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-5 mt-1">
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <FaUser className="m-3 cursor-pointer" />
              Setting
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={openDialog}>
              <FaArrowRightToBracket className="m-3 cursor-pointer" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Header;
