
import React from "react";
import Sidebar from "./Sidebar";

export default function SidebarLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
