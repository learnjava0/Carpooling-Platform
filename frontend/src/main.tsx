import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./app/AppLayout";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { FindRidePage } from "./features/rides/FindRidePage";
import { OfferRidePage } from "./features/rides/OfferRidePage";
import { VehiclesPage } from "./features/vehicles/VehiclesPage";
import { WalletPage } from "./features/wallet/WalletPage";
import { AdminPage } from "./features/admin/AdminPage";
import "./styles/global.css";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "find", element: <FindRidePage /> },
      { path: "offer", element: <OfferRidePage /> },
      { path: "vehicles", element: <VehiclesPage /> },
      { path: "wallet", element: <WalletPage /> },
      { path: "admin", element: <AdminPage /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);

