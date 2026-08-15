# Tests

## Overview

This directory contains all tests for the Arbellar Backend application. The testing strategy follows a comprehensive approach covering unit tests, integration tests, and end-to-end tests.

## Testing Philosophy

- **Test-Driven Development (TDD)**: Write tests before implementation when possible
- **High Coverage**: Aim for 80%+ code coverage
- **Fast Feedback**: Unit tests should run in milliseconds
- **Realistic Integration**: Integration tests use real dependencies when feasible
- **Comprehensive E2E**: End-to-end tests cover critical user flows

## Test Structure

```
tests/
├── unit/                    # Unit tests (isolated component testing)
│   ├── modules/            # Domain module tests
│   ├── integrations/       # Integration layer tests
│   ├── utils/              # Utility function tests
│   └── middleware/         # Middleware tests
│
├── integration/            # Integration tests (with dependencies)
│   ├── api/               # API endpoint tests
│   ├── database/          # Database operation tests
│   ├── stellar/           # Stellar network tests
│   └── workflows/         # Multi-component workflows
│
├── e2e/                   # End-to-end tests (full system)
│   ├── user-flows/        # Complete user journeys
│   ├── arbitrage-flows/   # Arbitrage workflows
│   └── admin-flows/       # Administrative workflows
│
├── fixtures/              # Test data and fixtures
│   ├── users.json        # User test data
│   ├── vaults.json       # Vault test data
│   └── markets.json      # Market data samples
│
├── mocks/                # Mock implementations
│   ├── stellar.mock.ts   # Stellar SDK mocks
│   ├── database.mock.ts  # Database mocks
│   └── apis.mock.ts      # External API mocks
│
├── helpers/              # Test utilities
│   ├── setup.ts         # Test environment setup
│   ├── teardown.ts      # Test cleanup
│   └── factories.ts     # Test data factories
│
└── README.md            # This file
```

## Testing Tools

### Test Runner: Vitest
- Fast, modern test runner
- Built-in TypeScript support
- Jest-compatible API
- Native ESM support
- Watch mode for development

### Assertion Library: Vitest (built-in)
- Familiar Jest-like assertions
- Rich matcher library
- Custom matcher support

### Mocking: Vitest (built-in)
- Function mocking
- Module mocking
- Timer mocking
- Spy functionality

### Test Database: MongoDB Memory Server (Future)
- In-memory MongoDB for tests
- Fast test execution
- No external dependencies
- Isolated test data

### HTTP Testing: Supertest
- HTTP assertion library
- Express integration
- Request/response testing
- Status code validation

## Running Tests

### All Tests
```bash
pnpm test
```

### Watch Mode
```bash
pnpm test:watch
```

### Coverage Report
```bash
pnpm test:coverage
```

### Specific Test File
```bash
pnpm test tests/unit/modules/users/user.service.test.ts
```

### Specific Test Suite
```bash
pnpm test --grep "UserService"
```

### Unit Tests Only
```bash
pnpm test tests/unit
```

### Integration Tests Only
```bash
pnpm test tests/integration
```

### E2E Tests Only
```bash
pnpm test tests/e2e
```

## Writing Tests

### Unit Test Example

```typescript
// tests/unit/modules/users/user.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from '@/modules/users/user.service';
import { UserRepository } from '@/modules/users/user.repository';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: vi.Mocked<UserRepository>;

  beforeEach(() => {
    // Create mock repository
    mockUserRepository = {
      create: vi.fn(),
      findByEmail: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as any;

    // Initialize service with mock
    userService = new UserService(mockUserRepository);
  });

  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedUser = {
        id: '123',
        email: 'test@example.com',
        passwordHash: 'hashed_password',
      };

      mockUserRepository.create.mockResolvedValue(expectedUser);

      const result = await userService.createUser(userData);

      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: userData.email,
        passwordHash: expect.any(String),
      });
    });

    it('should throw error if email already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ id: '123' } as any);

      await expect(
        userService.createUser({ email: 'existing@example.com', password: 'pass' })
      ).rejects.toThrow('Email already exists');
    });
  });
});
```

### Integration Test Example

