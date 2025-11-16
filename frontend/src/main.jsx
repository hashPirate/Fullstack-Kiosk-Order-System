import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import KioskView from "./views/kiosk/KioskView.jsx";
import KioskHome from "./views/kiosk/KioskHome.jsx";
import BuildBowl from "./views/kiosk/BuildBowl.jsx";
import BuildPlate from "./views/kiosk/BuildPlate.jsx";
import BuildBigPlate from "./views/kiosk/BuildBigPlate.jsx";
import BuildDrink from "./views/kiosk/BuildDrink.jsx";
import SetLanguage from "./views/kiosk/SetLanguage.jsx";

import CashierView from "./views/cashier/CashierView/CashierView.jsx";
import CashierMenuItems from "./views/cashier/CashierMenuItems/CashierMenuItems.jsx";
import CashierMenuParts from "./views/cashier/CashierMenuParts/CashierMenuParts.jsx";

import KitchenView from "./views/kitchen/KitchenView.jsx";
import KitchenHome from "./views/kitchen/KitchenHome.jsx";

import ManagerView from "./views/manager/ManagerView.jsx";
import ManageServers from "./views/manager/views/ManageServers.jsx";
import Inventory from "./views/manager/views/Inventory.jsx";
import Reports from "./views/manager/views/Reports.jsx";
import ManageMenuParts from "./views/manager/views/ManageMenuParts.jsx";
import ManageMenuItems from "./views/manager/views/ManageMenuItems.jsx";
import SalesReport from "./views/manager/views/SalesReport.jsx";

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="/kiosk" element={<KioskView />}>
          <Route index element={<KioskHome />}></Route>
          <Route path="build_bowl" element={<BuildBowl />}></Route>
          <Route path="build_plate" element={<BuildPlate />}></Route>
          <Route path="build_big_plate" element={<BuildBigPlate />}></Route>
          <Route path="build_drink" element={<BuildDrink />}></Route>
          <Route path="language" element={<SetLanguage />}></Route>
        </Route>
        <Route path="/cashier" element={<CashierView />}>
          <Route index element={<Navigate to="menu_items" replace />} />
          <Route path="menu_items" element={<CashierMenuItems />} />
          <Route path="menu_parts" element={<CashierMenuParts />} />
        </Route>
        <Route path="/kitchen" element={<KitchenView />}>
          <Route index element={<KitchenHome />}></Route>
        </Route>
        <Route path="/manager" element={<ManagerView />}>
          <Route index element={<Navigate to="/manager/servers" replace />} />
          <Route path="servers" element={<ManageServers />}></Route>
          <Route path="inventory" element={<Inventory />}></Route>
          <Route path="reports" element={<Reports />}></Route>
          <Route path="menu-parts" element={<ManageMenuParts />}></Route>
          <Route path="menu-items" element={<ManageMenuItems />}></Route>
          <Route path="sales-report" element={<SalesReport />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
