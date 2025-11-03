-- Count of all menu parts sold in date range
SELECT mp.part_name AS label,
       COUNT(*) AS number
FROM order_items as oi
INNER JOIN menu_parts_to_order_items AS mptoi ON oi.order_item_id = mptoi.order_item_id
INNER JOIN menu_parts AS mp ON mptoi.menu_part_id = mp.menu_part_id
WHERE created_at BETWEEN '2025-05-01' AND '2025-10-20'
GROUP BY mp.part_name;

-- Count of all menu parts sold in date range, but ONLY menu parts that are currently for sale
SELECT mp.part_name AS label,
       COUNT(*) AS number
FROM order_items as oi
INNER JOIN menu_parts_to_order_items AS mptoi ON oi.order_item_id = mptoi.order_item_id
INNER JOIN menu_parts AS mp ON mptoi.menu_part_id = mp.menu_part_id
WHERE (created_at BETWEEN '2025-05-01' AND '2025-10-20') AND (mp.for_sale = TRUE)
GROUP BY mp.part_name;

-- Count of all menu items sold in date range
SELECT mi.item_name AS label,
       COUNT(*) AS number
FROM order_items AS oi
INNER JOIN menu_items AS mi ON oi.menu_item_id = mi.menu_item_id
WHERE created_at BETWEEN '2025-05-01' AND '2025-10-20'
GROUP BY mi.item_name;

-- Count of all menu items sold in date range ONLY if they are currently for sale
SELECT mi.item_name AS label,
       COUNT(*) AS number
FROM order_items AS oi
INNER JOIN menu_items AS mi ON oi.menu_item_id = mi.menu_item_id
WHERE (created_at BETWEEN '2025-05-01' AND '2025-10-20') AND (mi.for_sale = TRUE)
GROUP BY mi.item_name;
