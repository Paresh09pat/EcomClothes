# API Endpoints Documentation

## User Profile Update Endpoint

### PUT `/v1/user/update-profile`

**Description:** Update user profile information (email and phone)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "1234567890"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "1234567890",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (Error - 400/401/500):**
```json
{
  "success": false,
  "message": "Error message here"
}
```

**Validation Rules:**
- Name must be at least 2 characters long and contain only letters and spaces
- Phone must be exactly 10 digits
- Both fields are optional (can update one at a time)

## Implementation Notes

The frontend is now ready to handle profile updates. The backend needs to implement the `/v1/user/update-profile` endpoint to:

1. Validate the JWT token
2. Validate name format (if provided) - at least 2 characters, letters and spaces only
3. Validate phone format (if provided) - exactly 10 digits
4. Update the user document in the database
5. Return the updated user data

The endpoint should support partial updates (updating only name or only phone). 