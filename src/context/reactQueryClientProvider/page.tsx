"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a new query client instance
const queryClient = new QueryClient();

export default function ReactQueryClientProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <>{children}</>
      </QueryClientProvider>
    </>
  );
}
