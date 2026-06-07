import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Navigate, createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { isAuthenticated } from "./auth";
import AppLayout from "./layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import TenantsPage from "./pages/TenantsPage";
import CargarExpensaPage from "./pages/CargarExpensaPage";
import MaintenancePage from "./pages/MaintenancePage";
import NuevaPropiedadPage from "./pages/NuevaPropiedadPage";
import PropiedadDetallePage from "./pages/propertyDetail";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import BillingPage from "./pages/BillingPage";

function RequireAuthLayout() {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <AppLayout />;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        index: true,
        Component: LoginPage,
      },
      {
        path: "login",
        element: <Navigate to="/" replace />,
      },
      {
        Component: RequireAuthLayout,
        children: [
          {
            path: "dashboard",
            Component: DashboardPage,
          },
          {
            path: "tenants",
            Component: TenantsPage,
          },
          {
            path: "nueva-propiedad",
            Component: NuevaPropiedadPage,
          },
          {
            path: "finances",
            Component: CargarExpensaPage,
          },
          {
            path: "maintenance",
            Component: MaintenancePage,
          },
          {
            path: "propiedades/:idPropiedad",
            Component: PropiedadDetallePage,
          },
          {
            path: "*",
            Component: NotFoundPage,
          },
          {
            path: "/generar-liquidacion",
            element: <BillingPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
