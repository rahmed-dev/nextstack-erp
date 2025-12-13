import React from "react";
import ReactDOM from "react-dom/client";
import { AppProviders } from "./app/providers";
import { AppRouter } from "./app/router";

const mockData = {
  chartOfAccounts: [
    { id: "assets", name: "Assets", status: "active", entity: "main" },
    { id: "cash", name: "Cash", status: "active", entity: "main" }
  ],
  chartOfAccountsTree: [
    {
      id: "assets",
      name: "Assets",
      status: "active",
      entity: "main",
      children: [{ id: "cash", name: "Cash", status: "active", entity: "main" }]
    }
  ],
  clients: [
    { id: "client-0", name: "Acme Corp", status: "active", entity: "main" },
    { id: "client-1", name: "Globex", status: "draft", entity: "main" }
  ],
  vendors: [
    { id: "vendor-0", name: "Stark Supply", status: "active", entity: "main" }
  ]
};

function installMockFetch() {
  if (typeof window === "undefined" || typeof window.fetch !== "function") {
    return;
  }

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();

    const respond = (body: unknown) =>
      Promise.resolve(
        new Response(JSON.stringify(body), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        })
      );

    if (url.includes("/api/chart-of-accounts/tree")) {
      return respond(mockData.chartOfAccountsTree);
    }

    if (url.includes("/api/chart-of-accounts")) {
      return respond(mockData.chartOfAccounts);
    }

    if (url.includes("/api/clients")) {
      return respond(mockData.clients);
    }

    if (url.includes("/api/vendors")) {
      return respond(mockData.vendors);
    }

    return originalFetch(input, init);
  };
}

const rootElement = document.getElementById("root");

if (rootElement) {
  installMockFetch();

  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </React.StrictMode>
  );
}
