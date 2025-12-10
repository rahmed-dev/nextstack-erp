import React from "react";

export function SalesInvoiceDraftPage() {
  const [client, setClient] = React.useState("");
  const [invoiceDate, setInvoiceDate] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [currency, setCurrency] = React.useState("USD");

  const [quantity, setQuantity] = React.useState("1");
  const [rate, setRate] = React.useState("0");
  const [taxRate, setTaxRate] = React.useState("0");
  const [discountRate, setDiscountRate] = React.useState("0");

  const [totalNet, setTotalNet] = React.useState(0);
  const [totalTax, setTotalTax] = React.useState(0);
  const [totalDiscount, setTotalDiscount] = React.useState(0);
  const [totalGrand, setTotalGrand] = React.useState(0);

  const [status] = React.useState<"Draft">("Draft");

  const [clientError, setClientError] = React.useState("");
  const [quantityError, setQuantityError] = React.useState("");

  function handleSave(event: React.FormEvent) {
    event.preventDefault();

    setClientError("");
    setQuantityError("");

    const trimmedClient = client.trim();
    const quantityNumber = Number(quantity);
    const rateNumber = Number(rate);
    const taxRateNumber = Number(taxRate) || 0;
    const discountRateNumber = Number(discountRate) || 0;

    let hasError = false;

    if (!trimmedClient) {
      setClientError("Client is required.");
      hasError = true;
    }

    if (!Number.isFinite(quantityNumber) || quantityNumber <= 0) {
      setQuantityError("Quantity must be a positive number.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const net = quantityNumber * rateNumber;
    const taxAmount = net * (taxRateNumber / 100);
    const discountAmount = net * (discountRateNumber / 100);
    const grand = net + taxAmount - discountAmount;

    setTotalNet(net);
    setTotalTax(taxAmount);
    setTotalDiscount(discountAmount);
    setTotalGrand(grand);
  }

  return (
    <section>
      <h2>Sales Invoice (Draft)</h2>
      <form onSubmit={handleSave}>
        <div>
          <label htmlFor="sales-invoice-client-input">Client</label>
          <input
            id="sales-invoice-client-input"
            data-testid="sales-invoice-client"
            value={client}
            onChange={(event) => setClient(event.target.value)}
          />
          {clientError && (
            <p data-testid="sales-invoice-error-client">{clientError}</p>
          )}
        </div>

        <div>
          <label htmlFor="sales-invoice-invoice-date-input">Invoice Date</label>
          <input
            id="sales-invoice-invoice-date-input"
            type="date"
            data-testid="sales-invoice-invoice-date"
            value={invoiceDate}
            onChange={(event) => setInvoiceDate(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="sales-invoice-due-date-input">Due Date</label>
          <input
            id="sales-invoice-due-date-input"
            type="date"
            data-testid="sales-invoice-due-date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="sales-invoice-currency-input">Currency</label>
          <input
            id="sales-invoice-currency-input"
            data-testid="sales-invoice-currency"
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="sales-invoice-line-quantity-input">Quantity</label>
          <input
            id="sales-invoice-line-quantity-input"
            data-testid="sales-invoice-line-quantity"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
          {quantityError && (
            <p data-testid="sales-invoice-error-quantity">{quantityError}</p>
          )}
        </div>

        <div>
          <label htmlFor="sales-invoice-line-rate-input">Rate</label>
          <input
            id="sales-invoice-line-rate-input"
            data-testid="sales-invoice-line-rate"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="sales-invoice-tax-rate-input">Tax %</label>
          <input
            id="sales-invoice-tax-rate-input"
            data-testid="sales-invoice-tax-rate"
            value={taxRate}
            onChange={(event) => setTaxRate(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="sales-invoice-discount-rate-input">Discount %</label>
          <input
            id="sales-invoice-discount-rate-input"
            data-testid="sales-invoice-discount-rate"
            value={discountRate}
            onChange={(event) => setDiscountRate(event.target.value)}
          />
        </div>

        <button type="submit" data-testid="sales-invoice-save">
          Save
        </button>
      </form>

      <div>
        <p data-testid="sales-invoice-status">Draft</p>
        <p data-testid="sales-invoice-total-net">{totalNet.toFixed(2)}</p>
        <p data-testid="sales-invoice-total-tax">{totalTax.toFixed(2)}</p>
        <p data-testid="sales-invoice-total-discount">
          {totalDiscount.toFixed(2)}
        </p>
        <p data-testid="sales-invoice-total-grand">
          {totalGrand.toFixed(2)}
        </p>
      </div>
    </section>
  );
}

