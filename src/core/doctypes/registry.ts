import type { DocTypeDefinition } from "./index";
import { SalesInvoice } from "../../modules/accounting/doctypes/sales_invoice";
import { ChartOfAccounts } from "../../modules/accounting/doctypes/chart_of_accounts";
import { Client } from "../../modules/crm/doctypes/client";
import { Vendor } from "../../modules/crm/doctypes/vendor";

export const doctypes: DocTypeDefinition[] = [
  ChartOfAccounts,
  Client,
  Vendor,
  SalesInvoice
];
