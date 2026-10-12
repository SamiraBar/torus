import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SchoolApp } from "./SchoolApp";
import { DemoGate } from "../crm/DemoGate";
import "../crm/crm.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DemoGate title="CRM школы английского" logo="S" hash="80463ba7d91e4e5db76b6b6d1dc1afd536cb31d2a66d58daf1c2bf747cebae57" storageKey="torus-school-demo">
      {(logout) => (
        <div className="h-full min-w-[1280px]">
          <SchoolApp onLogout={logout} />
        </div>
      )}
    </DemoGate>
  </StrictMode>
);
