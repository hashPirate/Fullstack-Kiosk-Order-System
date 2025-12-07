import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import KioskView from "./views/kiosk/KioskView.jsx";
import KioskHome from "./views/kiosk/KioskHome.jsx";
import KioskCart from "./views/kiosk/KioskCart/KioskCart.jsx";
import BuildItem from "./views/kiosk/BuildItem.jsx";
import SetLanguage from "./views/kiosk/SetLanguage.jsx";

import LoginView from "./views/login/LoginView.jsx";
import LogoutView from "./views/login/LogoutView.jsx";

import CashierView from "./views/cashier/CashierView/CashierView.jsx";
import CashierMenuItems from "./views/cashier/CashierMenuItems/CashierMenuItems.jsx";
import CashierMenuParts from "./views/cashier/CashierMenuParts/CashierMenuParts.jsx";

import KitchenView from "./views/kitchen/KitchenView.jsx";
import KitchenPending from "./views/kitchen/KitchenPending/KitchenPending.jsx";
import KitchenCompleted from "./views/kitchen/KitchenCompleted/KitchenCompleted.jsx";

import ManagerView from "./views/manager/ManagerView.jsx";
import ManageServers from "./views/manager/views/ManageServers.jsx";
import Inventory from "./views/manager/views/Inventory.jsx";
import Reports from "./views/manager/views/Reports.jsx";
import ManageMenuParts from "./views/manager/views/ManageMenuParts/ManageMenuParts.jsx";
import ManageMenuItems from "./views/manager/views/ManageMenuItems/ManageMenuItems.jsx";
import SalesReport from "./views/manager/views/SalesReport.jsx";

import LoginRoute from "./utilities/LoginRoute.jsx";
import MenuBoardHome from "./views/menu/MenuBoard.jsx";
import MenuBoardManager from "./views/manager/views/MenuBoardManager.jsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route index element={<App />} />

          <Route path="/login" element={<LoginView />} />
          <Route path="/logout" element={<LogoutView />} />

          <Route path="/menu" element={<MenuBoardHome />} />

          <Route
            path="/kiosk"
            element={
              <LoginRoute requiredAccess="kiosk">
                <KioskView />
              </LoginRoute>
            }
          >
            <Route index element={<KioskHome />} />
            <Route path="build_item" element={<BuildItem />} />
            <Route path="language" element={<SetLanguage />} />
            <Route path="cart" element={<KioskCart />} />
          </Route>

          {/* Cashier */}
          <Route
            path="/cashier"
            element={
              <LoginRoute requiredAccess="cashier">
                <CashierView />
              </LoginRoute>
            }
          >
            <Route index element={<Navigate to="menu_items" replace />} />
            <Route path="menu_items" element={<CashierMenuItems />} />
            <Route path="menu_parts" element={<CashierMenuParts />} />
          </Route>

          <Route
            path="/kitchen"
            element={
              <LoginRoute requiredAccess="kitchen">
                <KitchenView />
              </LoginRoute>
            }
          >
            <Route index element={<Navigate to="pending" replace />} />
            <Route path="pending" element={<KitchenPending />} />
            <Route path="completed" element={<KitchenCompleted />} />
          </Route>

          <Route
            path="/manager"
            element={
              <LoginRoute requiredAccess="manager">
                <ManagerView />
              </LoginRoute>
            }
          >
            <Route index element={<Navigate to="/manager/servers" replace />} />
            <Route path="servers" element={<ManageServers />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="reports" element={<Reports />} />
            <Route path="menu-parts" element={<ManageMenuParts />} />
            <Route path="menu-items" element={<ManageMenuItems />} />
            <Route path="sales-report" element={<SalesReport />} />
            <Route path="menu-manager" element={<MenuBoardManager />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
