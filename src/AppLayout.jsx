import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

export default function AppLayout({
  children,
  activePath = "/dashboard",
  sectionTitle = "SOLARIS ASSETS",
  user = { name: "Usuario Solaris" },
  notificationCount = 0,
  onNavigate,
  onSearch,
}) {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#fafaf7",
        fontFamily: "'DM Sans', 'Trebuchet MS', sans-serif",
      }}
    >
      {/* Sidebar fijo a la izquierda */}
      <Sidebar activePath={activePath} onNavigate={onNavigate} />

      {/* Columna principal */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        {/* TopBar sticky */}
        <TopBar
          sectionTitle={sectionTitle}
          user={user}
          notificationCount={notificationCount}
          onSearch={onSearch}
        />

        {/* Área de contenido scrolleable */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
          }}
          id="main-content"
          role="main"
        >
          {children}
        </main>
      </div>
    </div>
  );
}