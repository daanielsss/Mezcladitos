import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/pos", label: "POS" },
  { to: "/inventory", label: "Inventario" },
  { to: "/expenses", label: "Gastos" },
  { to: "/settings", label: "Configuración" },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-gray-800 p-4 flex flex-col gap-3">
      <h1 className="text-xl font-bold mb-4">Mezcladitos</h1>

      {links.map(l => (
        <NavLink
          key={l.to}
          to={l.to}
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg font-medium transition ${
              isActive ? "bg-blue-600" : "hover:bg-gray-700"
            }`
          }
        >
          {l.label}
        </NavLink>
      ))}
    </aside>
  );
}
