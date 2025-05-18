---
id: 8f72ac0f-204f-4227-a2a0-c04d2c86fc44
title: 'The Pragmatic Guide to Playwright Testing'
slug: the-pragmatic-guide-to-playwright-testing
layout: blog
published: true
publishedAt: '2025-05-16'
categories: ['testing', 'automation', 'web development', 'quality assurance']
author: 'Kyrre Gjerstad'
description: 'A comprehensive guide to writing effective and maintainable Playwright tests, covering best practices, patterns, and real-world examples.'
seoTitle: 'The Pragmatic Guide to Playwright Testing: Best Practices & Patterns'
seoDescription: 'Learn how to write effective and maintainable Playwright tests with this comprehensive guide. Covers best practices, patterns, and real-world examples from production environments.'
seoKeywords:
  [
    'playwright',
    'testing',
    'automation',
    'end-to-end testing',
    'e2e tests',
    'web testing',
    'test automation',
    'quality assurance',
    'QA',
    'javascript testing',
    'typescript testing',
  ]
---

This guide covers techniques and best practices for Playwright testing, building upon my [basic setup guide](/blog/end-to-end-testing-setup). You'll learn patterns and practices that have been proven effective after using Playwright for years in production environments.

## User Centric Testing

My favorite part of Playwright is the ability to write tests that are focused on the user's experience rather than the implementation details. Your tests should mirror how real users interact with your application, focusing on what they see and do rather than internal state or DOM structure.

For example, instead of testing if a specific CSS class is applied to show an error message:

```typescript
// ❌ Implementation-focused:
await expect(page.locator('#error-message.visible')).toBeVisible();
```

```typescript
// ✅ User-focused:
await expect(page.getByText('Please enter a valid email')).toBeVisible();
```

This approach not only makes your tests more resilient to implementation changes but also ensures you're testing what actually matters to your users. Consider these principles:

- Use role-based selectors (`getByRole('button')`) over CSS selectors
- Test what users see (`getByText()`, `getByLabel()`) rather than internal state
- Verify meaningful outcomes instead of implementation details
- Structure test scenarios around user stories and workflows
- Include accessibility checks in your test suite

### When to Use data-testid vs Text Selectors

While I emphasize user-centric testing with text selectors, there are valid cases for using `data-testid` attributes. Here's when to use each approach:

#### Text Selectors (Preferred)

```typescript
// ✅ Use for static, user-visible content
await page.getByText('Submit').click();
await page.getByLabel('Email').fill('user@example.com');
await page.getByRole('button', { name: 'Sign Up' }).click();
```

Text selectors are preferred because they:

- Test what users actually see and interact with
- Break when the user experience changes (which is what you want)
- Support accessibility testing naturally

#### Data Test IDs

```typescript
// ✅ Use for dynamic or structural elements
await page.getByTestId('user-dropdown').click();
await page.getByTestId('notification-badge').isVisible();
```

Use `data-testid` when:

- The text content is dynamic (like timestamps or counts)
- Testing structural elements that don't have meaningful text
- Dealing with repeating elements that need unique identification
- Testing components that are visually identical but semantically different
- The copy changes often or comes from an external source

For example, a notification badge might look like this:

```svelte
<div data-testid="notification-badge">
	{notificationCount} new messages
</div>
```

Here, using `data-testid` makes sense because the text content changes, but we still want to test the badge's presence or visibility.

#### Hybrid Approach

Often, the best strategy is to combine both methods:

```typescript
// Find the specific user card first
const userCard = page.getByTestId('user-card-123');

// Then interact with elements inside it using text
await userCard.getByText('Edit Profile').click();
await expect(userCard.getByText('Admin')).toBeVisible();
```

This approach gives you the stability of `data-testid` for structure while maintaining the user-centric testing philosophy for interactions.

---

## POMs and Fixtures

### Page Object Model (POM)

