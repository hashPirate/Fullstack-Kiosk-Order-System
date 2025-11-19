async function confirmOrder() {
    setConfirmDisabled(true);
    if (orderState.orderContent.length === 0) {
        console.log("Cannot make order without at least one item!");
        setConfirmDisabled(false);
        return;
    }
    
    try {
        // Create empty order
        const orderResp = await axios.post('/api/orders/', {});
        const orderId = orderResp.data.order_id;
        console.log("Successfully created order.");
        
        // Add items to order sequentially
        for (const item of orderState.orderContent) {
            const itemResp = await axios.post(`/api/orders/${orderId}/items`, {
                menu_item_id: item.itemId, 
                quantity: 1
            });
            const orderItemId = itemResp.data.order_item_id;
            console.log("Successfully added order item.");
            
            // Add parts to orderItem
            for (const part of item.parts) {
                await axios.post(`/api/orders/items/${orderItemId}/parts`, {
                    menu_part_id: part.partId 
                });
                console.log("Successfully added menu part to order item.");
            }
        }
        
        const finalizeOrder = await axios.put(`/api/orders/${orderId}/finalize`, {});
        if (finalizeOrder.data.success !== true) {
            throw new Error("ERROR: order finalization failed!");
        }

        console.log("Order confirmed successfully!");
        orderState.setOrderContent([]);    // Clear the order.
    } catch (error) {
        console.log("ERROR during order confirmation:", error);
    } finally {
        setConfirmDisabled(false);
    }
};

export default confirmOrder
