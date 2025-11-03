-- 52 weeks of sales history
-- SELECT all the sales history from `orders`
SELECT
    date_trunc('week', created_at) AS order_week,
    COUNT(*) AS total_orders
FROM
    orders
GROUP BY
    order_week
ORDER BY
    order_week;


-- Realistic sales history
SELECT
    date_trunc('hour', orders.created_at) AS order_hour,
    COUNT(*) AS total_order_items,
    SUM(order_items.current_price * order_items.quantity) AS total_revenue
FROM
    orders
INNER JOIN order_items ON orders.order_id = order_items.order_id
GROUP BY
    order_hour
ORDER BY
    order_hour DESC;


-- 2 peak days
SELECT
    date_trunc('day', orders.created_at) AS order_day,
    COUNT(*) AS total_order_items,
    SUM(order_items.current_price * order_items.quantity) AS total_revenue
FROM
    orders
INNER JOIN order_items ON orders.order_id = order_items.order_id
GROUP BY
    order_day
ORDER BY
    total_revenue DESC
LIMIT 30;

-- Best of the worst
WITH worst_day AS (
    SELECT
        date_trunc('day', orders.created_at) AS order_day,
        SUM(order_items.current_price * order_items.quantity) AS total_revenue
    FROM
        orders
    INNER JOIN order_items ON orders.order_id = order_items.order_id
    GROUP BY
        order_day
    ORDER BY
        total_revenue
    LIMIT 1
)
SELECT
    SUM(order_items.quantity) AS total_quantity_sold,
    menu_items.item_name AS menu_item_name
FROM 
    orders
INNER JOIN worst_day ON orders.created_at = worst_day.order_day
INNER JOIN order_items ON orders.order_id = order_items.order_id
INNER JOIN menu_items ON order_items.menu_item_id = menu_items.menu_item_id
GROUP BY
    menu_items.item_name
ORDER BY
    total_quantity_sold DESC;


-- Get ingredients used per day
SELECT
    date_trunc('day', orders.created_at) AS order_day,
    COUNT(*)
FROM
    orders
INNER JOIN order_items ON orders.order_id = order_items.order_id
INNER JOIN menu_parts_to_order_items ON menu_parts_to_order_items.order_item_id = order_items.order_item_id
INNER JOIN menu_parts ON menu_parts.menu_part_id = menu_parts_to_order_items.menu_part_id
INNER JOIN ingredients_to_menu_parts ON ingredients_to_menu_parts.menu_part_id = menu_parts.menu_part_id
INNER JOIN ingredients ON ingredients.ingredient_id = ingredients_to_menu_parts.ingredient_id
GROUP BY
    order_day
ORDER BY
    order_day DESC


-- Get average price per order
SELECT
    date_trunc('day', orders.created_at) AS order_day,
    COUNT(*)
FROM
    orders
INNER JOIN order_items ON orders.order_id = order_items.order_id
INNER JOIN menu_parts_to_order_items ON menu_parts_to_order_items.order_item_id = order_items.order_item_id
INNER JOIN menu_parts ON menu_parts.menu_part_id = menu_parts_to_order_items.menu_part_id
INNER JOIN ingredients_to_menu_parts ON ingredients_to_menu_parts.menu_part_id = menu_parts.menu_part_id
INNER JOIN ingredients ON ingredients.ingredient_id = ingredients_to_menu_parts.ingredient_id
GROUP BY
    order_day
ORDER BY
    order_day DESC
LIMIT 10;


-- Inventory items for 20 menu items
SELECT
    menu_parts.part_name,
    COUNT(*) AS ingredients_count
FROM
    menu_parts
INNER JOIN ingredients_to_menu_parts ON ingredients_to_menu_parts.menu_part_id = menu_parts.menu_part_id
GROUP BY
    menu_parts.part_name;
    


-- Get ingredients for a certain menu item without duplicates
SELECT DISTINCT
    mi.item_name AS "Menu Item",
    mp.part_name AS "Dish Part",
    i.name       AS "Ingredient",
    itmp.quantity_cost AS "Amount Needed",
    i.quantity_unit   AS "Unit"
FROM
    menu_items mi
JOIN menu_parts mp
    ON mi.menu_item_id = mi.menu_item_id 
JOIN ingredients_to_menu_parts itmp
    ON mp.menu_part_id = itmp.menu_part_id
JOIN ingredients i
    ON itmp.ingredient_id = i.ingredient_id
