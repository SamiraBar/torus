import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CrmApp } from "./CrmApp";
import { DemoGate } from "./DemoGate";
import { trackPage } from "../lib/track";
import "./crm.css";

trackPage();

trackPage();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DemoGate title="Torus CRM" logo="T" hash="6c793a5ca5505e708fea779bef0b6cb8ddce8e68b7f9d38fb4280621ad530c68" storageKey="torus-crm-demo">
      {(logout) => (
        <div className="h-full min-w-[1280px]">
          <CrmApp onLogout={logout} />
        </div>
      )}
    </DemoGate>
  </StrictMode>
);