The [Page Object Model (POM)](https://playwright.dev/docs/pom) pattern initially presented me with mixed feelings. While it promises better test abstraction, it can also introduce complexity. For instance, using VSCode's test recorder extension becomes impossible when working with a POM structure.

However, my perspective shifted when I discovered how POMs work in conjunction with the Base Fixture pattern (detailed below).

The decision to use the Page Object Model (POM) should be based on the size of your application. If you have a large application, it helps organize and maintain your tests. If you see that changing pages is repetitive, it may be a good idea to create a POM. For smaller applications, it may not be necessary.

#### Pros of Using POMs

##### Type Safety

- TypeScript integration works well with POMs
- Method autocompletion and compile-time checks
- Easier refactoring with IDE support

##### Reusability

- Define complex selectors once, use everywhere
- Common workflows can be encapsulated
- Share page objects across different test suites

##### Maintenance

- When the UI changes, you only update one place
- Easier to manage selectors across multiple tests
- Clear separation between test logic and page interactions

#### Cons of Using POMs

##### Development Speed

- Initial setup takes longer
- More files and boilerplate to manage
- Cannot use codegen/recorder tools effectively

##### Learning Curve

- New team members need to understand the pattern
- May overcomplicate simple tests
- Requires agreement on POM structure/conventions

##### Practical Challenges

- Can be overkill for small/static pages
- Dynamic content can be harder to model
- Risk of creating overly complex page objects

#### Example POM

```ts
// tests/e2e/poms/home.ts
import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
	readonly url: string;
	readonly page: Page;
	readonly header: Locator;

	constructor(page: Page) {
		this.url = '/';
		// we allow the page to be accessed directly
		// as an escape hatch if we need to
		this.page = page;
		this.header = page.getByTestId('home-page-header');
	}

	async goto() {
		await this.page.goto(this.url, { waitUntil: 'commit' });
	}

	async isReady() {
		return expect(this.header).toBeVisible();
	}
}
```

#### Keep POMs Simple and User-Focused

When designing POMs, think like an end user visiting the page. Your page objects should reflect what users see and do, not implementation details.
Methods should describe actions from a user's perspective: `searchForProduct()`, `addToCart()`, `proceedToCheckout()`. This makes tests more intuitive to write and easier to maintain.

A good test using a well-designed POM should read like a user story:

```ts
await homePage.goto();
await homePage.searchForProduct('laptop');
await productPage.addToCart();
await cartPage.proceedToCheckout();
```

### Base Fixtures

Creating a base fixture is a great way to extend Playwright's test functionality and add the POMs as fixtures. This way, you avoid having to import the POMs in every test file and call `new POM(page)` in each test.

Create a `base.ts` file to extend Playwright's test functionality and add the POMs as fixtures:

```ts
// tests/e2e/base.ts
import { test as base } from '@playwright/test';
import { HomePage } from './poms/home';

type Pages = {
	homePage: HomePage;
	// Add other page objects as needed
};

const test = base.extend<Pages>({
	homePage: async ({ page }, use) => {
		await use(new HomePage(page));
	},
});

export { expect } from '@playwright/test';
export { test };
```

Now, instead of using the `test` from Playwright, you can use the `test` from the base file, and access the POMs as fixtures:

```ts
import { test } from '../base'; // note the import

test('homepage should display main content', async ({ homePage }) => {
	await homePage.goto();
	await expect(homePage.header).toBeVisible();
});
```

---

## Flaky Tests are Worse than No Tests

Having flaky tests can be a massive productivity drain and a huge frustration. A flaky test is one that passes inconsistently, often due to timing issues or race conditions.

Playwright offers a great way to check for flaky tests.

```bash
pnpm playwright test --repeat-each 10
```

This will run each test 10 times and give you a good indication of how reliable your tests are. You should run this before committing making changes to your tests to ensure you're not introducing new flakiness.

### Retry Assertions

Modern web frameworks often have hydration periods where the UI isn't immediately interactive. Your code should be handling this by rendering the appropriate UI, but sometimes you need to retry an assertion until it passes.

```typescript
await expect(async () => {
	await page.click({ timeout: 500 });
	await expect(page.getByText('Some text')).toBeVisible({ timeout: 500 });
}).toPass();
```

This runs the assertion in the expect block in a loop until it passes or the timeout is reached, perfect for those cases where you want to retry a flaky assertion. You want to set the individual timeout to a short duration, like 500ms, since the expect block itself will have a staggered timeout.

### Best Practices for Test Reliability

```typescript
// ❌ Avoid fixed timeouts:
await page.waitForTimeout(2000); // Not recommended
```

Fixed timeouts are problematic because they make tests slower than necessary, forcing you to wait the full duration even if the element is ready sooner. They're also inherently unreliable - sometimes 2 seconds isn't enough, while other times it's far too much. Fixed timeouts don't adapt to different environments, so what works on your fast local machine might fail in CI. Most importantly, they hide underlying issues by papering over race conditions with delays instead of fixing the root cause.

```typescript
// ✅ Use Playwright's built-in expectations:
await expect(page.getByText('Loading')).toBeHidden();
await page.waitForSelector('.content-loaded');
```

Playwright's built-in expectations are designed to be more reliable and less prone to flakiness. They're also more efficient, avoiding unnecessary retries and delays.

---

## Conclusion

Following these best practices will help you create a robust, maintainable test suite that provides real value to your project. Remember that testing is an iterative process - start simple and gradually add more sophisticated patterns as your needs grow.

---

_This guide is based on real-world experience with Playwright in production applications. For basic setup instructions, see my companion guide "[Setting Up End-to-End Testing with Playwright](/blog/end-to-end-testing-setup) and [Continuous Integration for Playwright Tests](/blog/playwright-ci-cd)"._
