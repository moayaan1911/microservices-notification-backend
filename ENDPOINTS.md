<!-- @format -->

# API Endpoints

## Authentication

### Register User

- **Method:** POST
- **Path:** `/api/auth/register`
- **Description:** Register a new user
- **Request Body:**
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Response:** (201 Created)
  ```json
  {
    "message": "User registered successfully"
  }
  ```

### Login User

- **Method:** POST
- **Path:** `/api/auth/login`
- **Description:** Login a user
- **Request Body:**
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Response:** (200 OK)
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Get All Users

- **Method:** GET
- **Path:** `/api/auth/users`
- **Description:** Get all users (requires authentication)
- **Headers:**
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Response:** (200 OK)
  ```json
  [
    {
      "id": "user1",
      "username": "testuser1",
      "email": "test1@example.com"
    },
    {
      "id": "user2",
      "username": "testuser2",
      "email": "test2@example.com"
    }
  ]
  ```

## Notifications

### Create Notification

- **Method:** POST
- **Path:** `/api/notifications`
- **Description:** Create a new notification
- **Headers:**
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Request Body:**
  ```json
  {
    "userId": "user1",
    "message": "This is a test notification"
  }
  ```
- **Response:** (201 Created)
  ```json
  {
    "message": "Notification created successfully"
  }
  ```

### Get All Notifications

- **Method:** GET
- **Path:** `/api/notifications/all`
- **Description:** Get all notifications
- **Headers:**
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Response:** (200 OK)
  ```json
  [
    {
      "id": "notif1",
      "userId": "user1",
      "message": "Test notification 1",
      "read": false,
      "createdAt": "2023-07-07T12:00:00.000Z"
    },
    {
      "id": "notif2",
      "userId": "user2",
      "message": "Test notification 2",
      "read": true,
      "createdAt": "2023-07-07T13:00:00.000Z"
    }
  ]
  ```

### Get User's Notifications

- **Method:** GET
- **Path:** `/api/notifications?userId=user1`
- **Description:** Get notifications for a specific user
- **Headers:**
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Response:** (200 OK)
  ```json
  [
    {
      "id": "notif1",
      "userId": "user1",
      "message": "Test notification 1",
      "read": false,
      "createdAt": "2023-07-07T12:00:00.000Z"
    }
  ]
  ```

### Get Specific Notification

- **Method:** GET
- **Path:** `/api/notifications/:id`
- **Description:** Get a specific notification by ID
- **Headers:**
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Response:** (200 OK)
  ```json
  {
    "id": "notif1",
    "userId": "user1",
    "message": "Test notification 1",
    "read": false,
    "createdAt": "2023-07-07T12:00:00.000Z"
  }
  ```

### Mark Notification as Read

- **Method:** PUT
- **Path:** `/api/notifications/:id`
- **Description:** Mark a specific notification as read
- **Headers:**
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Response:** (200 OK)
  ```json
  {
    "message": "Notification marked as read"
  }
  ```

## WebSocket Connection

To receive real-time notifications, connect to the WebSocket server:

- **WebSocket URL:** `ws://localhost:3000` (adjust hostname and port as necessary)
- **Authentication:** Send the JWT token in the connection request

Once connected, you will receive real-time notifications in the following format:

```json
{
  "id": "notif3",
  "userId": "user1",
  "message": "New real-time notification",
  "read": false,
  "createdAt": "2023-07-07T14:30:00.000Z"
}
```
