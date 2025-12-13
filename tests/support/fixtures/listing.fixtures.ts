import { test as base } from './test-fixtures';
import { createClientRows, createListingRow, createTreeListing } from '../factories/listing-factories';

export const test = base.extend<{
  listingRows: ReturnType<typeof createListingRow>[],
  treeListing: ReturnType<typeof createTreeListing>,
  clients: ReturnType<typeof createClientRows>,
}>({
  listingRows: async ({}, use) => {
    await use([createListingRow(), createListingRow(), createListingRow()]);
  },
  treeListing: async ({}, use) => {
    await use(createTreeListing());
  },
  clients: async ({}, use) => {
    await use(createClientRows());
  },
});
