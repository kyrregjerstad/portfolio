---
title: Playwright Testing Best Practices and Tips
published: true
publishedAt: '2024-11-12'
categories: ['svelte', 'testing']
---

# Playwright Testing Best Practices and Tips

This guide covers techniques and best practices for Playwright testing, building upon my [basic setup guide](/blog/end-to-end-testing). You'll learn patterns and practices that have been proven effective in production environments.

## POMs and Fixtures

### Page Object Model (POM)

It took me a while to get the benefits of the Page Object Model (POM). On one hand, it's a good idea to keep your tests at the right level of abstraction. On the other hand, it can add unnecessary complexity to your tests. For example, if you want to use the vscode extension to generate tests while recording your actions, it's not possible if you have a POM.

If was first when I discovered POMs in the combination with the Base Fixture pattern (see below) I was convinced.

The decision to use the Page Object Model (POM) should be based on the size of your application. If you have a large application, it helps organize and maintain your tests. If you see that changing pages is repetitive, it may be a good idea to create a POM. For smaller applications, it may not be necessary.

It's purpose is to make your tests more readable and maintainable, while reducing code duplication. It also makes writing tests operate at the right level of abstraction, where you can focus on the page interactions and not the implementation details.

```ts
// tests/e2e/poms/home.ts
import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
	readonly url: string;
	readonly page: Page;
	readonly contentArea: Locator;

	constructor(page: Page) {
		this.url = '/';
		// we allow the page to be accessed directly
		// as an escape hatch if we need to
		this.page = page;
		this.contentArea = page.getByTestId('main-content');
	}

	async goto() {
		await this.page.goto(this.url, { waitUntil: 'commit' });
	}

	async isReady() {
		return expect(this.contentArea).toBeVisible();
	}
}
```

### Base Fixture

Create a `base.ts` file to extend Playwright's test functionality and add the POMs as fixtures:

```ts
// tests/e2e/base.ts
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

Now, instead of using the `test` from Playwright, you can use the `test` from the base file, and access the POMs as fixtures:

```ts
import { test } from '../base';

test('homepage should display main content', async ({ homePage }) => {
	await homePage.goto();
	await expect(homePage.contentArea).toBeVisible();
});
```

The tests are now more readable and maintainable, and work at the right level of abstraction. It doesn't concern itself with the implementation details, but rather the interactions with the page.

## Writing Robust Tests

### Handling UI Hydration Issues

Modern web frameworks often have hydration periods where the UI isn't immediately interactive. Here's a pattern for handling such cases:

```typescript
await expect(async () => {
	await page.click({ timeout: 500 });
	await expect(page.getByText('Some text')).toBeVisible({ timeout: 500 });
}).toPass();
```

This runs the assertion in the expect block in a loop until it passes or the timeout is reached, perfect for those cases where you want to retry a flaky test. You probably want to set the individual timeout to a short duration, like 500ms, since the expect block itself will have a staggard timeout.

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

## Advanced Testing Patterns

### Testing Forms

```typescript
test('form submission', async ({ page }) => {
	// Fill form fields using data-testid attributes
	await page.getByTestId('name-input').fill('John Doe');
	await page.getByTestId('email-input').fill('john@example.com');

	// Submit form
	await page.getByRole('button', { name: 'Submit' }).click();

	// Verify success state
	await expect(page.getByTestId('success-message')).toBeVisible();
});
```

### Testing API Interactions

```typescript
test('api interaction', async ({ page }) => {
	// Mock API response
	await page.route('**/api/data', async (route) => {
		await route.fulfill({
			status: 200,
			body: JSON.stringify({ message: 'Success' }),
		});
	});

	// Trigger API call
	await page.click('#fetch-data');

	// Verify UI updates
	await expect(page.getByText('Success')).toBeVisible();
});
```

## Debugging Techniques

### Visual Debugging

Use UI mode for local development:

```bash
pnpm test:e2e:ui
```

### Trace Viewer

Configure automatic trace capture for failed tests:

```typescript
// playwright.config.ts
export default {
	use: {
		trace: 'retain-on-failure',
	},
};
```

### Test Reports

Generate detailed HTML reports:

```bash
pnpm test:e2e --reporter=html
```

## Performance Testing

### Measuring Page Load Metrics

```typescript
test('page load performance', async ({ page }) => {
	const startTime = Date.now();

	await page.goto('/');

	const metrics = await page.evaluate(() => ({
		fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
		lcp: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime,
	}));

	expect(metrics.fcp).toBeLessThan(1000);
	expect(metrics.lcp).toBeLessThan(2500);
});
```

## Common Pitfalls and Solutions

### Race Conditions

❌ Unreliable:

```typescript
await page.click('#button');
await page.getByText('Updated').isVisible();
```

✅ Reliable:

```typescript
await page.click('#button');
await expect(page.getByText('Updated')).toBeVisible();
```

### Dynamic Content

❌ Brittle:

```typescript
await page.waitForTimeout(1000);
await page.click('.dynamic-element');
```

✅ Robust:

```typescript
await page.waitForSelector('.dynamic-element');
await page.click('.dynamic-element');
```

## Tips for Test Maintenance

1. Use data-testid attributes for stable selectors
2. Implement shared utilities for common operations
3. Keep tests focused and independent
4. Use meaningful test descriptions
5. Regular maintenance and updates

## Conclusion

Following these best practices will help you create a robust, maintainable test suite that provides real value to your project. Remember that testing is an iterative process - start simple and gradually add more sophisticated patterns as your needs grow.

---

_This guide is based on real-world experience with Playwright in production applications. For basic setup instructions, see my companion guide "[Setting Up End-to-End Testing with Playwright](/blog/end-to-end-testing)"._
