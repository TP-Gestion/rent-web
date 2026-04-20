import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Navigate, Outlet, createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { isAuthenticated } from "./auth";
import AppLayout from "./layout/AppLayout";
import TenantsPage from "./pages/TenantsPage";
import FinancesPage from "./pages/FinancesPage";
import MaintenancePage from "./pages/MaintenancePage";
import NuevaPropiedadPage from "./pages/NuevaPropiedadPage";
import PropiedadDetallePage from "./pages/propertyDetail";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

function RequireAuth() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
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
        path: "login",
        Component: LoginPage,
      },
      {
        path: "/",
        Component: RequireAuth,
        children: [
          {
            path: "/",
            Component: AppLayout,
            children: [
              {
                index: true,
                Component: TenantsPage,
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
                Component: FinancesPage,
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
            ],
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
