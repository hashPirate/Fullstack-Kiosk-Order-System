import {BrowserRouter, Routes, Route} from "react-router";
import ManagerView from "./ManagerView";
import ManagerHome from "./ManagerHome";

import ManageServers from "./views/ManageServers";
import Inventory from "./views/Inventory";
import Reports from "./views/Reports";
import ManageMenuParts from "./views/ManageMenuParts";
import ManageMenuItems from "./views/ManageMenuItems";
import SalesReport from "./views/SalesReport";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {}
        <Route path="/" element={<ManagerHome />} />
        {}
        <Route path="/manager" element={<ManagerView />}>
          {}
          <Route index element={<ManageServers />} />
          {}
          <Route path="servers" element={<ManageServers />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="reports" element={<Reports />} />
          <Route path="menu-parts" element={<ManageMenuParts />} />
          <Route path="menu-items" element={<ManageMenuItems />} />
          <Route path="sales-report" element={<SalesReport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
