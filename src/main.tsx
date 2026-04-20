import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import AppLayout from "./layout/AppLayout";
import ExpensasPage from "./pages/ExpensasPage";
import NuevaPropiedadPage from "./pages/NuevaPropiedadPage";
import PropiedadDetallePage from "./pages/propertyDetail";
import NotFoundPage from "./pages/NotFoundPage";

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
        path: "/",
        Component: AppLayout,
        children: [
          {
            index: true,
            Component: ExpensasPage,
          },
          {
            path: "tenants",
            Component: ExpensasPage,
          },
          {
            path: "nueva-propiedad",
            Component: NuevaPropiedadPage,
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
