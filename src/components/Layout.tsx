import React, { ReactNode, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import useFetchContentsData from '@/hooks/fetchContents';
import useFetchUsersData from '@/hooks/fetchUsers';
import useFetchPaymentsData from '@/hooks/fetchPayments';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { fetchContentsData } = useFetchContentsData();
  const { fetchUsersData } = useFetchUsersData();
  const { fetchPaymentsData } = useFetchPaymentsData();

  useEffect(() => {
    fetchContentsData();
    fetchUsersData();
    fetchPaymentsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 pt-16">
        <aside className="bg-gray-100 text-black fixed top-16 left-0 h-full w-64">
          <Sidebar />
        </aside>
        <main className="flex-1 ml-64">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
