# Authentication API

This module provides authentication endpoints using Supabase Edge Functions. It handles user registration and login functionality.

## Features

- User registration (Sign Up)
- User authentication (Sign In)
- JWT token-based authentication
- CORS support
- Error handling

## API Endpoints

### Sign Up

- **Endpoint**: `/auth/sign-up`
- **Method**: POST
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_access_token"
  }
  ```

### Sign In

- **Endpoint**: `/auth/sign-in`
- **Method**: POST
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_access_token"
  }
  ```

## Authentication Flow

1. User registers using the sign-up endpoint
2. User receives a JWT token upon successful registration
3. User can sign in using the sign-in endpoint
4. JWT token is used for subsequent authenticated requests

## Error Handling

The API includes error handling for:

- Invalid authentication methods
- Authentication failures
- Invalid requests
- Server errors

## CORS Support

The API includes CORS headers to allow cross-origin requests:

- Access-Control-Allow-Origin: *
- Access-Control-Allow-Headers: authorization, x-client-info, apikey
- Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE
