# Supabase to Local JSON Sync System

This system automatically synchronizes changes made in the admin panel (stored in Supabase) with local JSON files, ensuring your static assets stay up-to-date.

## How It Works

### Architecture Overview

1. **Admin Changes**: When admins modify store settings or products through the admin panel
2. **Supabase Update**: Changes are saved to Supabase database
3. **Local Sync**: A sync service automatically updates corresponding local JSON files
4. **Real-time Updates**: Real-time listeners detect changes and trigger immediate sync

### Components

#### 1. Sync Service (`src/lib/sync-service.ts`)
- **Real-time Listeners**: Monitors Supabase for changes using real-time subscriptions
- **API Calls**: Makes HTTP requests to update local JSON files
- **Enhanced CRUD Functions**: Wraps standard database operations with sync functionality

#### 2. Development Server (`server.js`)
- **API Endpoints**: Provides `/api/update-store-settings` and `/api/update-products`
- **File Operations**: Handles writing updated data to local JSON files
- **CORS Support**: Enables cross-origin requests from the main application

#### 3. Updated Admin Components
- **Products Admin**: Uses sync-enabled CRUD operations
- **Store Settings Context**: Includes real-time sync setup

## Setup Instructions

### 1. Install Dependencies
```bash
pnpm add express cors concurrently
```

### 2. Start Development Servers

**Option A: Start both servers together**
```bash
npm run dev:full
```

**Option B: Start servers separately**
```bash
# Terminal 1: Main application
npm run dev

# Terminal 2: Sync API server
npm run dev:sync
```

### 3. Verify Setup

1. **Check Sync Server**: Visit `http://localhost:3001/api/health`
2. **Check Main App**: Visit `http://localhost:5174`
3. **Test Sync**: Make changes in admin panel and check console logs

## Usage

### Making Admin Changes

1. **Navigate to Admin Panel**: Go to `/admin/products` or settings pages
2. **Make Changes**: Add, edit, or delete products/settings
3. **Automatic Sync**: Changes are automatically synced to local files
4. **Verify Updates**: Check `src/assets/data/` for updated JSON files

### Monitoring Sync Activity

- **Browser Console**: Shows sync API calls and responses
- **Sync Server Logs**: Terminal running `npm run dev:sync` shows file updates
- **Network Tab**: Monitor API calls to `localhost:3001`

## File Structure

```
src/assets/data/
├── store-settings.json    # Store configuration and branding
└── products.json          # Product catalog data
```

## API Endpoints

### Store Settings Sync
```http
POST http://localhost:3001/api/update-store-settings
Content-Type: application/json

{
  "store_name": "My Store",
  "theme_primary_color": "#3b82f6",
  // ... other settings
}
```

### Products Sync
```http
POST http://localhost:3001/api/update-products
Content-Type: application/json

[
  {
    "id": "product-1",
    "name": "Product Name",
    "price": 29.99,
    // ... other product fields
  }
]
```

### Health Check
```http
GET http://localhost:3001/api/health
```

## Real-time Features

### Automatic Detection
- **Database Changes**: Listens for INSERT, UPDATE, DELETE operations
- **Immediate Sync**: Updates local files within seconds of changes
- **Error Handling**: Gracefully handles API failures without breaking admin functionality

### Supported Operations
- ✅ **Create Product**: `createProductWithSync()`
- ✅ **Update Product**: `updateProductWithSync()`
- ✅ **Delete Product**: `deleteProductWithSync()`
- ✅ **Update Store Settings**: `updateStoreSettingsWithSync()`

## Troubleshooting

### Common Issues

#### Sync Server Not Running
**Symptoms**: API calls fail, no local file updates
**Solution**: Start sync server with `npm run dev:sync`

#### Port Conflicts
**Symptoms**: Server fails to start on port 3001
**Solution**: Change port in `server.js` and update `sync-service.ts`

#### File Permission Errors
**Symptoms**: "EACCES" or "EPERM" errors in sync server logs
**Solution**: Check file/directory permissions for `src/assets/data/`

#### Real-time Not Working
**Symptoms**: Changes don't sync automatically
**Solution**: Check Supabase real-time configuration and network connectivity

### Debug Mode

Enable detailed logging by checking browser console and sync server terminal:

```javascript
// In browser console
console.log('Sync service loaded:', window.syncService);
```

## Production Deployment

### Static Site Deployment
For production, you'll need to:

1. **Build Process Integration**: Add sync to your CI/CD pipeline
2. **Webhook Setup**: Configure Supabase webhooks to trigger rebuilds
3. **API Gateway**: Replace development server with production API

### Example Webhook Handler
```javascript
// Netlify/Vercel function example
export default async function handler(req, res) {
  // Validate webhook signature
  // Update JSON files
  // Trigger site rebuild
}
```

## Security Considerations

- **Development Only**: Current setup is for development environments
- **Authentication**: Production should include proper API authentication
- **Validation**: Implement data validation before file updates
- **Rate Limiting**: Add rate limiting to prevent abuse

## Contributing

When modifying the sync system:

1. **Test Locally**: Verify both servers work together
2. **Error Handling**: Ensure graceful degradation if sync fails
3. **Documentation**: Update this file with any changes
4. **Backwards Compatibility**: Maintain compatibility with existing data

---

**Note**: This sync system ensures your local JSON files stay current with admin changes, enabling a hybrid approach where you get the benefits of both dynamic admin management and static site performance.