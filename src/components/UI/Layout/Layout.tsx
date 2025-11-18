import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="h-screen w-screen flex bg-gray-900 text-white">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
