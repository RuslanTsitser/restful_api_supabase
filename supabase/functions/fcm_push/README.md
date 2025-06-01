# FCM Push Notification API

This module provides an API endpoint for sending Firebase Cloud Messaging (FCM) push notifications.

## Features

- Send push notifications to specific devices
- Support for notification title and body
- Support for additional data payload
- Firebase Admin SDK integration
- CORS support
- Error handling

## Setup

1. Place your Firebase service account credentials in `supabase/functions/service-account.json`:
   ```json
   {
     "type": "service_account",
     "project_id": "your-project-id",
     "private_key_id": "your-private-key-id",
     "private_key": "your-private-key",
     "client_email": "your-client-email",
     "client_id": "your-client-id",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
     "client_x509_cert_url": "your-cert-url"
   }
   ```

## API Endpoint

### Send Push Notification

- **Endpoint**: `/fcm_push`
- **Method**: POST
- **Body**:

  ```json
  {
    "message": {
      "token": "your_device_fcm_token",
      "notification": {
        "title": "Notification Title",
        "body": "Notification Body"
      },
      "data": {
        "key1": "value1",
        "key2": "value2"
      }
    }
  }
  ```
- **Response**:

  ```json
  {
    "name": "projects/your-project-id/messages/message-id"
  }
  ```

## Example Usage

### cURL

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/fcm_push' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": {
      "token": "fjlLp1szJkMyjvwS0E8YC5:APA91bEn4npYJ_G1nJGcqmUqdtoD0amdgrhnE82Y19Ds3coKQCkmlYzpDypKnu7zMRz4Gls1rkvYoikjuaffDTr8Z7iVbA0rgedvx7T46-bGUoLeotr52x4",
      "notification": {
        "title": "Hello",
        "body": "This is a test notification"
      },
      "data": {
        "hello": "world"
      }
    }
  }'
```

### JavaScript/TypeScript

```typescript
const sendPushNotification = async (fcmToken: string, title: string, body: string, data?: Record<string, string>) => {
  const response = await fetch('https://your-project.supabase.co/functions/v1/fcm_push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: {
        token: fcmToken,
        notification: {
          title,
          body,
        },
        data: data || {},
      },
    }),
  });

  const responseData = await response.json();
  return responseData;
};

// Usage
await sendPushNotification(
  'fjlLp1szJkMyjvwS0E8YC5:APA91bEn4npYJ_G1nJGcqmUqdtoD0amdgrhnE82Y19Ds3coKQCkmlYzpDypKnu7zMRz4Gls1rkvYoikjuaffDTr8Z7iVbA0rgedvx7T46-bGUoLeotr52x4',
  'Hello',
  'This is a test notification',
  { hello: 'world' }
);
```

### Python

```python
import requests

def send_push_notification(fcm_token: str, title: str, body: str, data: dict = None):
    response = requests.post(
        'https://your-project.supabase.co/functions/v1/fcm_push',
        json={
            'message': {
                'token': fcm_token,
                'notification': {
                    'title': title,
                    'body': body,
                },
                'data': data or {},
            }
        }
    )
    return response.json()

# Usage
send_push_notification(
    'fjlLp1szJkMyjvwS0E8YC5:APA91bEn4npYJ_G1nJGcqmUqdtoD0amdgrhnE82Y19Ds3coKQCkmlYzpDypKnu7zMRz4Gls1rkvYoikjuaffDTr8Z7iVbA0rgedvx7T46-bGUoLeotr52x4',
    'Hello',
    'This is a test notification',
    {'hello': 'world'}
)
```

## Error Handling

The API includes error handling for:

- Missing required fields
- Invalid FCM token
- Firebase authentication errors
- Server errors

## CORS Support

The API includes CORS headers to allow cross-origin requests:

- Access-Control-Allow-Origin: *
- Access-Control-Allow-Headers: authorization, x-client-info, apikey
- Access-Control-Allow-Methods: POST, GET, OPTIONS
