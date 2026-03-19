# Zookeepa.dev - Architecture Documentation

## Overview

This document outlines the clean separation between frontend and backend, ensuring all business logic is handled on the backend while the frontend remains a thin client for presentation.

---

## Directory Structure

### Backend (`/backend`)
All server-side logic, API routes, middleware, and database operations.

```
backend/
├── auth.js                 # Authentication routes (login)
├── users.js               # User management routes
├── products.js            # Product management routes
├── orders.js              # Order management routes
├── careers.js             # Careers management routes (NEW)
├── events.js              # Events management routes (NEW)
├── gallery.js             # Gallery management routes (NEW)
├── partners.js            # Partners management routes (NEW)
├── team.js                # Team members management routes (NEW)
├── promotions.js          # Promotions management routes (NEW)
├── site-settings.js       # Site settings management routes (NEW)
├── server.js              # Express server & route mounting
├── db.js                  # Database connection pool
├── middleware/
│   └── auth.js            # JWT authentication & role authorization
├── entities/              # Placeholder for entity models (optional)
└── database/
    └── schema.sql         # Database schema & table definitions
```

### Frontend (`/src`)
Presentation layer, UI components, and API service layer.

```
src/
├── api/
│   ├── apiService.js      # CENTRALIZED API SERVICE LAYER (NEW)
│   ├── Client.js          # Base44 SDK client
│   └── entities.js        # Entity type definitions
├── pages/                 # Page components
├── components/            # Reusable UI components
├── lib/
│   ├── AuthContext.jsx    # Authentication context (uses apiService)
│   └── ...
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
└── App.jsx               # Main app component
```

---

## API Service Layer

### Location
`src/api/apiService.js`

### Purpose
Centralized API calling mechanism that:
- Handles JWT token injection
- Standardizes error handling
- Provides organized namespaced API methods
- Ensures token authentication on all protected routes

### Usage Example

```javascript
import { productsAPI, ordersAPI, careersAPI } from '@/api/apiService';

// Get all products
const products = await productsAPI.getAll();

// Get specific product
const product = await productsAPI.getById(1);

// Create new product (admin only)
const newProduct = await productsAPI.create({
  name: 'New Product',
  price: 99.99,
  category: 'tops'
});

// Get user's orders
const myOrders = await ordersAPI.getMyOrders();

// Get all careers
const careers = await careersAPI.getAll();
```

### Available API Namespaces

- `authAPI` - Authentication (login)
- `usersAPI` - User profile & management
- `productsAPI` - Product catalog
- `ordersAPI` - Order management
- `careersAPI` - Careers listings
- `eventsAPI` - Events management
- `galleryAPI` - Gallery items
- `partnersAPI` - Partners/brands
- `teamAPI` - Team members
- `promotionsAPI` - Promotions/banners
- `siteSettingsAPI` - Site configuration

---

## Backend Routes

### Authentication
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update current user profile
- `GET /api/users` - Get all users (admin only)

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get product by ID (public)
- `POST /api/products` - Create product (admin/super_admin)
- `PUT /api/products/:id` - Update product (admin/super_admin)
- `DELETE /api/products/:id` - Delete product (super_admin)

