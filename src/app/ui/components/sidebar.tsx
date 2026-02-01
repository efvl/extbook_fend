'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, FileText } from "lucide-react";

const links = [
  { name: 'Dashboard', href: '/ui/dashboard', icon: Home },
  { name: 'Customers', href: '/ui/customers', icon: Users },
  { name: 'Invoices', href: '/ui/invoices', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-gray-800 text-gray-100 flex flex-col">
      <div className="text-2xl font-bold p-4 border-b border-gray-700">
        MyApp Sidebar
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map(({ name, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
              pathname === href
                ? "bg-gray-700 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <Icon size={18} />
            {name}
          </Link>
        ))}
      </nav>

    </aside>
  );
}