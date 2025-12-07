const express = require('express');
const router = express.Router();
const db = require('../database');

class ZReportComp {
    constructor(totalOrders, totalItems, totalEarnings, firstTime, lastTime) {
        this.totalOrders = totalOrders;
        this.totalItems = totalItems;
        this.totalEarnings = totalEarnings;
        this.firstTime = firstTime;
        this.lastTime = lastTime;
    }

    static replaceWithZero() {
        return new ZReportComp(0, 0, 0.0, null, null);
    }
}

router.get('/z-report/:day', async (req, res) => {
    const { day } = req.params;
    try {
        const totalOrdersSql = `
            SELECT COUNT(DISTINCT currOrders.order_id)
            FROM orders currOrders
            JOIN order_items oi ON oi.order_id = currOrders.order_idconst { pool } = require('../database');const { pool } = require('../database');
            WHERE currOrders.is_final = TRUE
              AND oi.created_at::date = $1
        `;
        const totalItemsSql = `
            SELECT COALESCE(SUM(oi.quantity), 0)
            FROM order_items oi
            JOIN orders o ON o.order_id = oi.order_id
            WHERE o.is_final = TRUE
              AND oi.created_at::date = $1
        `;
        const totalEarningsSql = `
            SELECT COALESCE(SUM(oi.current_price), 0)
            FROM order_items oi
            JOIN orders o ON o.order_id = oi.order_id
            WHERE o.is_final = TRUE
              AND oi.created_at::date = $1
        `;
        const firstTimeSql = `
            SELECT MIN(oi.created_at)
            FROM order_items oi
            JOIN orders o ON o.order_id = oi.order_id
            WHERE o.is_final = TRUE
              AND oi.created_at::date = $1
        `;
        const lastTimeSql = `
            SELECT MAX(oi.created_at)
            FROM order_items oi
            JOIN orders o ON o.order_id = oi.order_id
            WHERE o.is_final = TRUE
              AND oi.created_at::date = $1
        `;

        const totalOrdersResult = await db.query(totalOrdersSql, [day]);
        const totalItemsResult = await db.query(totalItemsSql, [day]);
        const totalEarningsResult = await db.query(totalEarningsSql, [day]);
        const firstTimeResult = await db.query(firstTimeSql, [day]);
        const lastTimeResult = await db.query(lastTimeSql, [day]);

        const totalOrders = totalOrdersResult.rows[0].count;
        const totalItems = totalItemsResult.rows[0].coalesce;
        const totalEarnings = totalEarningsResult.rows[0].coalesce;
        const firstTime = firstTimeResult.rows[0].min;
        const lastTime = lastTimeResult.rows[0].max;

        res.json(new ZReportComp(totalOrders, totalItems, totalEarnings, firstTime, lastTime));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/hourly-sales', async (req, res) => {
    const { from, to } = req.query;
    try {
        const sql = `
            SELECT date_trunc('hour', oi.created_at) AS hour,
                   SUM(oi.current_price) AS total_sales
            FROM order_items oi
            JOIN orders o ON o.order_id = oi.order_id
            WHERE o.is_final = TRUE
              AND oi.created_at >= $1 AND oi.created_at < $2
            GROUP BY 1
            ORDER BY 1
        `;
        const result = await db.query(sql, [from, to]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/menu-part-sales', async (req, res) => {
    const { from, to, onlyCurrentlySold } = req.query;
    try {
        let sql;
        if (onlyCurrentlySold === 'true') {
            sql = `
                SELECT mp.part_name AS label,
                       COUNT(*) AS number
                FROM order_items as oi
                INNER JOIN menu_parts_to_order_items AS mptoi ON oi.order_item_id = mptoi.order_item_id
                INNER JOIN menu_parts AS mp ON mptoi.menu_part_id = mp.menu_part_id
                WHERE (created_at BETWEEN $1 AND $2) AND (mp.for_sale = TRUE)
                GROUP BY mp.part_name;
            `;
        } else {
            sql = `
                SELECT mp.part_name AS label,
                       COUNT(*) AS number
                FROM order_items as oi
                INNER JOIN menu_parts_to_order_items AS mptoi ON oi.order_item_id = mptoi.order_item_id
                INNER JOIN menu_parts AS mp ON mptoi.menu_part_id = mp.menu_part_id
                WHERE created_at BETWEEN $1 AND $2
                GROUP BY mp.part_name;
            `;
        }
        const result = await db.query(sql, [from, to]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/menu-item-sales', async (req, res) => {
    const { from, to, onlyCurrentlySold } = req.query;
    try {
        let sql;
        if (onlyCurrentlySold === 'true') {
            sql = `
                SELECT mi.item_name AS label,
                       COUNT(*) AS number
                FROM order_items AS oi
                INNER JOIN menu_items AS mi ON oi.menu_item_id = mi.menu_item_id
                WHERE (created_at BETWEEN $1 AND $2) AND (mi.for_sale = TRUE)
                GROUP BY mi.item_name;
            `;
        } else {
            sql = `
                SELECT mi.item_name AS label,
                       COUNT(*) AS number
                FROM order_items AS oi
                INNER JOIN menu_items AS mi ON oi.menu_item_id = mi.menu_item_id
                WHERE created_at BETWEEN $1 AND $2
                GROUP BY mi.item_name;
            `;
        }
        const result = await db.query(sql, [from, to]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/item-sales-report', async (req, res) => {
    const { from, to, onlyCurrentlySold } = req.query;
    try {
        let sql = `
            SELECT mi.menu_item_id AS "menuItemId",
            mi.item_name AS "itemName",
            COALESCE(SUM(oi.quantity), 0) AS "totalQuantity",
            COALESCE(SUM(oi.current_price), 0) AS "totalSales"
            FROM order_items oi
            JOIN orders o ON o.order_id = oi.order_id
            JOIN menu_items mi ON mi.menu_item_id = oi.menu_item_id
            WHERE o.is_final = TRUE AND oi.created_at BETWEEN $1 AND $2
        `;
        const dates = [from, to];
        if (onlyCurrentlySold === 'true') {
            sql += ` AND mi.for_sale = TRUE`;
        }
        sql += `
            GROUP BY mi.menu_item_id, mi.item_name
            ORDER BY "totalSales" DESC
        `;
        const result = await db.query(sql, dates);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
