import { createContext } from "react";

// Context values are defined in KioskHome.jsx
const CartContext = createContext({
    cartContent: [],
    addCompletedItem: null,
    removeCompletedItem: null,
});

export default CartContext;
