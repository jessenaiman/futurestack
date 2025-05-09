# LobeChat Integration Test Suite

This test suite validates the integration between LobeChat, Coolify, and Traefik, ensuring all components work together seamlessly.

## 🚀 Quick Start

### Prerequisites

- Node.js 16 or higher
- Docker and Docker Compose
- Running instances of:
  - Coolify
  - Traefik
  - LobeChat deployment

### Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env
```

Required environment variables:

- `TEST_BASE_URL`: Base URL for the LobeChat instance
- `TEST_DOMAIN`: Domain name for the deployment
- `TEST_USER`: Test user email
- `TEST_PASSWORD`: Test user password

### Running Tests

Run all tests:

```bash
npm test
```

Run specific test groups:

```bash
# Run deployment tests only
npx playwright test deployment

# Run storage integration tests
npx playwright test storage

# Run authentication tests
npx playwright test auth
```

Run tests in UI mode:

```bash
npx playwright test --ui
```

Generate and view test report:

```bash
npx playwright show-report
```

## 📚 Test Coverage

The test suite covers:

### 1. Deployment & Access

- Traefik routing and SSL
- HTTP to HTTPS redirection
- Service accessibility

### 2. Storage Integration

- MinIO file uploads
- PostgreSQL data persistence
- File handling and retrieval

### 3. Authentication

- Casdoor integration
- Login/logout flows
- Session management

### 4. Service Health

- Database connectivity
- Storage service availability
- Authentication service status

### 5. Performance

- Page load times
- File upload efficiency
- Response times

### 6. Error Handling

- Service disruption handling
- Retry mechanisms
- Error state recovery

## 🔧 Configuration

### Test Timeouts

Modify `playwright.config.ts` to adjust:

- Global test timeout
- Navigation timeout
- Action timeout

### Parallel Execution

Tests are organized to run in parallel by default. Modify parallel execution in:

- Individual test files using `test.describe.parallel()`
- Global settings in `playwright.config.ts`

### Reporting

Test results are available in multiple formats:

- HTML report
- JUnit XML
- Console output

## 🤝 Contributing

When adding new tests:

1. Follow the existing structure in `tests/integration/`
2. Add appropriate test helpers in `tests/utils/`
3. Update this README if adding new test categories
4. Ensure tests are properly isolated

## 🐛 Troubleshooting

Common issues:

1. **Authentication Failures**
   - Verify Casdoor configuration
   - Check test user credentials
   - Ensure auth state is properly managed

2. **Service Connection Issues**
   - Verify all services are running
   - Check network configuration
   - Validate Traefik routing

3. **Test Timeouts**
   - Adjust timeouts in config
   - Check service response times
   - Verify resource availability

## 📝 Test Maintenance

Regular maintenance tasks:

1. Update test data
2. Clean up test artifacts
3. Verify service configurations
4. Update dependencies
5. Review and update timeouts

## 🚨 CI/CD Integration

The test suite is configured for CI/CD:

- GitHub Actions compatible
- Parallel execution support
- Artifact preservation
- Failure screenshots and videos
