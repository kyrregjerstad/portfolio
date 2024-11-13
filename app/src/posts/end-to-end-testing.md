---
title: End-to-end testing with SvelteKit
published: true
publishedAt: '2024-11-12'
categories: ['svelte', 'testing']
---

# Setting Up End-to-End Testing with Playwright: A Comprehensive Guide

End-to-end (E2E) testing is crucial for verifying that your web application works correctly from a user's perspective. In this guide, we'll walk through setting up and organizing E2E tests using Playwright and pnpm, with patterns that work equally well for both monorepos and standard repositories.

## Setting Up Your Testing Environment

Whether you're working with a monorepo or a standard repository, you'll want to keep your E2E tests organized. Here are two common approaches:

### Standard Repository Structure

```
your-project/
├── src/
├── tests/
│   └── e2e/
│       ├── tests/
│       ├── poms/
│       └── playwright.config.ts
└── package.json
```

### Monorepo Structure

```
your-monorepo/
├── apps/
│   └── web/
├── packages/
├── tests/
│   └── e2e/
│       ├── tests/
│       ├── poms/
│       └── playwright.config.ts
└── pnpm-workspace.yaml
```

Start by installing Playwright using pnpm:

```bash
# For a standard repository
pnpm add -D @playwright/test

# For a monorepo (from the root)
pnpm add -D @playwright/test --filter tests
```

Add these scripts to your package.json:

```json
{
	"scripts": {
		"test:e2e": "playwright test",
		"test:e2e:ui": "playwright test --ui",
		"test:e2e:debug": "playwright test --debug"
	}
}
```

## Running Your Tests

With Playwright and pnpm, you have several options for running tests:

```bash
# Run all tests
pnpm test:e2e

# Run tests with UI mode
pnpm test:e2e:ui

# Run specific test file
pnpm test:e2e tests/flow.spec.ts

# Additional useful flags
pnpm test:e2e --workers=4          # Control parallel execution
pnpm test:e2e --repeat-each=3      # Identify flaky tests
pnpm test:e2e --update-snapshots   # Update visual comparisons
```

## Writing Robust Tests

### Handling UI Hydration Issues

Modern web frameworks often have hydration periods where the UI isn't immediately interactive. Here's a robust pattern for handling such cases in Playwright:

```typescript
await expect(async () => {
	await page.click({ timeout: 500 });
	await expect(page.getByText('Some text')).toBeVisible({ timeout: 500 });
}).toPass();
```

### Best Practices for Test Reliability

❌ Avoid fixed timeouts:

```typescript
await page.waitForTimeout(2000); // Not recommended
```

✅ Use Playwright's built-in expectations:

```typescript
await expect(page.getByText('Loading')).toBeHidden();
await page.waitForSelector('.content-loaded');
```

## Implementing the Page Object Model

Playwright works exceptionally well with the Page Object Model (POM) pattern. Here's how to structure your page objects:

```typescript
import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
	readonly url: string;
	readonly page: Page;
	readonly contentArea: Locator;

	constructor(page: Page) {
		this.url = '/';
		this.page = page;
		this.contentArea = page.getByTestId('main-content');
	}

	async goto() {
		await this.page.goto(this.url, { waitUntil: 'commit' });
		await this.isReady();
	}

	async isReady() {
		return expect(this.contentArea).toBeVisible();
	}
}
```

### Setting Up a Base Test File

Create a `base.ts` file to extend Playwright's test functionality:

```typescript
import { test as base } from '@playwright/test';
import { HomePage } from './poms/home';

type Pages = {
	homePage: HomePage;
	// Add other page objects as needed
};

export const test = base.extend<Pages>({
	homePage: async ({ page }, use) => {
		await use(new HomePage(page));
	},
});

export { expect } from '@playwright/test';
```

Now you can use these fixtures in your tests:

```typescript
import { test } from '../base';

test('homepage should display main content', async ({ homePage }) => {
	await homePage.goto();
	await expect(homePage.contentArea).toBeVisible();
});
```

## Managing Authentication

Playwright provides excellent support for handling authentication states. Here's a setup that works well in both monorepo and standard repository contexts:

```typescript
// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
	const browser = await chromium.launch();
	const page = await browser.newPage();

	// Perform login
	await page.goto(process.env.BASE_URL);
	await page.fill('[name="email"]', process.env.TEST_USER_EMAIL);
	await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD);
	await page.click('button[type="submit"]');
	await page.waitForURL('**/dashboard');

	// Save signed-in state
	await page.context().storageState({
		path: './tests/auth.json',
	});

	await browser.close();
}

export default globalSetup;
```

Reference this in your `playwright.config.ts`:

```typescript
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	testDir: './tests',
	globalSetup: require.resolve('./global-setup'),
	use: {
		storageState: './tests/auth.json',
		baseURL: process.env.BASE_URL,
	},
};

export default config;
```

## Debugging Failed Tests

Playwright provides excellent debugging tools, particularly useful for CI environments:

1. **Trace Viewer**: Automatically capture traces for failed tests:

```typescript
// playwright.config.ts
export default {
	use: {
		trace: 'retain-on-failure',
	},
};
```

2. **Test Reports**: Generate detailed HTML reports:

```bash
pnpm test:e2e --reporter=html
```

3. **Visual Debugging**: Use UI mode for local development:

```bash
pnpm test:e2e:ui
```

## Continuous Integration Setup

Here's a basic GitHub Actions workflow that works well with this setup:

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: Run E2E tests
        run: pnpm test:e2e
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Conclusion

This setup provides a robust foundation for E2E testing with Playwright, whether you're working in a monorepo or standard repository. The combination of Playwright's powerful features and pnpm's efficient package management creates a maintainable and scalable testing environment.

Key benefits of this setup include:

- Clear organization of test files
- Efficient handling of authentication
- Reusable page objects
- Powerful debugging tools
- CI/CD integration
- Works equally well for monorepos and standard repositories

Remember that E2E tests are just one part of a comprehensive testing strategy, but with this setup, you'll have a solid foundation for ensuring your application works as intended from the user's perspective.

---

_This guide is based on real-world experience with Playwright in production applications. The patterns and practices described here have been proven effective in both monorepo and standard repository setups._
