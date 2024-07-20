import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaBook,
  FaFolderOpen,
  FaUsers,
  FaCreditCard,
  FaChartLine,
  FaHeadset,
} from 'react-icons/fa6';
import useMainStore from '../stores/mainStore';

interface Menu {
  title: string;
  icon: React.ReactNode;
  href: string;
  notificationCount?: number;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const usersNotificationCounter = useMainStore(
    (state) => state.usersNotificationCounter
  );
  const paymentsNotificationCounter = useMainStore(
    (state) => state.paymentsNotificationCounter
  );

  const menu: Menu[] = [
    {
      title: 'Dashboard',
      icon: <FaChartLine size={'1.4rem'} className="text-gray-600" />,
      href: '/',
    },
    {
      title: 'Contents',
      icon: <FaBook size={'1.4rem'} className="text-gray-600" />,
      href: '/contents',
    },
    {
      title: 'Content Groups',
      icon: <FaFolderOpen size={'1.4rem'} className="text-gray-600" />,
      href: '/content-groups',
    },
    {
      title: 'Users',
      icon: <FaUsers size={'1.4rem'} className="text-gray-600" />,
      href: '/users',
      notificationCount: usersNotificationCounter,
    },
    {
      title: 'Payments',
      icon: <FaCreditCard size={'1.4rem'} className="text-gray-600" />,
      href: '/payments',
      notificationCount: paymentsNotificationCounter,
    },
  ];

  return (
    <nav className="w-64 bg-slate-100  fixed top-16 left-0 h-[calc(100vh-4rem)]">
      <ul className="space-y-2 p-4">
        {menu.map((item, index) => (
          <li key={index}>
            <Link
              to={item.href}
              className={`flex items-center justify-between px-3 h-14 text-sm font-medium text-gray-700 rounded-md transition-colors duration-200 hover:bg-gray-200 ${
                location.pathname === item.href
                  ? 'bg-gray-200 font-semibold text-gray-900'
                  : ''
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3">{item.icon}</span>
                {item.title}
              </div>
              {item.notificationCount !== undefined &&
                item.notificationCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                    {item.notificationCount}
                  </span>
                )}
            </Link>
          </li>
        ))}
      </ul>
      <div className="absolute bottom-0 left-0 w-full p-4">
        <Link
          to="/customer-support"
          className="flex items-center justify-between px-3 h-14 text-sm font-medium text-white bg-slate-500 rounded-md transition-colors duration-200 hover:bg-blue-700"
        >
          <div className="flex items-center">
            <span className="mr-3">
              <FaHeadset size={'1.4rem'} />
            </span>
            Customer Support
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar;
