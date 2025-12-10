// Thin API layer for accounting module, consumed by React features.

import { documentService } from "../../../core/document/service";

export async function listSalesInvoices() {
  return documentService.list("SalesInvoice");
}

