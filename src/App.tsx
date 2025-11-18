import { Routes, Route } from "react-router-dom";
import Layout from "./components/UI/Layout/Layout";

import DashboardPage from "./Pages/DashboardPage";
import POSPage from "./Pages/POSPage";
import InventoryPage from "./Pages/InventoryPage";
import ExpensesPage from "./Pages/ExpensesPage";
import SettingsPage from "./Pages/SettingsPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/pos" element={<POSPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  );
}
