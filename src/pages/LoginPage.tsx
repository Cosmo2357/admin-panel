import React from 'react';
import LoginFormCard from '@/components/LoginFormCard';

const LoginPage: React.FC = () => {
  const path = window.location.pathname;
  if (path !== '/') {
    window.location.href = '/';
  }
  return (
    <body className="flex justify-center items-center h-svh">
      <main>
        <LoginFormCard />
      </main>
    </body>
  );
};

export default LoginPage;
