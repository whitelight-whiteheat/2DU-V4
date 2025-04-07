# Contributing to 2DU

Thank you for your interest in contributing to 2DU! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to maintain a respectful and inclusive community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/2du.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install` or `yarn install`
5. Set up environment variables (see README.md)
6. Start the development server: `npm run dev` or `yarn dev`

## Development Workflow

### Branch Naming Convention

- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`
- Performance improvements: `perf/description`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

Example:
```
feat(auth): add social login with Google

- Implement Google OAuth flow
- Add user profile storage
- Update authentication context
```

### Pull Request Process

1. Update your fork with the latest changes from the main repository
2. Ensure all tests pass: `npm test` or `yarn test`
3. Update documentation if necessary
4. Create a pull request with a clear description of the changes
5. Link any related issues
6. Wait for review and address any feedback

## Testing

### Unit Tests

- Write tests for all new features
- Ensure existing tests pass
- Maintain or improve test coverage
- Run tests: `npm test` or `yarn test`

### End-to-End Tests

- Add E2E tests for critical user flows
- Run E2E tests: `npm run test:e2e` or `yarn test:e2e`
- Test in multiple browsers

### Test Coverage

- Maintain minimum coverage requirements
- Generate coverage report: `npm run test:coverage` or `yarn test:coverage`

## Code Style

### TypeScript

- Use TypeScript for all new code
- Maintain strict type checking
- Document complex types
- Use interfaces for object shapes
- Use type aliases for unions and primitives

### React

- Use functional components with hooks
- Follow React best practices
- Implement proper error boundaries
- Use React.memo for performance optimization when needed
- Keep components focused and small

### Styling

- Use Material-UI components when possible
- Follow the project's theme system
- Use CSS-in-JS for component-specific styles
- Maintain responsive design principles

## Documentation

### Code Documentation

- Document complex functions and components
- Use JSDoc comments for TypeScript
- Include examples for reusable components
- Document props and return types

### API Documentation

- Document all API endpoints
- Include request/response examples
- Document error cases
- Keep API documentation up to date

## Performance

- Optimize bundle size
- Implement code splitting
- Use lazy loading for routes
- Optimize images and assets
- Monitor performance metrics

## Security

- Follow security best practices
- Validate user input
- Implement proper authentication
- Use environment variables for secrets
- Keep dependencies updated

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create a release branch
4. Run tests and checks
5. Create a pull request
6. Merge after review
7. Create a GitHub release
8. Deploy to production

## Getting Help

- Check existing issues and discussions
- Ask in the project's Discord channel
- Create a new issue if needed
- Contact maintainers directly

## Recognition

Contributors will be recognized in:
- The project's README.md
- Release notes
- Project documentation

Thank you for contributing to 2DU! 