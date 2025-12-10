// Example DocType definition for SalesInvoice; real fields will come from PRD.

import type { DocTypeDefinition } from "../../../core/doctypes";

export const SalesInvoice: DocTypeDefinition = {
  name: "SalesInvoice",
  table: "sales_invoices",
  fields: [
    { name: "customer_name", label: "Customer", type: "string", required: true },
    { name: "posting_date", label: "Posting Date", type: "date", required: true },
    { name: "due_date", label: "Due Date", type: "date" },
    { name: "outstanding_amount", label: "Outstanding Amount", type: "number" }
  ]
};

