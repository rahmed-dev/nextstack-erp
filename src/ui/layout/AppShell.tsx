import React from "react";

type Props = {
  children: React.ReactNode;
};

export function AppShell({ children }: Props) {
  return (
    <div>
      <header>
        <h1>NextStack ERP</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}

