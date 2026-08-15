# Scripts

## Overview

This directory contains utility scripts for development, deployment, database management, and maintenance tasks for the Arbellar Backend application.

## Script Categories

### Development Scripts
- Database seeding and migration
- Test data generation
- Development environment setup
- Code generation utilities

### Deployment Scripts
- Build and deployment automation
- Environment configuration
- Health check verification
- Rollback procedures

### Database Scripts
- Schema migrations
- Data migrations
- Backup and restore
- Data cleanup

### Maintenance Scripts
- Log rotation
- Cache clearing
- Performance optimization
- System health checks

## Available Scripts

### Development

#### `setup-dev.sh` (Future)
Sets up the development environment.

```bash
# Usage
bash scripts/setup-dev.sh
```

**What it does**:
- Installs dependencies with pnpm
- Sets up environment variables
- Initializes local database
- Runs initial migrations
- Seeds development data

#### `seed-database.ts` (Future)
Seeds the database with test data.

```bash
# Usage
pnpm tsx scripts/seed-database.ts
```

**What it does**:
- Creates test users
- Generates test wallets
- Creates sample vaults
- Adds market data snapshots
- Generates arbitrage opportunities

#### `generate-types.ts` (Future)
Generates TypeScript types from schemas.

```bash
# Usage
pnpm tsx scripts/generate-types.ts
```

**What it does**:
- Generates types from Mongoose schemas
- Creates API response types
- Updates type definition files
- Validates type consistency

### Database Management

#### `migrate-database.ts` (Future)
Runs database migrations.

```bash
# Usage
pnpm tsx scripts/migrate-database.ts [up|down|status]
```

**What it does**:
- Applies pending migrations
- Rolls back migrations
- Shows migration status
- Validates schema changes

#### `backup-database.sh` (Future)
Creates a database backup.

```bash
# Usage
bash scripts/backup-database.sh [environment]
```

**What it does**:
- Creates MongoDB dump
- Compresses backup files
- Uploads to cloud storage (optional)
- Maintains backup rotation

#### `restore-database.sh` (Future)
Restores database from backup.

```bash
# Usage
bash scripts/restore-database.sh [backup-file]
```

**What it does**:
- Downloads backup from storage
- Validates backup integrity
- Restores database
- Verifies restoration

### Deployment

#### `deploy.sh` (Future)
Deploys the application to specified environment.

```bash
# Usage
bash scripts/deploy.sh [staging|production]
```

**What it does**:
- Runs pre-deployment checks
- Builds Docker image
- Pushes to container registry
- Deploys to target environment
- Runs post-deployment verification

#### `rollback.sh` (Future)
Rolls back to previous deployment.

```bash
# Usage
bash scripts/rollback.sh [environment] [version]
```

**What it does**:
- Identifies previous version
- Rolls back deployment
- Verifies system health
- Notifies team

#### `health-check.ts` (Future)
Comprehensive health check for deployment verification.

```bash
# Usage
pnpm tsx scripts/health-check.ts [url]
```

**What it does**:
- Checks all health endpoints
- Verifies database connectivity
- Tests external integrations
- Validates critical workflows
- Reports status

### Maintenance

#### `cleanup-logs.sh` (Future)
Cleans up old log files.

```bash
# Usage
bash scripts/cleanup-logs.sh [days]
```

**What it does**:
- Removes logs older than specified days
- Compresses recent logs
- Maintains log rotation
- Reports disk space freed

#### `clear-cache.ts` (Future)
Clears application caches.

```bash
# Usage
pnpm tsx scripts/clear-cache.ts [redis|memory|all]
```

**What it does**:
- Clears Redis cache
- Resets in-memory caches
- Invalidates stale data
- Reports cache statistics

#### `analyze-performance.ts` (Future)
Analyzes system performance.

```bash
# Usage
pnpm tsx scripts/analyze-performance.ts [duration]
```

**What it does**:
- Monitors API response times
- Analyzes database queries
- Checks memory usage
- Identifies bottlenecks
- Generates report

