# API Structure for Future Next.js Integration

This document outlines the API endpoints that would be implemented when migrating to Next.js.

## API Routes Structure

### 1. Vegetables API

#### `POST /api/vegetables` - Add Vegetable
```javascript
// Request Body
{
  "name": "Fresh Tomatoes",
  "weightUnit": "250g",
  "imageFile": "File object"
}

// Response
{
  "success": true,
  "vegetable": {
    "id": "1234567890",
    "name": "Fresh Tomatoes",
    "weightUnit": "250g",
    "imageUrl": "/uploads/tomatoes-123.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### `GET /api/vegetables` - Get All Vegetables
```javascript
// Response
{
  "success": true,
  "vegetables": [
    {
      "id": "1234567890",
      "name": "Fresh Tomatoes",
      "weightUnit": "250g",
      "imageUrl": "/uploads/tomatoes-123.jpg",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### `DELETE /api/vegetables/[id]` - Delete Vegetable
```javascript
// Response
{
  "success": true,
  "message": "Vegetable deleted successfully"
}
```

### 2. File Upload

#### `POST /api/upload` - Upload Image
```javascript
// Request: FormData with image file
// Response
{
  "success": true,
  "imageUrl": "/uploads/filename.jpg"
}
```

## Database Schema (Prisma)

```prisma
model Vegetable {
  id          String   @id @default(cuid())
  name        String
  weightUnit  String
  imageUrl    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Implementation Notes

1. **File Storage**: Images stored in `/public/uploads/` folder
2. **Database**: SQLite with Prisma ORM
3. **Authentication**: JWT tokens for admin access
4. **Validation**: Server-side validation for all inputs
5. **Error Handling**: Consistent error response format

## Migration Steps

1. Install Next.js and Prisma
2. Create API routes
3. Set up database
4. Update frontend to use API calls
5. Implement proper file upload handling
6. Add authentication middleware


