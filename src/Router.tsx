import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './components/templates/MainLayout';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import InventoryManagementPage from './pages/InventoryManagementPage/InventoryManagementPage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import PartnersPage from './pages/PartnersPage/PartnersPage';
import UoMPage from './pages/UoMPage/UoMPage';
import WarehousePage from './pages/WarehousePage/WarehousePage';
import SupplierPricePage from './pages/SupplierPricePage/SupplierPricePage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: (
      <MainLayout>
        <HomePage />
      </MainLayout>
    ),
  },
  {
    path: '/products',
    element: (
      <MainLayout>
        <ProductsPage />
      </MainLayout>
    ),
  },
  {
    path: '/partners',
    element: (
      <MainLayout>
        <PartnersPage />
      </MainLayout>
    ),
  },
  {
    path: '/inventory',
    element: (
      <MainLayout>
        <InventoryManagementPage />
      </MainLayout>
    ),
  },
  {
    path: '/uom',
    element: (
      <MainLayout>
        <UoMPage />
      </MainLayout>
    ),
  },
  {
    path: '/warehouse',
    element: (
      <MainLayout>
        <WarehousePage />
      </MainLayout>
    ),
  },
  {
    path: '/supplier-price',
    element: (
      <MainLayout>
        <SupplierPricePage />
      </MainLayout>
    ),
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