WHERE
    mi.item_name = 'Bowl'
    AND mp.part_name ILIKE '%Chicken%'
ORDER BY
    "Dish Part", "Ingredient";


-- The days with the most bowls ordered ranked by bowl count

SELECT
    date_trunc('day', oi.created_at) AS order_day,
    SUM(oi.quantity) AS total_bowls
FROM
    order_items oi
JOIN menu_items mi ON oi.menu_item_id = mi.menu_item_id
JOIN orders o      ON oi.order_id     = o.order_id
WHERE
    mi.item_name = 'Bowl'
    AND o.is_final IS TRUE
GROUP BY
    order_day
ORDER BY
    total_bowls DESC, order_day DESC;


-- Revenue by day of the week

SELECT
    TO_CHAR(o.created_at,'Day') AS "Day of Week",
    SUM(oi.quantity*oi.current_price) AS "Total Revenue"
FROM
    orders o
JOIN order_items oi ON o.order_id = oi.order_id
WHERE
    o.is_final IS TRUE
GROUP BY
    TO_CHAR(o.created_at, 'Day'),EXTRACT(DOW FROM o.created_at) --we can  set the dow as day of week
ORDER BY
    EXTRACT(DOW FROM o.created_at);


-- Average order value per day

SELECT
    DATE_TRUNC('day', o.created_at) AS "Order Day",
    SUM(oi.quantity * oi.current_price) / COUNT(DISTINCT o.order_id) AS "Avg Order Value"
FROM
    orders o
JOIN order_items oi ON o.order_id = oi.order_id
WHERE
    o.is_final IS TRUE
GROUP BY
    "Order Day"
ORDER BY
    "Order Day";

-- Total Revenue
SELECT
    COUNT(*) AS total_order_items,
    SUM(order_items.current_price * order_items.quantity) AS total_revenue
FROM
    orders
INNER JOIN order_items ON orders.order_id = order_items.order_id;


-- Total Revenue by Chicken
SELECT
    COUNT(*) AS total_order_items,
    SUM(order_items.current_price * order_items.quantity) AS total_revenue
FROM
    orders
INNER JOIN order_items ON orders.order_id = order_items.order_id
INNER JOIN menu_parts_to_order_items ON menu_parts_to_order_items.order_item_id = order_items.order_item_id
INNER JOIN menu_parts ON menu_parts.menu_part_id = menu_parts_to_order_items.menu_part_id
INNER JOIN ingredients_to_menu_parts ON ingredients_to_menu_parts.menu_part_id = menu_parts.menu_part_id
INNER JOIN ingredients ON ingredients.ingredient_id = ingredients_to_menu_parts.ingredient_id
WHERE ingredients.name ILIKE '%Chicken%';


-- Total Revenue by Beef
SELECT
    COUNT(*) AS total_order_items,
    SUM(order_items.current_price * order_items.quantity) AS total_revenue
FROM
    orders
INNER JOIN order_items ON orders.order_id = order_items.order_id
INNER JOIN menu_parts_to_order_items ON menu_parts_to_order_items.order_item_id = order_items.order_item_id
INNER JOIN menu_parts ON menu_parts.menu_part_id = menu_parts_to_order_items.menu_part_id
INNER JOIN ingredients_to_menu_parts ON ingredients_to_menu_parts.menu_part_id = menu_parts.menu_part_id
INNER JOIN ingredients ON ingredients.ingredient_id = ingredients_to_menu_parts.ingredient_id
WHERE ingredients.name ILIKE '%Beef%';

-- Average order 
WITH order_totals AS (SELECT
    SUM(current_price * quantity) AS order_revenue
FROM
    order_items
GROUP BY
    order_id)

SELECT AVG(order_revenue) AS total_revenue
FROM
    order_totals;

-- Get Menu Parts for given order entry
SELECT
    *
FROM
    menu_parts
INNER JOIN menu_parts_to_order_items ON menu_parts.menu_part_id = menu_parts_to_order_items.menu_part_id
WHERE menu_parts_to_order_items.order_item_id = 3024;

-- Get menu parts used in an order
SELECT
    *
FROM
    orders
INNER JOIN order_items ON orders.order_id = order_items.order_id
INNER JOIN menu_parts_to_order_items ON menu_parts_to_order_items.order_item_id = order_items.order_item_id
INNER JOIN menu_parts ON menu_parts.menu_part_id = menu_parts_to_order_items.menu_part_id
WHERE orders.order_id = 131887