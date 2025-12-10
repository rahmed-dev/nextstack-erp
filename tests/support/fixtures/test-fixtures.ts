import { test as base, expect } from '@playwright/test';

type AppFixtures = {
  // Placeholders for future fixtures (auth, API, data factories, etc.)
};

export const test = base.extend<AppFixtures>({});

export { expect };

