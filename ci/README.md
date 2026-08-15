# CI Configuration

This directory contains Continuous Integration (CI) configuration and scripts for the Arbellar Backend project.

## Overview

The CI pipeline is implemented using GitHub Actions and is configured to run on:
- Push to `main` and `develop` branches
- Pull requests targeting `main` and `develop` branches
- Release creation events

## CI Workflows

### 1. Continuous Integration (`ci.yml`)
Located in `.github/workflows/ci.yml`

**Purpose**: Run quality checks and tests on every push and pull request.

**Steps**:
1. **Setup**: Install pnpm and Node.js
2. **Dependencies**: Install project dependencies
3. **Type Checking**: Run TypeScript compiler without emitting files
4. **Linting**: Run ESLint to check code quality
5. **Formatting**: Check code formatting with Prettier
6. **Testing**: Run unit tests with Vitest
7. **Coverage**: Generate test coverage reports
8. **Security**: Run dependency audit and secret scanning

**Matrix Testing**: Runs on Node.js 22.x

### 2. Build and Release (`build.yml`)
Located in `.github/workflows/build.yml`

**Purpose**: Build and package the application for release.

**Triggers**: On release creation

**Steps**:
1. **Quality Checks**: Type checking and tests
2. **Build**: Compile TypeScript to JavaScript
3. **Docker Build**: Build Docker image with metadata
4. **Docker Push**: Push to Docker Hub (if not a PR)
5. **Artifact Creation**: Create release tarballs
6. **Artifact Upload**: Upload to GitHub artifacts

## CI Checks Directory

The `ci/checks/` directory contains scripts and configuration for quality checks that can be run locally or in CI.

### Available Checks

1. **Code Quality**
   - TypeScript type checking
   - ESLint linting
   - Prettier formatting
   - Import/export validation

2. **Testing**
   - Unit test execution
   - Test coverage reporting
   - Integration test setup (future)

3. **Security**
   - Dependency vulnerability scanning
   - Secret detection
   - Code security patterns

4. **Build Validation**
   - TypeScript compilation
   - Bundle size analysis (future)
   - Dependency tree validation

## Running CI Checks Locally

You can run CI checks locally before pushing:

```bash
# Run all CI checks
pnpm typecheck && pnpm lint && pnpm format:check && pnpm test

# Or run individual checks
pnpm typecheck  # TypeScript type checking
pnpm lint       # ESLint linting
pnpm format:check # Prettier formatting check
pnpm test       # Run tests
pnpm audit      # Dependency audit
```

## Environment Requirements

- **Node.js**: 22.x
- **pnpm**: 9.x
- **TypeScript**: 5.x
- **GitHub Actions Runner**: Ubuntu latest

## Configuration Files

- `.github/workflows/ci.yml` - Main CI pipeline
- `.github/workflows/build.yml` - Build and release pipeline
- `vitest.config.ts` - Test configuration
- `eslint.config.js` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `tsconfig.json` - TypeScript configuration

## Adding New Checks

To add a new CI check:

1. Add the check script to `package.json` scripts
2. Update the CI workflow to run the new check
3. Document the check in this README
4. Ensure the check can run both locally and in CI

## Troubleshooting

### Common Issues

1. **CI Failing on TypeScript Errors**
   - Run `pnpm typecheck` locally first
   - Check for missing type definitions
   - Verify `tsconfig.json` configuration

2. **Linting Failures**
   - Run `pnpm lint:fix` to auto-fix issues
   - Check `eslint.config.js` for rule configuration

3. **Test Failures**
   - Run tests locally with `pnpm test`
   - Check test environment setup
   - Verify mocking and test data

4. **Docker Build Failures**
   - Test Docker build locally with `docker build .`
   - Check Dockerfile syntax and dependencies
   - Verify multi-stage build steps

## Performance Optimization

- **Caching**: GitHub Actions caches pnpm store and node_modules
- **Parallel Jobs**: Tests run in parallel where possible
- **Matrix Testing**: Tests across multiple Node.js versions
- **Selective Testing**: Future optimization could include affected tests only

## Security Considerations

- **Secrets**: Never commit secrets to repository
- **Dependencies**: Regular dependency updates and audits
- **Code Scanning**: Automated secret detection in CI
- **Environment Variables**: Proper handling in CI workflows

## Future Enhancements

1. **Integration Tests**: Add MongoDB and Redis integration tests
2. **Performance Tests**: Add load and performance testing
3. **End-to-End Tests**: Add API endpoint testing
4. **Deployment Pipeline**: Add staging and production deployment
5. **Quality Gates**: Add quality metrics and gates
6. **Automated Releases**: Semantic release automation

## Phase Implementation

### Phase 1 (MVP)
- Basic CI pipeline with type checking, linting, and unit tests
- Docker build and push on releases
- Security scanning for dependencies and secrets

### Phase 2 (Expansion)
- Integration tests with test databases
- Performance testing
- Code coverage requirements
- Automated dependency updates

### Phase 3 (AI & Automation)
- AI-powered code review suggestions
- Automated performance regression detection
- Smart test selection based on changes

### Phase 4 (Protocol)
- Compliance and regulatory checks
- Production deployment validation
- Multi-environment testing