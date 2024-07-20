/* eslint-disable @typescript-eslint/no-unused-vars */
import { Routes, Route } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import useStore from './stores/mainStore';

import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';
import PaymentsPage from './pages/PaymentsPage';
import ContentPage from './pages/ContentsPage';
import ChartPage from './pages/ChartPage';

export function ButtonDemo() {
  return <Button>Button</Button>;
}

function App() {
  const { loggedIn } = useStore();

  if (!loggedIn) {
    return <LoginPage />;
  }

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<ChartPage />} />
          <Route path="/content-groups" element={<ContentPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/contents" element={<ContentPage />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
