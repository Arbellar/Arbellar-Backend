# Contributing to Arbellar Backend

Thank you for your interest in contributing to the Arbellar Backend project! This document provides guidelines and instructions for contributing.

## Code of Conduct

We expect all contributors to adhere to our code of conduct:
- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites
- Node.js 22+
- pnpm 9+
- MongoDB 6+
- Git

### Development Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/arbellar-backend.git
   cd arbellar-backend
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```
5. Start development environment:
   ```bash
   docker-compose up -d  # Starts MongoDB and Redis
   pnpm dev              # Starts development server
   ```

## Development Workflow

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches
- `release/*`: Release preparation branches

### Creating a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### Making Changes
1. Ensure your code follows our coding standards
2. Write or update tests as needed
3. Update documentation if required
4. Commit changes with descriptive messages

### Commit Message Format
Follow conventional commits:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:
```
feat(users): add two-factor authentication

- Implement TOTP-based 2FA
- Add QR code generation for setup
- Add backup code functionality

Closes #123
```

### Testing
Before submitting a pull request:
```bash
pnpm test            # Run all tests
pnpm lint            # Check code style
pnpm typecheck       # TypeScript type checking
pnpm format:check    # Check formatting
```

### Pull Request Process
1. Update your fork with the latest changes
2. Create a pull request to `develop` branch
3. Fill out the PR template completely
4. Ensure all CI checks pass
5. Request reviews from maintainers
6. Address review feedback
7. Once approved, maintainers will merge

## Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Avoid `any` type when possible
- Use interfaces for object shapes
- Export types from dedicated type files
- Use absolute imports (`@/module`)

### Code Style
- Follow ESLint and Prettier configurations
- Maximum line length: 100 characters
- Use meaningful variable and function names
- Write self-documenting code
- Add comments for complex logic

### Error Handling
- Use custom error classes from `src/middleware/errorHandler.ts`
- Always handle promises with try/catch or .catch()
- Log errors with appropriate context
- Return meaningful error messages to users

### Security
- Never store secrets in code
- Validate all user input
- Use parameterized queries for database operations
- Implement proper authentication and authorization
- Follow security best practices for Stellar integration

## Project Structure

### Module Organization
Each domain module should have:
```
modules/domain-name/
├── domain-name.controller.ts   # HTTP request handlers
├── domain-name.service.ts      # Business logic
├── domain-name.repository.ts   # Data access
├── domain-name.model.ts        # Database schema
├── domain-name.types.ts        # TypeScript types
├── domain-name.validation.ts   # Input validation
└── README.md                   # Module documentation
```

### Integration Layer
External service integrations go in `src/integrations/`:
- Abstract external APIs
- Implement error handling and retry logic
- Provide consistent interfaces

### Testing Structure
- Unit tests: `tests/unit/`
- Integration tests: `tests/integration/`
- E2E tests: `tests/e2e/`
- Test each layer independently

## Documentation

### Writing Documentation
- Update README.md files when changing functionality
- Document new environment variables
- Update API documentation for new endpoints
- Add inline comments for complex algorithms

### API Documentation
We use OpenAPI/Swagger for API documentation:
- Update OpenAPI specification for new endpoints
- Provide example requests and responses
- Document error responses

## Review Process

### Code Review Checklist
- [ ] Code follows project standards
- [ ] Tests are added/updated and pass
- [ ] Documentation is updated
- [ ] No security issues introduced
- [ ] Performance considerations addressed
- [ ] Error handling is appropriate
- [ ] Code is maintainable and readable

### Review Etiquette
- Be constructive and specific
- Focus on the code, not the person
- Suggest improvements, not just problems
- Acknowledge good practices
- Respond to feedback professionally

## Release Process

### Versioning
We follow Semantic Versioning:
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Steps
1. Create release branch from `develop`
2. Update version in `package.json`
3. Update CHANGELOG.md
4. Run full test suite
5. Create release tag
6. Merge to `main`
7. Deploy to production
8. Merge `main` back to `develop`

## Getting Help

### Questions and Support
- Check the documentation first
- Search existing issues
- Join our Discord community (coming soon)
- Create an issue for bugs or feature requests

### Reporting Bugs
When reporting bugs, include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details
- Error logs or screenshots

### Feature Requests
For feature requests:
- Describe the problem you're solving
- Explain the proposed solution
- Provide use cases
- Consider alternative approaches

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Acknowledged in release notes
- Invited to contributor events (future)

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.