import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminPanel from './pages/AdminPanel';
import StoreManager from './pages/StoreManager';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

export const pages = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/shop', component: Shop, name: 'Shop' },
  { path: '/cart', component: Cart, name: 'Cart' },
  { path: '/checkout', component: Checkout, name: 'Checkout' },
  { path: '/my-orders', component: MyOrders, name: 'My Orders' },
  // Example of a dynamic route
  { path: '/product/:id', component: ProductDetail, name: 'Product Detail' },
  { path: '/profile', component: Profile, name: 'Profile' },
  { path: '/admin', component: AdminDashboard, name: 'Admin Dashboard' },
  { path: '/admin-panel', component: AdminPanel, name: 'Admin Panel' },
  { path: '/store-manager', component: StoreManager, name: 'Store Manager' },
  { path: '/super-admin', component: SuperAdminDashboard, name: 'Super Admin' },
];