```typescript
// tests/integration/api/users.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { connectToDatabase, closeDatabaseConnection } from '@/config/database';

describe('User API', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await closeDatabaseConnection();
  });

  describe('POST /api/v1/users/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/users/register')
        .send({
          email: 'newuser@example.com',
          password: 'securePassword123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('email', 'newuser@example.com');
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should return validation error for invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/users/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
```

### E2E Test Example

```typescript
// tests/e2e/user-flows/registration-to-arbitrage.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '@/app';

describe('Complete User Journey: Registration to Arbitrage', () => {
  let authToken: string;
  let userId: string;
  let walletId: string;
  let vaultId: string;

  it('should complete full user flow', async () => {
    // 1. Register user
    const registerResponse = await request(app)
      .post('/api/v1/users/register')
      .send({
        email: 'journey@example.com',
        password: 'SecurePass123!',
      });

    expect(registerResponse.status).toBe(201);
    userId = registerResponse.body.data.id;

    // 2. Login
    const loginResponse = await request(app)
      .post('/api/v1/users/login')
      .send({
        email: 'journey@example.com',
        password: 'SecurePass123!',
      });

    expect(loginResponse.status).toBe(200);
    authToken = loginResponse.body.data.token;

    // 3. Associate wallet
    const walletResponse = await request(app)
      .post('/api/v1/wallets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        address: 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ',
        network: 'testnet',
      });

    expect(walletResponse.status).toBe(201);
    walletId = walletResponse.body.data.id;

    // 4. Create vault
    const vaultResponse = await request(app)
      .post('/api/v1/vaults')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'My First Vault',
        config: {
          minSpread: 0.5,
          maxSlippage: 0.3,
        },
      });

    expect(vaultResponse.status).toBe(201);
    vaultId = vaultResponse.body.data.id;

    // 5. Get arbitrage opportunities
    const opportunitiesResponse = await request(app)
      .get('/api/v1/arbitrage/opportunities')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ vaultId });

    expect(opportunitiesResponse.status).toBe(200);
    expect(opportunitiesResponse.body.data).toBeInstanceOf(Array);
  });
});
```

## Test Data Management

### Fixtures

```typescript
// tests/fixtures/users.json
{
  "testUser": {
    "email": "test@example.com",
    "password": "TestPass123!",
    "profile": {
      "firstName": "Test",
      "lastName": "User"
    }
  },
  "adminUser": {
    "email": "admin@example.com",
    "password": "AdminPass123!",
    "role": "admin"
  }
}
```

### Factories

```typescript
// tests/helpers/factories.ts
import { faker } from '@faker-js/faker';

export class UserFactory {
  static create(overrides?: Partial<User>): User {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      passwordHash: faker.string.alphanumeric(60),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static createMany(count: number, overrides?: Partial<User>): User[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

export class VaultFactory {
  static create(overrides?: Partial<Vault>): Vault {
    return {
      id: faker.string.uuid(),
      contractAddress: `C${faker.string.alphanumeric(55)}`,
      ownerId: faker.string.uuid(),
      status: 'active',
      createdAt: new Date(),
      ...overrides,
    };
  }
}
```

## Mocking Strategies

### Mocking External APIs

```typescript
// tests/mocks/stellar.mock.ts
import { vi } from 'vitest';

export const mockStellarIntegration = {
  getAccount: vi.fn(),
  getBalance: vi.fn(),
  submitTransaction: vi.fn(),
  callContract: vi.fn(),
};

export const createMockStellarIntegration = () => {
  return {
    getAccount: vi.fn().mockResolvedValue({
      id: 'GA...',
      sequence: '123',
      balances: [],
    }),
    getBalance: vi.fn().mockResolvedValue(1000),
    submitTransaction: vi.fn().mockResolvedValue({
      hash: 'abc123',
      status: 'success',
    }),
  };
};
```

### Mocking Database

```typescript
// tests/mocks/database.mock.ts
import { vi } from 'vitest';

export const mockUserModel = {
  create: vi.fn(),
  findOne: vi.fn(),
  findById: vi.fn(),
  findByIdAndUpdate: vi.fn(),
  findByIdAndDelete: vi.fn(),
};

export const createMockRepository = <T>() => ({
  create: vi.fn<[T], Promise<T>>(),
  findById: vi.fn<[string], Promise<T | null>>(),
  findOne: vi.fn<[any], Promise<T | null>>(),
  findMany: vi.fn<[any], Promise<T[]>>(),
  update: vi.fn<[string, Partial<T>], Promise<T>>(),
  delete: vi.fn<[string], Promise<boolean>>(),
});
```

