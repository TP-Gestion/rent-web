import { useState } from "react";
import AppLayout from "./AppLayout";
import ExpensasPage from "./pages/ExpensasPage";

export default function App() {
  const [activePath, setActivePath] = useState("/tenants");

  return (
    <AppLayout
      activePath={activePath}
      sectionTitle="SOLARIS ASSETS"
      user={{ name: "Ana García" }}
      notificationCount={3}
      onNavigate={(path) => setActivePath(path)}
      onSearch={(query) => console.log("Buscar:", query)}
    >
      <ExpensasPage />
    </AppLayout>
  );
}
