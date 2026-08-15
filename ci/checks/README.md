# CI Checks

This directory contains scripts and configuration for automated quality checks that run in CI and can be executed locally.

## Purpose

CI checks ensure code quality, security, and reliability before changes are merged. These checks help maintain a consistent codebase and catch issues early in the development process.

## Available Checks

### 1. Code Quality Checks

**TypeScript Type Checking**
- Ensures type safety across the codebase
- Catches type errors at compile time
- Validates interface contracts
- Command: `pnpm typecheck`

**ESLint Linting**
- Enforces coding standards and best practices
- Detects potential bugs and code smells
- Ensures consistent code style
- Command: `pnpm lint` (check), `pnpm lint:fix` (auto-fix)

**Prettier Formatting**
- Ensures consistent code formatting
- Automatically formats code to standards
- Command: `pnpm format:check` (check), `pnpm format` (auto-format)

### 2. Testing Checks

**Unit Tests**
- Validates individual units of code in isolation
- Ensures business logic correctness
- Provides regression protection
- Command: `pnpm test`

**Test Coverage**
- Measures code coverage by tests
- Identifies untested code paths
- Ensures adequate test coverage
- Command: `pnpm test:coverage`

### 3. Security Checks

**Dependency Audit**
- Scans dependencies for known vulnerabilities
- Checks for outdated packages
- Provides security advisory information
- Command: `pnpm audit`

**Secret Detection**
- Scans for hardcoded secrets in code
- Checks for exposed credentials
- Prevents accidental secret commits
- Runs automatically in CI

**Environment Variable Validation**
- Ensures proper environment variable usage
- Checks for missing required variables
- Validates environment configuration

### 4. Build Checks

**TypeScript Compilation**
- Validates that TypeScript compiles successfully
- Checks for compilation errors
- Ensures build readiness
- Command: `pnpm build`

**Dependency Validation**
- Validates package.json dependencies
- Checks for conflicting versions
- Ensures dependency consistency

## Running Checks Locally

### Before Committing
Always run checks before committing code:

```bash
# Run all checks
pnpm typecheck && pnpm lint && pnpm format:check && pnpm test

# Or use the pre-commit hook (if configured)
```

### Individual Checks
```bash
# Type checking only
pnpm typecheck

# Linting only
pnpm lint

# Auto-fix linting issues
pnpm lint:fix

# Formatting check only
pnpm format:check

# Auto-format code
pnpm format

# Run tests only
pnpm test

# Run tests with coverage
pnpm test:coverage

# Security audit
pnpm audit
```

## Configuration Files

### TypeScript
- `tsconfig.json` - TypeScript compiler configuration
- `tsconfig.build.json` - Build-specific configuration (future)

### ESLint
- `eslint.config.js` - ESLint rules and configuration (flat config)
- `.eslintignore` - Files to ignore during linting

### Prettier
- `.prettierrc` - Prettier formatting rules
- `.prettierignore` - Files to ignore during formatting

### Testing
- `vitest.config.ts` - Vitest test runner configuration
- Test files: `*.test.ts` or `*.spec.ts`

## Check Requirements

### Minimum Requirements (Must Pass)
1. **TypeScript Type Checking**: No type errors
2. **ESLint**: No critical or blocking issues
3. **Unit Tests**: All tests must pass
4. **Security Audit**: No critical vulnerabilities

### Quality Requirements (Should Pass)
1. **Test Coverage**: >80% coverage (Phase 2+)
2. **Formatting**: Consistent code formatting
3. **Build**: Successful compilation

## Customizing Checks

### Adding New Rules
To add new ESLint rules:
1. Edit `eslint.config.js`
2. Add the rule to the appropriate section
3. Test with `pnpm lint`
4. Update documentation if needed

### Modifying TypeScript Rules
To modify TypeScript configuration:
1. Edit `tsconfig.json`
2. Update compiler options
3. Test with `pnpm typecheck`

### Adding Test Categories
To add new test types:
1. Create test files with appropriate naming
2. Update `vitest.config.ts` if needed
3. Add test commands to `package.json`

## Integration with Development Workflow

### IDE Integration
- **VS Code**: ESLint and Prettier extensions
- **IntelliJ/WebStorm**: Built-in TypeScript and ESLint support
- **Pre-commit Hooks**: Husky for automated checks (future)

### CI Integration
- **GitHub Actions**: Automated check execution
- **Pull Requests**: Required status checks
- **Quality Gates**: Enforced merge requirements

## Troubleshooting

### Common Issues

**TypeScript Errors**
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache

# Reinstall dependencies
pnpm install --force

# Check for conflicting type definitions
```

**ESLint Configuration**
```bash
# Check ESLint configuration
npx eslint --print-config src/app.ts

# Debug specific rule
npx eslint --rule 'rule-name: "error"' src/file.ts
```

**Test Failures**
```bash
# Run tests in watch mode for debugging
pnpm test:watch

# Run specific test file
npx vitest run src/modules/users/user.service.test.ts

# Debug with Node inspector
node --inspect-brk node_modules/vitest/vitest.mjs run
```

### Performance Issues

**Slow Type Checking**
- Use `--skipLibCheck` for faster compilation
- Exclude unnecessary files from compilation
- Consider incremental compilation

**Slow Test Execution**
- Use test isolation where appropriate
- Mock external dependencies
- Run tests in parallel

## Phase Implementation

### Phase 1 (MVP)
- Basic type checking and linting
- Unit test framework
- Security dependency scanning
- CI integration

### Phase 2 (Expansion)
- Integration test framework
- Test coverage requirements
- Performance testing
- Advanced linting rules

### Phase 3 (AI & Automation)
- AI-powered code review
- Automated performance regression detection
- Smart test selection
- Code quality metrics

### Phase 4 (Protocol)
- Compliance checks
- Regulatory validation
- Production readiness checks
- Multi-environment validation

## Best Practices

1. **Run Checks Early**: Run checks locally before pushing
2. **Fix Issues Promptly**: Address check failures immediately
3. **Keep Dependencies Updated**: Regular security and dependency updates
4. **Maintain Test Coverage**: Write tests for new functionality
5. **Document Changes**: Update documentation when modifying checks
6. **Monitor Performance**: Regularly review check execution times
7. **Customize Appropriately**: Tailor checks to project needs
8. **Educate Team**: Ensure all developers understand check requirements

## Contributing New Checks

To contribute new CI checks:

1. **Proposal**: Document the need for the new check
2. **Implementation**: Create the check script or configuration
3. **Testing**: Verify the check works locally and in CI
4. **Documentation**: Update this README with check details
5. **Integration**: Add to CI workflow and local scripts
6. **Communication**: Notify team of new requirements