# Users Module

## Overview
The Users module handles user management, authentication, and profile operations for the Arbellar platform. This module is responsible for user registration, authentication, profile management, and account security.

## Responsibilities

### Core Responsibilities
- **User Registration**: Create new user accounts with proper validation
- **Authentication**: User login, session management, and token handling
- **Profile Management**: User profile creation, updates, and retrieval
- **Account Security**: Password management, security settings, and recovery
- **Preferences**: User preferences and platform settings management
- **Session Management**: Active session tracking and management

### Phase-Specific Responsibilities
- **Phase 1 (MVP)**: Basic registration, authentication, profile management
- **Phase 2 (Expansion)**: Advanced security features, two-factor authentication
- **Phase 3 (AI)**: Personalized recommendations, behavior analysis
- **Phase 4 (Protocol)**: Governance participation, reputation system

## Data Model

### User Document Structure
```typescript
interface User {
  _id: ObjectId;
  email: string;                    // User email (unique)
  username?: string;               // Optional display name
  passwordHash: string;            // Hashed password
  isActive: boolean;               // Account status
  isVerified: boolean;             // Email verification status
  profile: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    timezone?: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      showEmail: boolean;
      showActivity: boolean;
    };
    language: string;
    currency: string;
    theme: 'light' | 'dark' | 'auto';
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: Date;
    failedLoginAttempts: number;
    lockUntil?: Date;
  };
  wallets: ObjectId[];             // Associated wallet IDs
  vaults: ObjectId[];              // Associated vault IDs
  riskProfile: ObjectId;           // Reference to risk profile
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}
```

### Indexes
- `email`: Unique index for login and lookup
- `createdAt`: For sorting and time-based queries
- `isActive`: For filtering active users
- Compound indexes for common query patterns

## API Endpoints

### Authentication Endpoints
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `POST /api/v1/users/refresh-token` - Refresh access token
- `POST /api/v1/users/forgot-password` - Request password reset
- `POST /api/v1/users/reset-password` - Reset password with token