## Test Environment Setup

### Setup File

```typescript
// tests/helpers/setup.ts
import { beforeAll, afterAll, beforeEach } from 'vitest';
import { connectToDatabase, closeDatabaseConnection } from '@/config/database';

beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.MONGODB_URI = 'mongodb://localhost:27017/arbellar-test';
  
  // Connect to test database
  await connectToDatabase();
});

afterAll(async () => {
  // Close database connection
  await closeDatabaseConnection();
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
```

## Coverage Goals

### Phase 1 (MVP)
- **Unit Tests**: 70%+ coverage
- **Integration Tests**: Core flows covered
- **E2E Tests**: Happy paths covered

### Phase 2 (Expansion)
- **Unit Tests**: 80%+ coverage
- **Integration Tests**: All major flows covered
- **E2E Tests**: Critical paths and edge cases

### Phase 3 (AI & Automation)
- **Unit Tests**: 85%+ coverage
- **Integration Tests**: Comprehensive coverage
- **E2E Tests**: Full user journeys
- **AI-Generated Tests**: Supplemental coverage

### Phase 4 (Protocol)
- **Unit Tests**: 90%+ coverage
- **Integration Tests**: Complete coverage
- **E2E Tests**: All flows including governance
- **Security Tests**: Comprehensive security testing

## Best Practices

### Test Naming
```typescript
// Good: Descriptive test names
it('should throw ValidationError when email format is invalid', () => {});

// Bad: Vague test names
it('should work', () => {});
```

### Test Independence
```typescript
// Good: Each test is independent
describe('UserService', () => {
  beforeEach(() => {
    // Fresh setup for each test
  });
  
  it('test 1', () => {});
  it('test 2', () => {});
});

// Bad: Tests depend on each other
describe('UserService', () => {
  let sharedState;
  
  it('test 1', () => { sharedState = 'value'; });
  it('test 2', () => { expect(sharedState).toBe('value'); }); // Depends on test 1
});
```

### Arrange-Act-Assert (AAA) Pattern
```typescript
it('should calculate spread correctly', () => {
  // Arrange: Set up test data
  const bid = 100;
  const ask = 105;
  
  // Act: Execute the function
  const spread = calculateSpread(bid, ask);
  
  // Assert: Verify the result
  expect(spread).toBe(5);
});
```

### Test Readability
```typescript
// Good: Clear and readable
it('should return 400 when email is missing', async () => {
  const response = await request(app)
    .post('/api/v1/users/register')
    .send({ password: 'pass123' });
  
  expect(response.status).toBe(400);
  expect(response.body.error.code).toBe('VALIDATION_ERROR');
});

// Bad: Hard to understand
it('works', async () => {
  const r = await req(a).post('/api/v1/users/register').send({ p: 'p' });
  expect(r.s).toBe(400);
});
```

## Continuous Integration

Tests run automatically on:
- Every commit (unit tests)
- Pull requests (unit + integration tests)
- Before deployment (full test suite)

### CI Configuration
```yaml
# .github/workflows/ci.yml
- name: Run tests
  run: pnpm test
  
- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

## Troubleshooting

### Common Issues

**Tests timing out**
```typescript
// Increase timeout for slow tests
it('slow test', async () => {
  // Test logic
}, { timeout: 10000 }); // 10 seconds
```

**Database connection issues**
```bash
# Ensure test database is running
docker-compose up -d mongodb

# Check connection string
echo $MONGODB_URI
```

**Mock not working**
```typescript
// Ensure mock is configured before import
vi.mock('@/integrations/stellar', () => ({
  StellarIntegration: vi.fn(() => mockStellarIntegration),
}));

// Then import the module that uses it
import { ArbitrageService } from '@/modules/arbitrage/arbitrage.service';
```

## Related Documentation
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [CI/CD Documentation](../../ci/README.md)
- [Development Setup](../../README.md)