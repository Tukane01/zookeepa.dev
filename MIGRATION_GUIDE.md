# Migration Guide: Updating to API Service Layer

This guide shows how to migrate existing frontend code to use the centralized API service.

## Before vs After Examples

### Example 1: Fetching Products

#### ❌ BEFORE (Direct fetch, scattered logic)
```javascript
// src/pages/Shop.jsx
const [products, setProducts] = useState([]);

useEffect(() => {
  Promise.all([
    fetch('/api/products').then(res => res.ok ? res.json() : []),
    Promise.resolve([]), // Mock data
    Promise.resolve([])  // Mock data
  ]).then(([prods, promos, siteArr]) => {
    setProducts(Array.isArray(prods) ? prods.map(p => ({
      ...p,
      sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : (p.sizes || []),
      colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : (p.colors || [])
    })) : []);
  });
}, []);
```

#### ✅ AFTER (Using API Service)
```javascript
// src/pages/Shop.jsx
import { productsAPI } from '@/api/apiService';

const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchProducts();
}, []);
```

### Example 2: Creating a Product

#### ❌ BEFORE (Direct fetch with manual token handling)
```javascript
// src/pages/AdminPanel.jsx
const { user } = useAuth();
const token = localStorage.getItem('token');

const saveProduct = async (data) => {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save');
    // Handle response...
  } catch (err) {
    alert('Error: ' + err.message);
  }
};
```

#### ✅ AFTER (Using API Service - token handled automatically)
```javascript
// src/pages/AdminPanel.jsx
import { productsAPI } from '@/api/apiService';

const saveProduct = async (data) => {
  try {
    const result = await productsAPI.create(data);
    // Handle success...
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
```

### Example 3: Getting User's Orders

#### ❌ BEFORE (Direct fetch, manual token)
```javascript
// src/pages/MyOrders.jsx
const token = localStorage.getItem('token');

useEffect(() => {
  if (!user) return;
  
  fetch('/api/orders/my', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.ok ? res.json() : [])
    .then(data => {
      if (Array.isArray(data)) {
        setOrders(data.map(o => ({
          ...o,
          items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
          shipping_address: typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : o.shipping_address
        })));
      }
    })
    .finally(() => setLoading(false));
}, [user, token]);
```

#### ✅ AFTER (Using API Service)
```javascript
// src/pages/MyOrders.jsx
import { ordersAPI } from '@/api/apiService';

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const data = await ordersAPI.getMyOrders();
      setOrders(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    fetchOrders();
  }
}, [user]);
```

### Example 4: Updating Order Status

#### ❌ BEFORE
```javascript
const updateStatus = async (orderId, status) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      // Refresh orders list
    }
  } catch (err) {
    console.error('Error:', err);
  }
};
```

#### ✅ AFTER
```javascript
import { ordersAPI } from '@/api/apiService';

const updateStatus = async (orderId, status) => {
  try {
    await ordersAPI.update(orderId, { status });
    // Refresh orders list
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

## Migration Checklist

### For Each Page/Component

- [ ] Import the required API service: `import { productsAPI, ordersAPI, ... } from '@/api/apiService';`
- [ ] Remove direct `fetch()` calls
- [ ] Remove manual token retrieval: `const token = localStorage.getItem('token');`
- [ ] Remove manual header construction
- [ ] Replace all API calls with appropriate service methods
- [ ] Add proper loading state management
- [ ] Add proper error handling with try-catch
- [ ] Test all functionality

### Files to Update

1. **src/pages/Shop.jsx** - Use `productsAPI`
2. **src/pages/ProductDetail.jsx** - Use `productsAPI.getById()`
3. **src/pages/Checkout.jsx** - Use `ordersAPI.create()`
4. **src/pages/MyOrders.jsx** - Use `ordersAPI.getMyOrders()`
5. **src/pages/AdminPanel.jsx** - Use `productsAPI`, `promotionsAPI`
6. **src/pages/AdminDashboard.jsx** - Use `ordersAPI.getAll()`, `ordersAPI.update()`
7. **src/pages/StoreManager.jsx** - Use `ordersAPI`
8. **src/lib/AuthContext.jsx** - Use `usersAPI.getProfile()`
9. **src/components/home/*** - Use relevant APIs as needed

## Common Migration Patterns

### Pattern 1: Simple GET Request
```javascript
// OLD
fetch('/api/products').then(r => r.json())

// NEW
import { productsAPI } from '@/api/apiService';
await productsAPI.getAll()
```

### Pattern 2: POST Request with Auth
```javascript
// OLD
fetch('/api/products', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify(data)
})

// NEW
import { productsAPI } from '@/api/apiService';
await productsAPI.create(data)
```

### Pattern 3: Error Handling
```javascript
// OLD
.then(r => r.ok ? r.json() : [])
.catch(err => console.error(err))

// NEW
try {
  const data = await productsAPI.getAll();
} catch (error) {
  console.error('Error:' error.message);
}
```

### Pattern 4: Loading State
```javascript
// OLD
// No consistent pattern

// NEW
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetch = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll();
      // use data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, []);
```

## Benefits of Migration

✅ **Centralized API management** - All API calls in one place
✅ **Automatic token handling** - No need to manually inject JWT
✅ **Consistent error handling** - All errors handled the same way
✅ **Type safety with JSDoc** - Better IntelliSense in IDE
✅ **Easier maintenance** - Change API structure in one file
✅ **Reduced duplication** - No more scattered fetch calls
✅ **Better testability** - Can mock apiService.js for tests
✅ **Improved code quality** - Cleaner, more readable components

## Testing the Migration

After migration, test these scenarios:

1. **Public endpoints** - No token required
   - Get all products
   - Get all events
   - Get all careers

2. **Authenticated endpoints** - Requires login
   - Get user profile
   - Get my orders
   - Create order

3. **Admin-only endpoints** - Requires admin role
   - Create product
   - Update product
   - Delete product

4. **Super-admin endpoints** - Requires super_admin role
   - Create site settings
   - Delete any item

5. **Error cases**
   - Network error (offline)
   - 401 Unauthorized (invalid/expired token)
   - 403 Forbidden (insufficient permissions)
   - 404 Not Found (resource doesn't exist)
   - 500 Server error (backend error)

