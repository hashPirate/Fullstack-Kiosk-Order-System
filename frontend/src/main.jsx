import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import KioskView from "./views/kiosk/KioskView.jsx";
import KioskHome from "./views/kiosk/KioskHome.jsx";
import BuildBowl from "./views/kiosk/BuildBowl.jsx";
import BuildPlate from "./views/kiosk/BuildPlate.jsx";
import BuildBigPlate from "./views/kiosk/BuildBigPlate.jsx";
import BuildDrink from "./views/kiosk/BuildDrink.jsx";
import CashierView from "./views/cashier/CashierView.jsx";
import CashierHome from "./views/cashier/CashierHome.jsx";
import KitchenView from "./views/kitchen/KitchenView.jsx";
import KitchenHome from "./views/kitchen/KitchenHome.jsx";
import ManagerView from "./views/manager/ManagerView.jsx";
import ManagerHome from "./views/manager/ManagerHome.jsx";
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
        </Route>
        <Route path="/cashier" element={<CashierView />}>
          <Route index element={<CashierHome />}></Route>
        </Route>
        <Route path="/kitchen" element={<KitchenView />}>
          <Route index element={<KitchenHome />}></Route>
        </Route>
        <Route path="/manager" element={<ManagerView />}>
          <Route index element={<ManagerHome />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
