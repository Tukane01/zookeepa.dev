/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */

// Define a placeholder for PAGES and export config shell to break circular dependencies
const PAGES = {};
import __Layout from './Layout.jsx';

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};

import AdminDashboard from './pages/AdminDashboard';
import AdminPanel from './pages/AdminPanel';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import MyOrders from './pages/MyOrders';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import Shop from './pages/Shop';
import StoreManager from './pages/StoreManager';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

// Populate the PAGES object after imports.
// This ensures that when other modules import this file, they get a reference
// to the `pagesConfig` object immediately, even if its properties are filled later.
Object.assign(PAGES, {
    "AdminDashboard": AdminDashboard, "AdminPanel": AdminPanel, "Cart": Cart,
    "Checkout": Checkout, "Home": Home, "MyOrders": MyOrders,
    "ProductDetail": ProductDetail, "Profile": Profile, "Shop": Shop,
    "StoreManager": StoreManager, "SuperAdminDashboard": SuperAdminDashboard,
    "Login": Login, "Register": Register,
});