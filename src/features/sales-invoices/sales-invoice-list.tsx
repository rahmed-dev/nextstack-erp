import React from "react";
import { useSalesInvoiceList } from "./use-sales-invoice-list";

export function SalesInvoiceList() {
  const { data, error } = useSalesInvoiceList();

  if (error) {
    return (
      <div>
        <p>Could not load invoices.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Sales Invoices</h2>
      <ul>
        {data?.map((row) => (
          <li key={row.id}>{row.customer_name}</li>
        )) ?? null}
      </ul>
    </div>
  );
}

