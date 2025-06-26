# Supabase Integration Setup

This project has been updated to work with Supabase for dynamic CMS functionality. The system automatically detects data types and generates columns based on the actual data structure.

## Setup Instructions

### 1. Install Supabase Client
The Supabase client has already been installed:
```bash
npm install @supabase/supabase-js
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Get Your Supabase Credentials
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key
4. Paste them in your `.env` file

## How It Works

### Automatic Data Type Detection
The system automatically detects data types from your Supabase data:
- **string**: Regular text fields
- **integer**: Whole numbers
- **decimal**: Numbers with decimal points
- **boolean**: True/false values
- **datetime**: Date and time values
- **json**: JSON objects
- **array**: Array values

### Dynamic Column Generation
Columns are generated automatically based on the data structure:
- No need for predefined column configurations
- Automatically formats column headers (e.g., "user_name" becomes "User Name")
- Handles nested JSON objects and arrays
- Provides "See more" functionality for complex data

### Features
- **Pagination**: Built-in pagination support
- **Search**: Search across string and integer columns
- **Sorting**: Sort by any column
- **JSON Viewer**: Click "See more" to view full JSON data
- **Responsive**: Works on all screen sizes

## Usage

### Accessing Tables
Navigate to `/{table_name}` where `table_name` is your Supabase table name.

Example:
- `/users` - displays the users table
- `/products` - displays the products table
- `/orders` - displays the orders table

### Ignored Fields
The following fields are automatically ignored and won't appear in the table:
- `id` (primary key)
- `created_at`
- `updated_at`
- Any field starting with `_`

### Customizing Ignored Fields
You can modify the `ignoreData` array in `src/views/dynamicCMS/TableList.jsx`:

```javascript
const ignoreData = ['id', 'created_at', 'updated_at', 'your_custom_field'];
```

## API Integration

The system uses Supabase's built-in features:
- **Select**: Fetches all columns with count
- **Search**: Uses `.ilike` for case-insensitive search
- **Sort**: Uses `.order()` for sorting
- **Pagination**: Uses `.range()` for pagination

## Error Handling
- Graceful handling of connection errors
- Empty state when no data is available
- Console logging for debugging

## Security
- Uses Supabase's Row Level Security (RLS)
- Only uses the anon key (public access)
- Configure RLS policies in your Supabase dashboard for proper security

## Example Table Structure
Your Supabase table should have a structure like this:

```sql
CREATE TABLE example_table (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  age INTEGER,
  is_active BOOLEAN,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

The system will automatically detect and display all fields except the ignored ones. 