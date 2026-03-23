import './App.css'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import queryClientInstance from '@/lib/query-client.js'
import VisualEditAgent from '@/lib/VisualEditAgent'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { setupIframeMessaging } from './lib/iframe-messaging';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Home from '@/pages/Home';
import RouteGuard from '@/components/RouteGuard';

const { Pages = {}, Layout, mainPage } = pagesConfig || {};
const mainPageKey = mainPage || "Home";
const MainPage = Pages[mainPageKey] || Home;

setupIframeMessaging();

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, authError, isAuthenticated, navigateToLogin } = useAuth();

  // Show loading spinner while checking auth
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  const roleMap = {
    AdminDashboard: ['admin', 'super_admin'],
    AdminPanel: ['admin', 'super_admin'],
    Cart: ['user', 'admin', 'super_admin'],
    Checkout: ['user', 'admin', 'super_admin'],
    MyOrders: ['user', 'admin', 'super_admin'],
    Profile: ['user', 'admin', 'super_admin'],
    StoreManager: ['store_manager', 'admin', 'super_admin'],
    SuperAdminDashboard: ['admin', 'super_admin'],
    Home: ['anonymous', 'user', 'admin', 'super_admin'],
    Shop: ['anonymous', 'user', 'admin', 'super_admin'],
    ProductDetail: ['anonymous', 'user', 'admin', 'super_admin'],
    Login: ['anonymous'],
    Register: ['anonymous'],
  };

  const openPages = [];


  // Render the main app
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RouteGuard
            allowedRoles={roleMap[mainPageKey] || []}
            allowAnonymous={(roleMap[mainPageKey] || []).includes('anonymous')}
          >
            <LayoutWrapper currentPageName={mainPageKey}>
              <MainPage />
            </LayoutWrapper>
          </RouteGuard>
        }
      />

      {Object.entries(Pages).map(([path, Page]) => {
        const allowedRoles = roleMap[path] || [];
        const allowAnonymous = (roleMap[path] || []).includes('anonymous');

        return (
          <Route
            key={path}
            path={`/${path}`}
            element={
              <RouteGuard allowedRoles={allowedRoles} allowAnonymous={allowAnonymous}>
                <LayoutWrapper currentPageName={path}>
                  <Page />
                </LayoutWrapper>
              </RouteGuard>
            }
          />
        );
      })}

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <VisualEditAgent />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App