### Data Management

#### `export-data.ts` (Future)
Exports data in various formats.

```bash
# Usage
pnpm tsx scripts/export-data.ts [collection] [format]
```

**What it does**:
- Exports specified collection
- Formats as JSON, CSV, or Excel
- Applies filters if specified
- Saves to output directory

#### `import-data.ts` (Future)
Imports data from external sources.

```bash
# Usage
pnpm tsx scripts/import-data.ts [file] [collection]
```

**What it does**:
- Validates input data
- Transforms to schema format
- Imports to database
- Reports import statistics

#### `cleanup-test-data.ts` (Future)
Removes test data from database.

```bash
# Usage
pnpm tsx scripts/cleanup-test-data.ts [environment]
```

**What it does**:
- Identifies test data
- Safely removes test records
- Preserves production data
- Reports cleanup results

### Security

#### `rotate-secrets.sh` (Future)
Rotates security secrets and keys.

```bash
# Usage
bash scripts/rotate-secrets.sh [environment]
```

**What it does**:
- Generates new secrets
- Updates environment configuration
- Deploys new secrets
- Invalidates old secrets

#### `audit-security.ts` (Future)
Runs security audit checks.

```bash
# Usage
pnpm tsx scripts/audit-security.ts
```

**What it does**:
- Scans dependencies for vulnerabilities
- Checks for exposed secrets
- Validates security headers
- Reports security issues

### Monitoring

#### `check-metrics.ts` (Future)
Checks system metrics and alerts.

```bash
# Usage
pnpm tsx scripts/check-metrics.ts
```

**What it does**:
- Collects system metrics
- Checks against thresholds
- Generates alerts if needed
- Reports metric summary

#### `generate-report.ts` (Future)
Generates various system reports.

```bash
# Usage
pnpm tsx scripts/generate-report.ts [type] [period]
```

**What it does**:
- Generates specified report type
- Covers specified time period
- Includes charts and graphs
- Exports to PDF or HTML

## Script Development Guidelines

### Script Structure

```typescript
#!/usr/bin/env tsx

/**
 * Script Name: script-name.ts
 * Description: Brief description of what this script does
 * Usage: pnpm tsx scripts/script-name.ts [args]
 */

import { logger } from '../src/utils/logger';
import { config } from '../src/config';

// Parse command line arguments
const args = process.argv.slice(2);

// Main script logic
async function main() {
  try {
    logger.info('Script started');
    
    // Script implementation
    
    logger.info('Script completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Script failed:', error);
    process.exit(1);
  }
}

// Run the script
main();
```

### Error Handling

```typescript
async function safeOperation() {
  try {
    // Risky operation
    await performOperation();
  } catch (error) {
    logger.error('Operation failed:', error);
    
    // Attempt recovery or cleanup
    await cleanup();
    
    throw error; // Re-throw if cannot recover
  }
}
```

### Progress Reporting

```typescript
import cliProgress from 'cli-progress';

async function processLargeDataset(items: any[]) {
  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  
  progressBar.start(items.length, 0);
  
  for (let i = 0; i < items.length; i++) {
    await processItem(items[i]);
    progressBar.update(i + 1);
  }
  
  progressBar.stop();
}
```

### Confirmation Prompts

```typescript
import * as readline from 'readline';

async function confirmAction(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  return new Promise((resolve) => {
    rl.question(`${message} (yes/no): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

// Usage
if (await confirmAction('Are you sure you want to delete all test data?')) {
  await deleteTestData();
} else {
  console.log('Operation cancelled');
}
```

## Best Practices

### 1. Always Use Logging
```typescript
// Good
logger.info('Starting database migration');
await runMigration();
logger.info('Migration completed successfully');

// Bad
await runMigration(); // No logging
```

### 2. Handle Errors Gracefully
```typescript
// Good
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed:', error);
  await cleanup();
  process.exit(1);
}

