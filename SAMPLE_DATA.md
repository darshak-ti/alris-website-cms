# Sample Data Structure

This document shows example data structures that work well with the Supabase integration.

## Example 1: Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  age INTEGER,
  is_active BOOLEAN DEFAULT true,
  role TEXT DEFAULT 'user',
  metadata JSONB,
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

Sample data:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "is_active": true,
    "role": "admin",
    "metadata": {
      "department": "Engineering",
      "location": "New York",
      "skills": ["JavaScript", "React", "Node.js"]
    },
    "preferences": {
      "theme": "dark",
      "notifications": true,
      "language": "en"
    },
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": 25,
    "is_active": true,
    "role": "user",
    "metadata": {
      "department": "Marketing",
      "location": "Los Angeles"
    },
    "preferences": {
      "theme": "light",
      "notifications": false,
      "language": "en"
    },
    "created_at": "2024-01-16T14:20:00Z",
    "updated_at": "2024-01-16T14:20:00Z"
  }
]
```

## Example 2: Products Table

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  tags TEXT[],
  specifications JSONB,
  images TEXT[],
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

Sample data:
```json
[
  {
    "id": 1,
    "name": "Wireless Headphones",
    "description": "High-quality wireless headphones with noise cancellation",
    "price": 199.99,
    "category": "Electronics",
    "tags": ["wireless", "bluetooth", "noise-cancelling"],
    "specifications": {
      "brand": "TechAudio",
      "model": "WH-1000XM4",
      "battery_life": "30 hours",
      "connectivity": "Bluetooth 5.0",
      "features": ["Noise Cancellation", "Touch Controls", "Voice Assistant"]
    },
    "images": [
      "https://example.com/headphones-1.jpg",
      "https://example.com/headphones-2.jpg"
    ],
    "in_stock": true,
    "stock_quantity": 50,
    "created_at": "2024-01-10T09:00:00Z",
    "updated_at": "2024-01-15T16:30:00Z"
  },
  {
    "id": 2,
    "name": "Smart Watch",
    "description": "Fitness tracking smartwatch with heart rate monitor",
    "price": 299.99,
    "category": "Wearables",
    "tags": ["fitness", "smartwatch", "health"],
    "specifications": {
      "brand": "FitTech",
      "model": "FW-200",
      "battery_life": "7 days",
      "water_resistant": true,
      "features": ["Heart Rate Monitor", "GPS", "Sleep Tracking"]
    },
    "images": [
      "https://example.com/smartwatch-1.jpg"
    ],
    "in_stock": false,
    "stock_quantity": 0,
    "created_at": "2024-01-12T11:15:00Z",
    "updated_at": "2024-01-14T10:45:00Z"
  }
]
```

## Example 3: Orders Table

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_id INTEGER REFERENCES users(id),
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  payment_info JSONB,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

Sample data:
```json
[
  {
    "id": 1,
    "order_number": "ORD-2024-001",
    "customer_id": 1,
    "items": [
      {
        "product_id": 1,
        "name": "Wireless Headphones",
        "quantity": 1,
        "price": 199.99
      }
    ],
    "total_amount": 199.99,
    "status": "completed",
    "shipping_address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "USA"
    },
    "payment_info": {
      "method": "credit_card",
      "last4": "1234",
      "status": "paid"
    },
    "notes": "Please deliver during business hours",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-16T14:20:00Z"
  }
]
```

## How the System Handles Different Data Types

### String Fields
- Displayed as plain text
- Searchable
- Sortable

### Integer/Decimal Fields
- Displayed as numbers
- Decimals are formatted to 2 decimal places
- Searchable and sortable

### Boolean Fields
- Displayed as "Yes/No" chips
- Green for true, red for false
- Not searchable or sortable

### DateTime Fields
- Automatically detected from ISO date strings
- Displayed in local format
- Sortable

### JSON Fields
- Displayed as formatted text with "See more" button
- Click "See more" to view full JSON in a dialog
- Not searchable or sortable

### Array Fields
- Displayed as "first item and X more" or "X items"
- Click "See more" to view full array in a dialog
- Not searchable or sortable

## Navigation

To view these tables, navigate to:
- `/users` - displays the users table
- `/products` - displays the products table  
- `/orders` - displays the orders table

The system will automatically:
1. Detect all columns and their data types
2. Generate appropriate column headers
3. Format data for display
4. Provide search, sort, and pagination functionality 