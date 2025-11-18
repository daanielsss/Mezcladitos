export default function Header() {
  const now = new Date().toLocaleString();

  return (
    <header className="h-14 bg-gray-850 flex items-center justify-between px-4 border-b border-gray-700">
      <span className="font-semibold">Sistema Punto de Venta · Mezcladitos</span>
      <span className="opacity-70">{now}</span>
    </header>
  );
}
