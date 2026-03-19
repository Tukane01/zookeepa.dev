# Frontend API Service Usage Guide

## Quick Start

Import the API service in any React component:

```javascript
import { productsAPI, ordersAPI, careersAPI } from '@/api/apiService';
```

## API Service Namespaces & Methods

### Auth API
```javascript
import { authAPI } from '@/api/apiService';

// Login
await authAPI.login(email, password);
```

### Users API
```javascript
import { usersAPI } from '@/api/apiService';

// Get current user profile
const profile = await usersAPI.getProfile();

// Update current user profile
await usersAPI.updateProfile({ full_name: 'John Doe', phone: '+1234567890' });

// Get all users (admin only)
const allUsers = await usersAPI.getAllUsers();
```

### Products API
```javascript
import { productsAPI } from '@/api/apiService';

// Get all products (public)
const products = await productsAPI.getAll();

// Get specific product (public)
const product = await productsAPI.getById(1);

// Create product (admin only)
await productsAPI.create({
  name: 'Product Name',
  description: 'Description',
  price: 99.99,
  category: 'tops',
  sizes: ['S', 'M', 'L'],
  colors: ['red', 'blue'],
  image_url: 'https://...',
  stock: 50,
  is_featured: true
});

// Update product (admin only)
await productsAPI.update(1, { price: 89.99, stock: 45 });

// Delete product (super_admin only)
await productsAPI.delete(1);
```

### Orders API
```javascript
import { ordersAPI } from '@/api/apiService';

// Get all orders (admin only)
const allOrders = await ordersAPI.getAll();

// Get current user's orders
const myOrders = await ordersAPI.getMyOrders();

// Get specific order (admin only)
const order = await ordersAPI.getById(1);

// Create order (authenticated)
await ordersAPI.create({
  order_number: 'ZK-123456',
  customer_email: 'user@example.com',
  customer_name: 'John Doe',
  items: [
    { product_id: 1, quantity: 2, price: 99.99, size: 'M', color: 'red' }
  ],
  total_amount: 199.98,
  shipping_address: {
    street: '123 Main St',
    city: 'City',
    state: 'State',
    zip_code: '12345',
    country: 'Country'
  },
  phone: '+1234567890'
});

// Update order status (admin only)
await ordersAPI.update(1, { status: 'shipped' });
```

### Careers API
```javascript
import { careersAPI } from '@/api/apiService';

// Get all open careers (public)
const careers = await careersAPI.getAll();

// Get specific career (public)
const career = await careersAPI.getById(1);

// Create career (admin only)
await careersAPI.create({
  title: 'Product Manager',
  department: 'Product',
  type: 'Full-time',
  location: 'Cape Town',
  description: 'We are looking for...',
  is_open: true
});

// Update career (admin only)
await careersAPI.update(1, { is_open: false });

// Delete career (super_admin only)
await careersAPI.delete(1);
```

### Events API
```javascript
import { eventsAPI } from '@/api/apiService';

// Get all events (public)
const events = await eventsAPI.getAll();

// Get specific event (public)
const event = await eventsAPI.getById(1);

// Create event (admin only)
await eventsAPI.create({
  title: 'Product Launch',
  description: 'Join us for an exciting launch event',
  date: '2026-04-15',
  location: 'Cape Town',
  image_url: 'https://...'
});

// Update event (admin only)
await eventsAPI.update(1, { date: '2026-04-20' });

// Delete event (super_admin only)
await eventsAPI.delete(1);
```

### Gallery API
```javascript
import { galleryAPI } from '@/api/apiService';

// Get all gallery items (public)
const items = await galleryAPI.getAll();

// Get specific item (public)
const item = await galleryAPI.getById(1);

// Create gallery item (admin only)
await galleryAPI.create({
  image_url: 'https://...',
  caption: 'Image caption',
  category: 'photography',
  sort_order: 1
});

// Update gallery item (admin only)
await galleryAPI.update(1, { caption: 'New caption' });

// Delete gallery item (super_admin only)
await galleryAPI.delete(1);
```

