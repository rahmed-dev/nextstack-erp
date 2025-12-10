import { useEffect, useState } from "react";
import { listSalesInvoices } from "../../modules/accounting/api";

type SalesInvoiceRow = {
  id: string;
  customer_name: string;
};

export function useSalesInvoiceList() {
  const [data, setData] = useState<SalesInvoiceRow[] | null>(null);
  const [error, setError] = useState<null | { code: string; message: string }> (null);

  useEffect(() => {
    void (async () => {
      const result = await listSalesInvoices();
      if (result.error) {
        setError(result.error);
      } else {
        setData(result.data as SalesInvoiceRow[]);
      }
    })();
  }, []);

  return { data, error };
}