### Orders
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/my` - Get user's orders (authenticated)
- `GET /api/orders/:id` - Get specific order (admin only)
- `POST /api/orders` - Create order (authenticated)
- `PUT /api/orders/:id` - Update order status (admin only)

### Careers
- `GET /api/careers` - Get all open careers (public)
- `GET /api/careers/:id` - Get career by ID (public)
- `POST /api/careers` - Create career (admin/super_admin)
- `PUT /api/careers/:id` - Update career (admin/super_admin)
- `DELETE /api/careers/:id` - Delete career (super_admin)

### Events
- `GET /api/events` - Get all events (public)
- `GET /api/events/:id` - Get event by ID (public)
- `POST /api/events` - Create event (admin/super_admin)
- `PUT /api/events/:id` - Update event (admin/super_admin)
- `DELETE /api/events/:id` - Delete event (super_admin)

### Gallery
- `GET /api/gallery` - Get all gallery items (public)
- `GET /api/gallery/:id` - Get gallery item by ID (public)
- `POST /api/gallery` - Create gallery item (admin/super_admin)
- `PUT /api/gallery/:id` - Update gallery item (admin/super_admin)
- `DELETE /api/gallery/:id` - Delete gallery item (super_admin)

### Partners
- `GET /api/partners` - Get all partners (public)
- `GET /api/partners/:id` - Get partner by ID (public)
- `POST /api/partners` - Create partner (admin/super_admin)
- `PUT /api/partners/:id` - Update partner (admin/super_admin)
- `DELETE /api/partners/:id` - Delete partner (super_admin)

### Team
- `GET /api/team` - Get all team members (public)
- `GET /api/team/:id` - Get team member by ID (public)
- `POST /api/team` - Create team member (admin/super_admin)
- `PUT /api/team/:id` - Update team member (admin/super_admin)
- `DELETE /api/team/:id` - Delete team member (super_admin)

### Promotions
- `GET /api/promotions` - Get all active promotions (public)
- `GET /api/promotions/:id` - Get promotion by ID (public)
- `POST /api/promotions` - Create promotion (admin/super_admin)
- `PUT /api/promotions/:id` - Update promotion (admin/super_admin)
- `DELETE /api/promotions/:id` - Delete promotion (super_admin)

### Site Settings
- `GET /api/site-settings` - Get site settings (public)
- `GET /api/site-settings/:id` - Get specific setting (public)
- `POST /api/site-settings` - Create settings (super_admin)
- `PUT /api/site-settings/:id` - Update settings (super_admin)

---

## Authentication & Authorization

### JWT Tokens
- Tokens are stored in `localStorage` as `'token'`
- Automatically injected in all API requests via apiService.js
- Tokens include user role information

### Role-Based Access Control
- `user` - Default customer role
- `admin` - Can manage most resources
- `super_admin` - Full access, can manage all resources including site settings
- `store_manager` - Can manage orders and stock

### Protected Routes
All routes except `/api/products` and public GET endpoints require JWT authentication via middleware:

```javascript
router.post('/create', authenticateToken, authorizeRoles('admin', 'super_admin'), handler);
```

---

## Best Practices

### Frontend
1. **Always use apiService.js** for API calls, never use `fetch()` directly
2. **Handle errors** gracefully in try-catch blocks
3. **Use loading states** while fetching data
4. **Cache data** where appropriate using React Query

### Backend
1. **All business logic** should be in backend routes
2. **Validate input** on both frontend and backend
3. **Use middleware** for authentication and authorization
4. **Handle errors** consistently
5. **Return consistent response format**

### Example Frontend Component Pattern

```javascript
import { useEffect, useState } from 'react';
import { productsAPI } from '@/api/apiService';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getAll();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}
```

---

## Database Schema

### Tables
1. **users** - User accounts and credentials
2. **products** - Product catalog
3. **orders** - Customer orders
4. **careers** - Job listings
5. **events** - Company events
6. **gallery_items** - Image gallery
7. **partners** - Partner/brand information
8. **team_members** - Team bios
9. **promotions** - Promotional banners
10. **site_settings** - Global site configuration

All tables include timestamps (`created_at`, `updated_at`) for audit trails.

---

## Removed/Duplicated Files

- ❌ `src/pages/auth.js` - REMOVED (duplicate backend middleware, frontend should not have auth logic)

---

## Summary of Changes

✅ Removed duplicate `src/pages/auth.js`
✅ Created 7 new backend route files (careers, events, gallery, partners, team, promotions, site-settings)
✅ Updated `backend/server.js` to mount all new routes
✅ Created centralized `src/api/apiService.js` for all frontend API calls
✅ All database operations now happen on backend only
✅ Frontend uses only apiService.js for data fetching
✅ Clean separation of concerns between frontend and backend

---

## Next Steps

1. Update all frontend pages to use `apiService.js` instead of direct fetch calls
2. Remove any duplicate API logic from frontend
3. Test all routes in development
4. Deploy backend and frontend separately

