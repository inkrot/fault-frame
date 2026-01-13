# Demo Server Scripts

PHP scripts for testing FaultFrame with real server responses.

## Setup

Upload these files to your web server and configure CORS headers if needed.

### Apache (.htaccess)

```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type"
</IfModule>
```

### Nginx

```nginx
add_header Access-Control-Allow-Origin *;
add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
add_header Access-Control-Allow-Headers 'Content-Type';
```

## Endpoints

### error-500.php
Symfony 500 server error with full stack trace.

**Response:**
```json
{
  "type": "https://tools.ietf.org/html/rfc2616#section-10",
  "title": "An error occurred",
  "status": 500,
  "detail": "Warning: mkdir(): Permission denied",
  "class": "ErrorException",
  "trace": [...]
}
```

### error-400.php
Symfony 400 validation error.

**Response:**
```json
{
  "status": 400,
  "detail": "name: This value should not be blank.",
  "violations": [...]
}
```

### error-404.php
Symfony 404 not found error.

**Response:**
```json
{
  "status": 404,
  "detail": "No route found for \"GET /api/users/999\""
}
```

### error-simple.php
Simple error without stack trace (generic API format).

**Response:**
```json
{
  "success": false,
  "error": "Message text or files are required"
}
```

## Usage in Demo

Update `demo/src/main.ts` to use your server URL:

```typescript
const API_URL = 'https://your-domain.com/fault-frame-demo';

handleButtonClick('trigger-500', async () => {
  await axios.get(`${API_URL}/error-500.php`);
});
```

## Testing Locally

If you have PHP installed locally:

```bash
cd demo/server
php -S localhost:8000
```

Then use:
```typescript
const API_URL = 'http://localhost:8000';
```

## CORS Issues?

If you get CORS errors, the headers are already included in each PHP file. Make sure your server allows them.

For development, you can also use a CORS proxy:
```typescript
const PROXY = 'https://cors-anywhere.herokuapp.com/';
const API_URL = PROXY + 'https://your-domain.com/fault-frame-demo';
```
