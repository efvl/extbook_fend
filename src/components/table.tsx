// Reusable Table Components
export const TableContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">{children}</table>
  </div>
);

export const Th = ({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) => (
  <th className={`px-6 py-3 text-${align} text-xs font-semibold text-gray-500 uppercase tracking-wider`}>
    {children}
  </th>
);

export const Td = ({ children, align = "left", className = "" }: { children: React.ReactNode; align?: "left" | "right"; className?: string }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-${align} ${className}`}>
    {children}
  </td>
);