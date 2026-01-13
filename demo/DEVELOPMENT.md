# Demo Development Guide

## Quick Commands

```bash
# From project root
yarn demo              # Build lib + install deps + run dev server
yarn demo:dev          # Just run dev server
yarn demo:build        # Build demo for production
```

## Development Workflow

1. Edit source in `src/`
2. Build library: `yarn build`
3. Run demo: `yarn demo:dev`
4. Test in browser: `http://localhost:3131`

## Debugging

Enable debug logs in browser console:
```javascript
FaultFrameLogger.setEnabled(true);
```

## Common Issues

### Changes not reflected in demo

```bash
# Rebuild library
yarn build

# Reinstall demo dependencies
cd demo
yarn install --force

# Clear Vite cache
rm -rf node_modules/.vite
```

### "Cannot find module 'fault-frame'"

```bash
yarn demo:install
```

### Port already in use

Change port in `demo/vite.config.ts`
