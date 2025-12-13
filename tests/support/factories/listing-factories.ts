export type ListingRow = {
  id: string;
  name: string;
  type?: string;
  status?: 'active' | 'archived' | 'draft';
  entity?: string;
  children?: ListingRow[];
};

const randomId = () => Math.random().toString(36).slice(2, 10);
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomName = (prefix: string) => `${prefix}-${randomId()}`;

export const createListingRow = (overrides: Partial<ListingRow> = {}): ListingRow => ({
  id: overrides.id ?? randomId(),
  name: overrides.name ?? randomName('Item'),
  type: 'list',
  status: 'active',
  entity: 'main',
  children: [],
  ...overrides,
});

export const createTreeListing = (count = 3): ListingRow[] => {
  const parents = Array.from({ length: count }, () =>
    createListingRow({
      type: 'tree',
      children: [createListingRow({ type: 'tree-leaf' }), createListingRow({ type: 'tree-leaf' })],
    }),
  );
  return parents;
};

export const createClientRows = (count = 5): ListingRow[] =>
  Array.from({ length: count }, () =>
    createListingRow({
      name: randomName('Client'),
      type: 'client',
      status: pick(['active', 'archived', 'draft']),
    }),
  );
