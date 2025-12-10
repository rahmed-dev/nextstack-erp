// Central registry for DocType metadata definitions.
// Each DocType module should export its schema and register it here.

export type FieldDefinition = {
  name: string; // snake_case
  label: string;
  type: string;
  required?: boolean;
};

export type DocTypeDefinition = {
  name: string; // PascalCase identifier, e.g. "SalesInvoice"
  table: string; // snake_case plural table name, e.g. "sales_invoices"
  fields: FieldDefinition[];
};

export const doctypes: DocTypeDefinition[] = [];

