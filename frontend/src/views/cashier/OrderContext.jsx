import { createContext } from "react";

// This context allows all components in cashier view to access and manipulate the order state!

const OrderContext = createContext({
    orderContent: [],
    setOrderContent: null,
    addMenuItem: null,
    removeMenuItem: null,
    addMenuPart: null,
    removeMenuPart: null
});

export default OrderContext;