### Profile Endpoints
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users/profile/public/:userId` - Get public profile

### Preferences Endpoints
- `GET /api/v1/users/preferences` - Get user preferences
- `PUT /api/v1/users/preferences` - Update user preferences

### Security Endpoints
- `PUT /api/v1/users/change-password` - Change password
- `POST /api/v1/users/enable-2fa` - Enable two-factor authentication (Phase 2)
- `POST /api/v1/users/disable-2fa` - Disable two-factor authentication (Phase 2)
- `GET /api/v1/users/sessions` - Get active sessions
- `DELETE /api/v1/users/sessions/:sessionId` - Revoke session

### Account Management
- `POST /api/v1/users/verify-email` - Verify email address
- `POST /api/v1/users/resend-verification` - Resend verification email
- `DELETE /api/v1/users/account` - Delete user account (soft delete)
- `POST /api/v1/users/reactivate` - Reactivate deleted account

## Business Logic

### Registration Flow
1. Validate registration data
2. Check for existing user with same email
3. Hash password using bcrypt
4. Create user document with default preferences
5. Generate verification token (if email verification required)
6. Send welcome/verification email
7. Return user data (excluding sensitive fields)

### Authentication Flow
1. Validate login credentials
2. Check account status (active, not locked)
3. Verify password against hash
4. Check failed login attempts and lock if necessary
5. Generate JWT access token and refresh token
6. Update last login timestamp
7. Reset failed login attempts counter
8. Return tokens and user data

### Security Features
- **Password Policy**: Minimum length, complexity requirements
- **Account Lock**: Temporary lock after multiple failed attempts
- **Session Management**: JWT-based sessions with refresh tokens
- **Email Verification**: Required for full account functionality
- **Password Reset**: Secure token-based reset flow

## Integration Points

### Dependencies
- **Wallets Module**: User-wallet association
- **Vaults Module**: User-vault relationships
- **Risk Module**: User risk profile linking
- **Notifications Module**: User notification preferences

### Events Published
- `user.registered` - When new user registers
- `user.logged_in` - When user logs in
- `user.profile_updated` - When profile is updated
- `user.password_changed` - When password is changed
- `user.account_deleted` - When account is deleted

### Events Consumed
- `wallet.associated` - To link wallet to user
- `vault.created` - To link vault to user
- `risk.profile.created` - To link risk profile to user

## Configuration

### Environment Variables
```bash
# User module configuration
USER_PASSWORD_MIN_LENGTH=8
USER_ACCOUNT_LOCK_ATTEMPTS=5
USER_ACCOUNT_LOCK_MINUTES=15
USER_SESSION_EXPIRY_HOURS=24
USER_REFRESH_TOKEN_EXPIRY_DAYS=30
USER_EMAIL_VERIFICATION_REQUIRED=true
```

### Security Settings
```typescript
export const userSecurityConfig = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
  },
  accountLock: {
    maxAttempts: 5,
    lockDuration: 15 * 60 * 1000, // 15 minutes
  },
  session: {
    accessTokenExpiry: '24h',
    refreshTokenExpiry: '30d',
  },
};
```

## Testing

### Unit Tests
- User registration validation
- Password hashing and verification
- Profile update logic
- Security feature tests
- Preference management

### Integration Tests
- Complete registration flow
- Authentication flow
- Profile update flow
- Password reset flow
- Account deletion flow

### Security Tests
- SQL/NoSQL injection prevention
- XSS protection
- CSRF protection
- Session fixation prevention
- Brute force protection

## Phase Implementation

### Phase 1 (MVP)
- Basic registration and authentication
- Simple profile management
- Email verification (basic)
- Password reset functionality
- Session management with JWT

### Phase 2 (Expansion)
- Two-factor authentication
- Advanced security features
- Social login integration
- Advanced profile features
- Account activity logging

### Phase 3 (AI)
- Personalized recommendations
- Behavior analysis
- Predictive preferences
- Intelligent security monitoring
- Automated profile optimization

### Phase 4 (Protocol)
- Governance participation tracking
- Reputation system integration
- Protocol-specific user features
- Advanced privacy controls
- Compliance features

## Error Handling

### Common Errors
- `VALIDATION_ERROR`: Registration/update validation failed
- `AUTHENTICATION_ERROR`: Invalid credentials
- `ACCOUNT_LOCKED`: Account temporarily locked
- `EMAIL_IN_USE`: Email already registered
- `USER_NOT_FOUND`: User does not exist
- `INVALID_TOKEN`: Invalid verification/reset token

### Error Responses
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Invalid email or password"
  }
}
```

## Performance Considerations

### Database Optimization
- Index on email field for fast lookups
- Compound indexes for common queries
- Selective field projection for queries
- Query optimization for user searches

### Caching Strategy
- Cache user profiles (short TTL)
- Cache authentication results (very short TTL)
- Cache user preferences
- Implement cache invalidation on updates

### Rate Limiting
- Rate limit login attempts
- Rate limit registration attempts
- Rate limit password reset requests
- Implement IP-based rate limiting

## Security Considerations

### Data Protection
- Never store plain text passwords
- Hash passwords with bcrypt (work factor 12+)
- Encrypt sensitive profile data
- Sanitize user inputs
- Validate all user data

### Session Security
- Use HTTP-only cookies for refresh tokens
- Implement proper JWT signing and verification
- Validate token expiration
- Implement token blacklisting for logout
- Monitor for suspicious session activity

### API Security
- Validate all input parameters
- Implement proper CORS configuration
- Use HTTPS in production
- Implement request rate limiting
- Monitor for abuse patterns

## Monitoring

### Key Metrics
- User registration rate
- Authentication success/failure rate
- Active session count
- Profile update frequency
- Security event frequency

### Alerts
- Unusual registration patterns
- Multiple failed login attempts
- Account lock events
- Suspicious profile changes
- Security configuration changes

### Logging
- User registration events
- Authentication events (success/failure)
- Profile update events
- Security-related events
- Administrative actions

## Migration Considerations

### Data Migration
- Plan for password hash algorithm updates
- Consider profile schema evolution
- Plan for preference structure changes
- Consider audit trail requirements

### Feature Rollout
- Gradual feature enablement
- A/B testing for new features
- Feature flag management
- User feedback collection

## Related Modules
- **Wallets Module**: User-wallet relationships
- **Vaults Module**: User-vault relationships
- **Risk Module**: User risk profiles
- **Notifications Module**: User notification preferences
- **Analytics Module**: User behavior analytics