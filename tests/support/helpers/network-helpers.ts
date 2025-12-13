import { Page } from '@playwright/test';

export const interceptBeforeNavigate = async (page: Page, urlSubstring: string) => {
  const responsePromise = page.waitForResponse((resp) => resp.url().includes(urlSubstring));
  return responsePromise;
};
