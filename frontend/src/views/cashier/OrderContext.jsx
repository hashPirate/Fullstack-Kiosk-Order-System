import { createContext } from "react";

const OrderContext = createContext({
    orderContent: [],
    setOrderContent: null,
    addMenuItem: null,
    removeMenuItem: null,
    addMenuPart: null,
    removeMenuPart: null
});

export default OrderContext;
