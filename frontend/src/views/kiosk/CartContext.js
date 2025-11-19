import { createContext } from "react";

// Context values are defined in KioskHome.jsx
const CartContext = createContext({
    cartContent: [],
    setCartContent: null,
    addCompletedItem: null,
    removeCompletedItem: null,
});

export default CartContext;
