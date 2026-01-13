# FaultFrame Demo

Interactive demo application for testing FaultFrame error overlay.

## Quick Start

### Option 1: With Local PHP Server (Recommended)

```bash
cd demo

# Install dependencies
yarn install

# Start both PHP server and Vite dev server
yarn dev:full
```

This will start:
- PHP server at `http://localhost:8000` (serves error scripts)
- Vite dev server at `http://localhost:3000` (demo app)

### Option 2: PHP Server Only

```bash
cd demo

# Start PHP server
yarn server
```

Then in another terminal:
```bash
cd demo
yarn dev
```

### Option 3: Custom API URL

Create `.env` file in `demo/` folder:
```env
VITE_API_URL=https://your-domain.com/fault-frame-demo
```

Then run:
```bash
yarn dev
```

The demo will open at `http://localhost:3000`

## What's included

- **Axios Error Testing**: Trigger 400, 404, 500 errors
- **Fetch API Testing**: Test Fetch wrapper with errors
- **Network Errors**: Simulate network failures
- **Debug Logs Toggle**: Enable/disable FaultFrameLogger
- **Live Error Overlay**: See FaultFrame in action

## Features Demonstrated

### Axios Interceptor
- Automatic error interception
- Request/Response details capture
- Stack trace parsing
- Toast notifications

### Fetch API Wrapper
- Manual wrapper usage with `createFetchWithFaultFrame()`
- JSON/Text response parsing
- Headers and body capture
- Network error handling

### UI Components
- Beautiful Vite-style error overlay
- Collapsible request details
- Syntax-highlighted stack traces
- Toast notifications with auto-hide

## Project Structure

```
demo/
├── index.html           # Main HTML file
├── src/
│   └── main.ts          # Demo application logic
├── package.json         # Demo dependencies (private)
├── tsconfig.json        # TypeScript config
└── vite.config.ts       # Vite configuration
```

## How it works

1. **Local Dependency**: Demo uses `"fault-frame": "file:.."` to test the library locally
2. **Isolated**: Has its own `node_modules` and dependencies
3. **Not Published**: Excluded from npm via `.npmignore`

## Testing Different Scenarios

### 500 Server Error
```typescript
await axios.get('https://httpbin.org/status/500');
```

### 400 Validation Error
```typescript
await axios.post('https://httpbin.org/status/400', {
  name: '',
  email: 'invalid'
});
```

### Network Error
```typescript
await axios.get('https://invalid-domain-12345.com/api');
```

### Fetch API Error
```typescript
const fetchWithErrors = createFetchWithFaultFrame(FaultFrame.getInstance());
await fetchWithErrors('https://httpbin.org/status/500');
```

## Debugging

Enable debug logs to see detailed information:

```typescript
import { FaultFrameLogger } from 'fault-frame';

FaultFrameLogger.setEnabled(true);
```

Or use the checkbox in the demo UI.

## Notes

- Demo uses httpbin.org for testing (requires internet)
- All errors are intentional for demonstration
- Check browser console for detailed logs
- Toast duration is 10 seconds for easier testing