// Bad
await riskyOperation(); // No error handling
```

### 3. Validate Input
```typescript
// Good
if (!process.env.DATABASE_URL) {
  logger.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

// Bad
const dbUrl = process.env.DATABASE_URL; // Might be undefined
```

### 4. Provide Help Text
```typescript
// Good
if (args.includes('--help') || args.length === 0) {
  console.log(`
Usage: pnpm tsx scripts/migrate.ts [up|down|status]

Commands:
  up      - Run pending migrations
  down    - Rollback last migration
  status  - Show migration status
  `);
  process.exit(0);
}

// Bad
// No help text provided
```

### 5. Use Dry Run Mode
```typescript
// Good
const dryRun = args.includes('--dry-run');

if (dryRun) {
  logger.info('DRY RUN: Would delete 100 records');
} else {
  await deleteRecords();
  logger.info('Deleted 100 records');
}
```

### 6. Make Scripts Idempotent
```typescript
// Good
async function applyMigration(name: string) {
  const exists = await checkMigrationExists(name);
  
  if (exists) {
    logger.info(`Migration ${name} already applied, skipping`);
    return;
  }
  
  await runMigration(name);
}

// Bad
async function applyMigration(name: string) {
  await runMigration(name); // Might fail if already applied
}
```

### 7. Document Scripts
- Add clear description at the top of the file
- Include usage examples
- Document all command-line arguments
- Explain side effects and requirements

### 8. Exit with Proper Codes
```typescript
// Success
process.exit(0);

// Error
process.exit(1);

// Usage error
process.exit(2);
```

## Environment Variables

Scripts should respect environment-specific configuration:

```typescript
import * as dotenv from 'dotenv';

// Load environment-specific .env file
const environment = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${environment}` });

// Or load from command line
const envFile = args.find(arg => arg.startsWith('--env='))?.split('=')[1];
if (envFile) {
  dotenv.config({ path: envFile });
}
```

## Script Testing

### Testing Scripts
```typescript
// scripts/__tests__/seed-database.test.ts
import { describe, it, expect, vi } from 'vitest';
import { seedDatabase } from '../seed-database';

describe('seed-database script', () => {
  it('should create test users', async () => {
    const mockUserRepository = {
      create: vi.fn(),
    };
    
    await seedDatabase(mockUserRepository);
    
    expect(mockUserRepository.create).toHaveBeenCalled();
  });
});
```

## Security Considerations

### 1. Never Hardcode Secrets
```typescript
// Good
const apiKey = process.env.API_KEY;

// Bad
const apiKey = 'sk_live_1234567890'; // Hardcoded secret
```

### 2. Validate Destructive Operations
```typescript
// Good
if (environment === 'production') {
  const confirmed = await confirmAction('Delete production data?');
  if (!confirmed) {
    process.exit(0);
  }
}

// Bad
await deleteAllData(); // No confirmation for production
```

### 3. Sanitize Inputs
```typescript
// Good
const userInput = args[0];
const sanitized = userInput.replace(/[^a-zA-Z0-9-_]/g, '');

// Bad
const userInput = args[0];
await executeCommand(userInput); // Potential command injection
```

## Adding New Scripts

### Steps to Create New Script

1. **Create Script File**
   ```bash
   touch scripts/my-new-script.ts
   chmod +x scripts/my-new-script.ts
   ```

2. **Add Script Template**
   ```typescript
   #!/usr/bin/env tsx
   
   /**
    * Script: my-new-script.ts
    * Description: What this script does
    * Usage: pnpm tsx scripts/my-new-script.ts [args]
    */
   
   // Implementation
   ```

3. **Add to package.json** (optional)
   ```json
   {
     "scripts": {
       "script:my-script": "tsx scripts/my-new-script.ts"
     }
   }
   ```

4. **Document in README**
   - Add to appropriate section
   - Include usage examples
   - Document arguments and options

5. **Test the Script**
   - Test with various inputs
   - Test error conditions
   - Test in different environments

## Related Documentation
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Development Setup](../README.md)
- [CI/CD Documentation](../ci/README.md)