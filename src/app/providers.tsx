import React from "react";

type Props = {
  children: React.ReactNode;
};

export function AppProviders({ children }: Props) {
  // Later: wrap with QueryClientProvider, Zustand stores, theming, etc.
  return <>{children}</>;
}

