
import React from "react";
import { Hammer, Package, DollarSign } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const sidebarItems = [
  { label: "Producción", path: "/produccion", icon: <Hammer />, roles: ["admin"] },
  { label: "Stock", path: "/stock", icon: <Package />, roles: ["admin", "vendedor"] },
  { label: "Ventas", path: "/ventas", icon: <DollarSign />, roles: ["admin", "vendedor"] },
];

export default function Sidebar() {
  const role = localStorage.getItem("role") || "vendedor";
  const location = useLocation();

  return (
    <div className="w-64 bg-gray-800 p-4">
      <h1 className="text-2xl font-bold mb-6">🛡️ RAGNAROK</h1>
      <nav className="space-y-2">
        {sidebarItems
          .filter(item => item.roles.includes(role))
          .map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-2 rounded hover:bg-gray-700 ${
                location.pathname === item.path ? "bg-gray-700" : ""
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
      </nav>
    </div>
  );
}
