# Build System

This directory contains build-related configuration and documentation for the Arbellar Backend project.

## Overview

The build system transforms TypeScript source code into production-ready JavaScript artifacts, Docker images, and deployment packages. The system is designed to be reproducible, reliable, and efficient.

## Build Pipeline

### 1. Development Build
```bash
pnpm dev
```
- Uses `tsx` for TypeScript execution with hot reload
- Watches for file changes
- Runs in development mode with debugging enabled

### 2. Production Build
```bash
pnpm build
```
- Compiles TypeScript to JavaScript using `tsc`
- Outputs to `dist/` directory
- Includes source maps for debugging
- Generates TypeScript declaration files

### 3. Docker Build
```bash
docker build -t arbellar-backend .
```
- Multi-stage Docker build
- Production-optimized image
- Non-root user for security
- Health checks included

## Build Configuration

### TypeScript Configuration
- **`tsconfig.json`**: Main TypeScript configuration
- **Target**: ES2022 for modern JavaScript features
- **Module**: CommonJS for Node.js compatibility
- **Strict**: All strict type checking enabled
- **Paths**: Module alias configuration for clean imports

### Docker Configuration
- **`Dockerfile`**: Multi-stage build configuration
- **Base Image**: Node.js 18 Alpine for small footprint
- **Build Stage**: Full development environment
- **Production Stage**: Minimal production image
- **Security**: Non-root user execution

### Docker Compose
- **`docker-compose.yml`**: Development environment
- **Services**: Backend, MongoDB, Redis, Mongo Express
- **Networking**: Isolated network for services
- **Volumes**: Persistent data storage
- **Health Checks**: Service availability monitoring

## Build Output

### Directory Structure
```
dist/
├── server.js              # Main application entry point
├── app.js                # Express application setup
├── config/               # Configuration modules
├── modules/              # Domain modules
├── integrations/         # External integrations
├── types/                # TypeScript declaration files
└── *.js.map              # Source maps for debugging
```

### Artifacts
1. **JavaScript Files**: Compiled from TypeScript
2. **Source Maps**: For production debugging
3. **Declaration Files**: For TypeScript consumers
4. **Docker Image**: Production-ready container
5. **Release Tarballs**: For manual deployment

## Build Process

### 1. Dependency Installation
```bash
pnpm install --frozen-lockfile
```
- Uses pnpm for fast, disk-efficient installation
- Frozen lockfile ensures reproducible builds
- Production-only dependencies for final image

### 2. TypeScript Compilation
```bash
tsc --project tsconfig.json
```
- Strict type checking
- Declaration file generation
- Source map generation
- Path alias resolution

### 3. Quality Validation
```bash
pnpm typecheck && pnpm lint && pnpm test
```
- Type validation
- Code quality checks
- Test execution
- Security scanning

### 4. Docker Image Creation
```bash
docker build --target production -t arbellar-backend:latest .
```
- Multi-stage optimization
- Layer caching for speed
- Security hardening
- Size optimization

## Development Build

### Hot Reload Development
```bash
pnpm dev
```
- Uses `tsx` for direct TypeScript execution
- File watching with automatic restart
- Development-specific configuration
- Debug logging enabled

### Development Docker
```bash
docker-compose up
```
- Full development environment
- Database and cache services
- Volume-mounted source code
- Automatic service dependency management

## Production Build

### Optimization Strategies

**Tree Shaking** (Future)
- Remove unused code
- Reduce bundle size
- Improve startup performance

**Minification** (Future)
- Reduce JavaScript file size
- Remove comments and whitespace
- Rename variables where safe

**Compression**
- Gzip compression for HTTP responses
- Brotli compression support (future)
- Static asset optimization

### Security Considerations

**Dependency Scanning**
- Regular security audits
- Vulnerability detection
- License compliance

**Image Security**
- Non-root user execution
- Regular base image updates
- Minimal attack surface

**Secret Management**
- Environment variable injection
- No hardcoded secrets
- Secure credential handling

## Build Environment

### Environment Variables
Build behavior can be customized with environment variables:

```bash
NODE_ENV=production  # Production optimizations
CI=true             # CI-specific behavior
DOCKER_BUILDKIT=1   # Docker BuildKit enablement
```

### CI/CD Integration
The build process integrates with GitHub Actions for:
- Automated testing
- Docker image building
- Artifact generation
- Release management

## Performance Optimization

### Build Speed
- **Incremental Compilation**: TypeScript incremental builds
- **Docker Layer Caching**: Reuse unchanged layers
- **Parallel Processing**: Concurrent operations where possible
- **Selective Building**: Only rebuild changed components

### Output Size
- **Alpine Base Image**: Minimal Linux distribution
- **Production Dependencies Only**: No dev dependencies in final image
- **Multi-stage Builds**: Separate build and runtime environments
- **Asset Optimization**: Compressed and minified assets

## Troubleshooting

### Common Build Issues

**TypeScript Compilation Errors**
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache

# Check for type conflicts
pnpm typecheck --diagnostics

# Verify tsconfig.json
npx tsc --showConfig
```

**Docker Build Failures**
```bash
# Clean build cache
docker builder prune

# Build with detailed output
docker build --progress=plain .

# Check Dockerfile syntax
dockerfilelint Dockerfile
```

**Dependency Issues**
```bash
# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check for conflicting versions
pnpm ls --depth 0
```

### Performance Issues

**Slow TypeScript Compilation**
- Enable incremental compilation
- Exclude unnecessary files
- Use project references (for large codebases)
- Consider using `tsc --watch` for development

**Large Docker Image Size**
- Use multi-stage builds
- Minimize layers
- Clean up temporary files
- Use `.dockerignore` effectively

## Phase Implementation

### Phase 1 (MVP)
- Basic TypeScript compilation
- Development and production builds
- Docker containerization
- CI/CD pipeline foundation

### Phase 2 (Expansion)
- Advanced build optimizations
- Asset bundling and minification
- Performance profiling
- Advanced Docker configurations

### Phase 3 (AI & Automation)
- Automated build optimization
- Performance regression detection
- Smart caching strategies
- Predictive build optimization

### Phase 4 (Protocol)
- Compliance build validation
- Regulatory artifact generation
- Multi-environment builds
- Advanced security scanning

## Best Practices

1. **Reproducible Builds**: Use lockfiles and version pinning
2. **Incremental Builds**: Support fast development iterations
3. **Security First**: Regular dependency and image scanning
4. **Performance Monitoring**: Track build times and output sizes
5. **Documentation**: Keep build process documented and updated
6. **Testing Integration**: Build process includes test execution
7. **Environment Consistency**: Development and production parity
8. **Automation**: Minimize manual build steps

## Customizing the Build

### Adding New Build Steps
1. Add script to `package.json`
2. Update CI/CD workflows
3. Document the new step
4. Test in development environment

### Modifying Build Configuration
1. Update configuration files
2. Test with sample builds
3. Update documentation
4. Communicate changes to team

### Extending Docker Configuration
1. Add new services to `docker-compose.yml`
2. Update Dockerfile for new dependencies
3. Test with local Docker environment
4. Update deployment documentation

## Monitoring and Metrics

### Build Metrics to Track
- **Build Time**: Time to complete full build
- **Image Size**: Final Docker image size
- **Test Coverage**: Code coverage percentage
- **Dependency Count**: Number of production dependencies
- **Security Issues**: Vulnerabilities detected

### Performance Targets
- **Build Time**: < 5 minutes for full build
- **Image Size**: < 200MB for production image
- **Startup Time**: < 30 seconds for application
- **Memory Usage**: < 256MB baseline