import React from "react";
import SideNav from "../_components/sideNav/page";
import ReactQueryClientProvider from "@/context/reactQueryClientProvider/page";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ReactQueryClientProvider>
        {/* application's query client */}
        <section className="relative">
          <SideNav />
          <div className="p-4 sm:ml-64">{children}</div>
        </section>
      </ReactQueryClientProvider>
    </>
  );
}