### Partners API
```javascript
import { partnersAPI } from '@/api/apiService';

// Get all partners (public)
const partners = await partnersAPI.getAll();

// Get specific partner (public)
const partner = await partnersAPI.getById(1);

// Create partner (admin only)
await partnersAPI.create({
  name: 'Partner Name',
  logo_url: 'https://...',
  website_url: 'https://partner.com',
  description: 'Partnership description'
});

// Update partner (admin only)
await partnersAPI.update(1, { name: 'Updated Name' });

// Delete partner (super_admin only)
await partnersAPI.delete(1);
```

### Team API
```javascript
import { teamAPI } from '@/api/apiService';

// Get all team members (public)
const team = await teamAPI.getAll();

// Get specific team member (public)
const member = await teamAPI.getById(1);

// Create team member (admin only)
await teamAPI.create({
  name: 'John Smith',
  role: 'CEO',
  bio: 'Bio information',
  image_url: 'https://...',
  sort_order: 1
});

// Update team member (admin only)
await teamAPI.update(1, { bio: 'Updated bio' });

// Delete team member (super_admin only)
await teamAPI.delete(1);
```

### Promotions API
```javascript
import { promotionsAPI } from '@/api/apiService';

// Get all active promotions (public)
const promos = await promotionsAPI.getAll();

// Get specific promotion (public)
const promo = await promotionsAPI.getById(1);

// Create promotion (admin only)
await promotionsAPI.create({
  title: 'Summer Sale',
  message: '50% off all items',
  type: 'sale', // 'announcement', 'competition', 'sale', 'new_arrival'
  is_active: true,
  background_color: '#D4AF37',
  text_color: '#1a1a1a',
  cta_text: 'Shop Now',
  sort_order: 1
});

// Update promotion (admin only)
await promotionsAPI.update(1, { is_active: false });

// Delete promotion (super_admin only)
await promotionsAPI.delete(1);
```

### Site Settings API
```javascript
import { siteSettingsAPI } from '@/api/apiService';

// Get site settings (public)
const settings = await siteSettingsAPI.getAll();

// Get specific setting (public)
const setting = await siteSettingsAPI.getById(1);

// Create settings (super_admin only)
await siteSettingsAPI.create({
  hero_image_url: 'https://...',
  hero_images: ['https://...', 'https://...'],
  hero_title: 'Welcome to Zookeepa',
  hero_subtitle: 'Premium clothing for wildlife lovers',
  hero_cta_text: 'Shop Now',
  contact_address: '123 Main St',
  contact_city: 'Cape Town',
  contact_province: 'Western Cape',
  contact_zip: '8000',
  contact_country: 'South Africa',
  contact_phone: '+27 21 123 4567',
  contact_email: 'info@zookeepa.com',
  contact_hours: 'Mon-Fri: 9AM-6PM',
  map_lat: -33.9249,
  map_lng: 18.4241
});

// Update settings (super_admin only)
await siteSettingsAPI.update(1, { 
  hero_title: 'New Title' 
});
```

## Error Handling

All API calls throw errors. Always wrap in try-catch:

```javascript
try {
  const products = await productsAPI.getAll();
  // Use products...
} catch (error) {
  console.error('Failed to fetch products:', error.message);
  // Show error to user
}
```

## Authentication

JWT tokens are automatically handled by the service:
- Token is retrieved from `localStorage`
- Token is automatically added to all requests
- If token is missing on an API call, the request is made without it (for public endpoints)

## Loading States in Components

```javascript
import { useState, useEffect } from 'react';
import { productsAPI } from '@/api/apiService';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getAll();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (products.length === 0) return <div>No products found</div>;

  return (
    <div>
      {products.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}
```

## Important Notes

✅ **Always use apiService.js** - Never call `/api/...` directly with fetch()
✅ **All logic on backend** - Backend handles validation, auth, database operations
✅ **Frontend is thin client** - Frontend only handles UI and presentation
✅ **Error handling** - Always wrap API calls in try-catch
✅ **Loading states** - Always show loading indicators while fetching

