# Getting Started with LobeChat Integration Tests

## Overview

We have set up a comprehensive test suite for validating the integration between LobeChat, Coolify, and Traefik. This document provides a quick guide for test team members to get started.

## Files Structure

```
tests/
├── integration/
│   └── lobe-chat.spec.ts     # Main integration test suite
├── utils/
│   └── auth.ts               # Authentication utilities
├── playwright.config.ts      # Test configuration
├── global-setup.ts          # Setup before all tests
├── global-teardown.ts       # Cleanup after all tests
├── .env.example             # Environment variables template
└── README.md               # Detailed documentation
```

## Quick Setup Steps

1. **Clone and Install**

   ```bash
   git clone <repository-url>
   cd future-stack
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp tests/.env.example tests/.env
   # Edit tests/.env with your environment values
   ```

3. **Install Playwright Browsers**

   ```bash
   npx playwright install
   ```

4. **Verify Infrastructure**
   - Ensure Coolify is running and accessible
   - Verify Traefik is properly configured
   - Check LobeChat deployment status

## Running Tests

1. **Full Test Suite**

   ```bash
   npm test
   ```

2. **Specific Test Categories**

   ```bash
   # Deployment tests
   npx playwright test deployment

   # Storage tests
   npx playwright test storage

   # Authentication tests
   npx playwright test auth
   ```

3. **Debug Mode**

   ```bash
   # Run with UI
   npx playwright test --ui

   # Run with debug inspector
   PWDEBUG=1 npx playwright test
   ```

## Test Reports

1. **Generate HTML Report**

   ```bash
   npx playwright show-report
   ```

2. **Find Test Artifacts**
   - Screenshots: `test-results/screenshots/`
   - Videos: `test-results/videos/`
   - Traces: `test-results/traces/`

## Common Issues & Solutions

1. **Authentication Fails**
   - Check if Casdoor is running
   - Verify test user credentials in .env
   - Ensure proper network connectivity

2. **Service Connection Issues**
   - Verify all services are running
   - Check Traefik routing configuration
   - Validate network settings

3. **Test Timeouts**
   - Increase timeouts in playwright.config.ts
   - Check service response times
   - Verify system resources

## Next Steps

1. Review the test coverage in tests/README.md
2. Set up continuous integration with your CI/CD system
3. Add more test cases as needed
4. Configure alerts for test failures
5. Set up regular test maintenance schedule

## Support

- Check tests/README.md for detailed documentation
- Open issues in the repository for bugs
- Contact the development team for infrastructure issues

## Security Notes

- Keep .env file secure and never commit it
- Rotate test credentials regularly
- Monitor test environment access
- Review security configurations periodically
