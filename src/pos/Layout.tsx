import TopBar from "./TopBar";
import ProductGrid from "./ProductGrid";
import TicketPanel from "./TicketPanel";
import ActionsPanel from "./ActionsPanel";
import "./layout.css";

export default function Layout() {
  return (
    <div className="pos-container">
      <TopBar />

      <div className="pos-body">
        <div className="left-panel">
          <ProductGrid />
        </div>

        <div className="center-panel">
          <TicketPanel />
        </div>

        <div className="right-panel">
          <ActionsPanel />
        </div>
      </div>
    </div>
  );
}
