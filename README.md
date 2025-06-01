# RESTful API with Supabase

This project implements a RESTful API using Supabase Edge Functions. It provides authentication, task management, and Firebase integration functionality.

## Project Structure

```
.
├── supabase/
│   ├── functions/
│   │   ├── auth/          # Authentication endpoints
│   │   │   ├── index.ts
│   │   │   ├── README.md
│   │   │   └── run.sh     # Local development script
│   │   ├── tasks/         # Task management endpoints
│   │   │   ├── index.ts
│   │   │   ├── README.md
│   │   │   └── run.sh     # Local development script
│   │   └── fcm_push/      # Firebase Cloud Messaging
│   │       ├── index.ts
│   │       └── README.md
│   └── config.toml        # Supabase configuration
```

## Modules

- [Authentication API](supabase/functions/auth/README.md) - User registration and login functionality
- [Tasks API](supabase/functions/tasks/README.md) - Task management with CRUD operations
- [FCM Push API](supabase/functions/fcm_push/README.md) - Firebase Cloud Messaging push notifications

## Setup

1. Install Supabase CLI:

   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase project:

   ```bash
   supabase init
   ```

3. Start the local development environment:

   ```bash
   supabase start
   ```

4. Deploy Edge Functions:

   ```bash
   supabase functions deploy auth
   supabase functions deploy tasks
   supabase functions deploy fcm_push
   ```

## Local Development

Each module contains a `run.sh` script for local development:

- `supabase/functions/auth/run.sh` - Runs the authentication service locally
- `supabase/functions/tasks/run.sh` - Runs the tasks service locally

These scripts start the Edge Functions in development mode with JWT verification disabled and load environment variables from `supabase/functions/.env`.

To run a service locally:

```bash
cd supabase/functions/auth  # or tasks
./run.sh
```

## Environment Variables

The following environment variables are required:

### Supabase

- `URL`: Supabase project URL
- `ANON_KEY`: Supabase anonymous key

## Development Stack

- TypeScript
- Deno runtime
- Supabase Edge Functions
- Supabase Auth
- Firebase Admin SDK

## Error Handling

The API includes comprehensive error handling for:

- Invalid authentication methods
- Authentication failures
- Invalid requests
- Server errors

## CORS Support

The API includes CORS headers to allow cross-origin requests from any domain. The following headers are set:

- Access-Control-Allow-Origin: *
- Access-Control-Allow-Headers: authorization, x-client-info, apikey
- Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE

## License

[Add your license here]
