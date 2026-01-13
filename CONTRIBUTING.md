# Contributing to FaultFrame

Thank you for your interest in contributing to FaultFrame!

## Getting Started

### Prerequisites

- Node.js 16+
- Yarn

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/fault-frame.git
cd fault-frame

# Install dependencies
yarn install

# Build library
yarn build

# Run demo
yarn demo
```

## Development Workflow

1. Make changes in `src/`
2. Build: `yarn build`
3. Test in demo: `cd demo && yarn install --force && yarn dev`
4. Create a pull request

## Project Structure

```
src/           # Library source code
demo/          # Demo application
dist/          # Build output
```

## Pull Request Guidelines

- Use clear commit messages
- Test your changes in the demo
- Update documentation if needed

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
