---
title: Continuous Integration for Playwright Tests
id: 44229f37-6282-4aa0-a03f-c784ef6c6e0e
published: true
publishedAt: '2024-11-12'
categories: ['svelte', 'testing', 'ci-cd']
slug: playwright-ci-cd
---

# Setting Up Continuous Integration for Playwright Tests

This guide covers how to set up and optimize continuous integration for your Playwright tests, ensuring reliable automated testing across different environments.

## GitHub Actions Setup

Here's a comprehensive GitHub Actions workflow for running Playwright tests:

```yaml
name: E2E Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1/3, 2/3, 3/3] # Split tests into 3 parallel jobs

    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: Build application
        run: pnpm build

      - name: Run E2E tests
        run: pnpm test:e2e --shard ${{ matrix.shard }}
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report-${{ matrix.shard }}
          path: playwright-report/
          retention-days: 30
```

## Test Sharding for Parallel Execution

Configure test sharding in your `playwright.config.ts`:

```typescript
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	testDir: './tests',
	workers: process.env.CI ? 1 : undefined,
	fullyParallel: true,
	reporter: process.env.CI ? [['html'], ['github'], ['junit', { outputFile: 'results.xml' }]] : 'list',
	use: {
		trace: 'retain-on-failure',
		video: 'on-first-retry',
	},
};

export default config;
```

## Environment Management

### Setting Up Environment Variables

Create a `.env.ci` file for CI-specific configurations:

```bash
BASE_URL=https://staging.yourapp.com
TEST_TIMEOUT=60000
PLAYWRIGHT_BROWSERS_PATH=0
```

### Managing Secrets

Store sensitive information in GitHub Secrets:

1. Navigate to repository settings
2. Go to Secrets and Variables > Actions
3. Add your secrets:
   - `TEST_USER_EMAIL`
   - `TEST_USER_PASSWORD`
   - `BASE_URL`

## Optimizing CI Performance

### Caching Strategies

Add browser caching to your workflow:

```yaml
- name: Cache Playwright browsers
  uses: actions/cache@v3
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: playwright-${{ runner.os }}-

- name: Install Playwright browsers
  if: steps.playwright-cache.outputs.cache-hit != 'true'
  run: pnpm exec playwright install --with-deps
```

### Test Retries

Configure retries in `playwright.config.ts`:

```typescript
const config: PlaywrightTestConfig = {
	retries: process.env.CI ? 2 : 0,
	reporter: [['html'], ['json', { outputFile: 'test-results.json' }]],
};
```

## Handling Test Reports

### HTML Report Generation

```yaml
- name: Merge test reports
  if: always()
  run: |
    pnpm playwright merge-reports ./playwright-report-*

- name: Upload merged report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report
    retention-days: 30
```

### Slack Notifications

Add Slack notifications for test results:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    fields: repo,message,commit,author,action,eventName,ref,workflow
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Best Practices for CI/CD

1. **Reliable Test Environment**

   - Use dedicated test databases
   - Reset state between test runs
   - Use consistent test data

2. **Resource Management**

   - Implement proper cleanup
   - Use appropriate timeout values
   - Monitor resource usage

3. **Failure Analysis**

   - Save test artifacts
   - Implement detailed logging
   - Set up error notifications

4. **Performance Optimization**
   - Use test sharding
   - Implement efficient caching
   - Regular maintenance of CI pipelines

## Conclusion

A well-configured CI/CD pipeline is crucial for maintaining reliable end-to-end tests. By following these practices and configurations, you can create a robust automated testing process that catches issues early and maintains high code quality.

---

_This guide is part of my Playwright testing series. For setup instructions and best practices, see our companion guides "Setting Up End-to-End Testing with SvelteKit and Playwright" and "Playwright Testing Best Practices and Tips"._
