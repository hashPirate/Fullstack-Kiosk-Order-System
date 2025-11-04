import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import KioskView from "./kiosk/KioskView.jsx";
import KioskHome from "./kiosk/KioskHome.jsx";
import CashierView from "./cashier/CashierView.jsx";
import CashierHome from "./cashier/CashierHome.jsx";
import KitchenView from "./kitchen/KitchenView.jsx";
import KitchenHome from "./kitchen/KitchenHome.jsx";
import ManagerView from "./manager/ManagerView.jsx";
import ManagerHome from "./manager/ManagerHome.jsx";
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="/kiosk" element={<KioskView />}>
          <Route index element={<KioskHome />}></Route>
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
