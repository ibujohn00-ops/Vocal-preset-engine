# VocalLab AI - Contributing Guide

## Code Standards

### TypeScript
- Use strict mode
- Avoid `any` types
- Define interfaces for all objects
- Add JSDoc comments for functions

### File Structure
- Keep files focused and modular
- Use descriptive names
- Group related functionality

### Naming Conventions
- Components: PascalCase (e.g., `AudioPlayer.tsx`)
- Functions/Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Interfaces: PascalCase with `I` prefix (e.g., `IUser`)

## Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes with clear commits
3. Push to origin: `git push origin feature/your-feature`
4. Create a Pull Request with description
5. Code review and merge

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Building

```bash
# Frontend
cd client
npm run build

# Backend
cd server
npm run build
```

## Submitting Changes

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests if applicable
5. Submit PR with detailed description

## Issues

When reporting issues, include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
