/**
 * @module controllers/reports
 */
const express = require('express');
const router = express.Router();
const db = require('../database');
/**
 * @class ZReportComp
 * @classdesc A container for Z-Report data.
 * @property {number} totalOrders The total number of orders in the report.
 * @property {number} totalItems The total number of items sold in the report.
 * @property {number} totalEarnings The total earnings in the report.
 * @property {Date|null} firstTime The timestamp of the first order in the report period.
 * @property {Date|null} lastTime The timestamp of the last order in the report period.
 */
class ZReportComp {
    constructor(totalOrders, totalItems, totalEarnings, firstTime, lastTime) {
        this.totalOrders=totalOrders;
        this.totalItems=totalItems;
        this.totalEarnings=totalEarnings;
        this.firstTime=firstTime;
        this.lastTime=lastTime;
    }
}

/**
 * Calculates the start time for a Z-Report based on the previous day's closing time.
 * @param {string} targetDate - The target date for the report in 'YYYY-MM-DD' format.
 * @param {Date} endTime - The end time for the current report period.
 * @returns {Promise<Date>} The calculated start time for the Z-Report.
 */
async function getZReportStartTime(targetDate, endTime) {
    const targetDateObj = new Date(targetDate+'T00:00:00.000Z'); // ceck date at midnight prv day
    
    const prevDateObj=new Date(targetDateObj);
    prevDateObj.setUTCDate(prevDateObj.getUTCDate()-1); //use utc to get prev day
    const prevDateStr = prevDateObj.toISOString().split('T')[0];
    
    const prevDayResult = await db.query(
        'SELECT time_when_closed FROM z_report_history WHERE report_date = $1 AND time_when_closed IS NOT NULL',
        [prevDateStr]
    ); // verify if it is alr closed
    
    if (prevDayResult.rows.length>0 && prevDayResult.rows[0].time_when_closed) {
        const prevCloseTime = new Date(prevDayResult.rows[0].time_when_closed);
        if (!isNaN(prevCloseTime.getTime())) {
            const startTime = new Date(targetDateObj);
            startTime.setUTCHours(
                prevCloseTime.getUTCHours(),
                prevCloseTime.getUTCMinutes(),
                prevCloseTime.getUTCSeconds(),
                prevCloseTime.getUTCMilliseconds()
            );
            
            if (endTime && startTime >= endTime) {
                const defaultTime = new Date(prevDateObj);
                defaultTime.setUTCHours(23, 0, 0, 0); // we use 11pm previous day if day is closed
                return defaultTime;
            }
            
            return startTime;
        }
    }
    
    const defaultTime=new Date(prevDateObj);
    defaultTime.setUTCHours(23, 0, 0, 0);
    return defaultTime;
}

/**
 * Generates the data for a Z-Report within a given time frame.
 * @param {Date|string} startTime - The start time for the report.
 * @param {Date|string} endTime - The end time for the report.
 * @returns {Promise<ZReportComp>} The Z-Report data.
 */
async function generateZReportData(startTime, endTime) { //made a function to get the z report with starttime and endtime for simplicity
    const start = startTime instanceof Date ? startTime : new Date(startTime);
    const end = endTime instanceof Date ? endTime : new Date(endTime);
    if (isNaN(start.getTime())||isNaN(end.getTime())) {
        throw new Error('Invalid start or end time for Z report'); //check!! sometimes it breaks
    }
    const [startUTC, endUTC] = [start.toISOString(), end.toISOString()];
    const timeFilter = `oi.created_at >= $1::timestamp WITH TIME ZONE AND oi.created_at <= $2::timestamp WITH TIME ZONE`;

    const result = await db.query(`
        SELECT 
            COUNT(DISTINCT o.order_id) AS total_orders,
            COALESCE(SUM(oi.quantity), 0) AS total_items,
            COALESCE(SUM(oi.current_price), 0) AS total_earnings,
            MIN(oi.created_at) AS first_time,
            MAX(oi.created_at) AS last_time
        FROM order_items oi
        JOIN orders o ON o.order_id = oi.order_id
        WHERE o.is_final = TRUE AND ${timeFilter}
    `, [startUTC, endUTC]); //get z report data with this query. coalesce handles null

    const row=result.rows[0] || {};
    return new ZReportComp(
        parseInt(row.total_orders||0),
        parseInt(row.total_items || 0),
        parseFloat(row.total_earnings || 0),
        row.first_time || null,
        row.last_time || null
    );
}

/**
 * Checks if a Z-Report already exists for a given day.
 * @param {string} day - The day to check in 'YYYY-MM-DD' format.
 * @returns {Promise<{exists: boolean, closedAt: string|null}>} An object indicating if the report exists and when it was closed.
 */
async function checkZReportExists(day) { //does z report already exist for a day? this is for our viewbox
    const result = await db.query(
        'SELECT time_when_closed FROM z_report_history WHERE report_date = $1 AND time_when_closed IS NOT NULL',
        [day]
    );
    return {
        exists: result.rows.length > 0,
        closedAt: result.rows[0]?.time_when_closed || null
    };
}

/**
 * Route to check if a Z-Report exists for a given day.
 * @name get/z-report/check/:day
 * @function
 * @param {string} day - The day to check in 'YYYY-MM-DD' format.
 */
router.get('/z-report/check/:day', async (req, res) => { //endpoint for the same
    try {
        const { exists, closedAt } = await checkZReportExists(req.params.day);
        res.json({ exists, closedAt });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to get a previously generated Z-Report for a specific day.
 * @name get/z-report/:day
 * @function
 * @param {string} day - The day of the report to retrieve in 'YYYY-MM-DD' format.
 */
router.get('/z-report/:day', async (req, res) => { //view a closed report
    try {
        const { exists, closedAt } = await checkZReportExists(req.params.day);
        if (!exists||!closedAt) {
            return res.status(404).json({ error: 'Z report not found for this date' }); // simple checks
        }
        
        const closedTime=new Date(closedAt);
        if (isNaN(closedTime.getTime())) {
            return res.status(500).json({ error: 'Invalid timestamp in database' });
        }
        
        const startTime = await getZReportStartTime(req.params.day, closedTime);
        const zReport = await generateZReportData(startTime, closedTime);
        res.json(zReport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to get hourly sales data within a time range.
 * @name get/hourly-sales
 * @function
 * @param {string} from - The start of the time range in ISO format.
 * @param {string} to - The end of the time range in ISO format.
 */
router.get('/hourly-sales', async (req, res) => {
    const {from,to}=req.query;
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

/**
 * Route to generate an X-Report (hourly sales) for a specific day.
 * @name get/x-report/:day
 * @function
 * @param {string} day - The day for the report in 'YYYY-MM-DD' format.
 */
router.get('/x-report/:day', async (req, res) => {
    const {day}=req.params;
    try {
        const sql = `
            SELECT date_trunc('hour', oi.created_at) AS hour,
                   SUM(oi.current_price) AS total_sales
            FROM order_items oi
            JOIN orders o ON o.order_id = oi.order_id
            WHERE o.is_final = TRUE
              AND oi.created_at::date = $1
            GROUP BY 1
            ORDER BY 1
        `;
        const result = await db.query(sql, [day]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/**
 * Route to get sales data for menu parts within a time range.
 * @name get/menu-part-sales
 * @function
 * @param {string} from - The start of the time range in ISO format.
 * @param {string} to - The end of the time range in ISO format.
 * @param {boolean} [onlyCurrentlySold] - Whether to include only parts that are currently for sale.
 */
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

/**
 * Route to get sales data for menu items within a time range.
 * @name get/menu-item-sales
 * @function
 * @param {string} from - The start of the time range in ISO format.
 * @param {string} to - The end of the time range in ISO format.
 * @param {boolean} [onlyCurrentlySold] - Whether to include only items that are currently for sale.
 */
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
/**
 * Route to generate an item sales report within a time range.
 * @name get/item-sales-report
 * @function
 * @param {string} from - The start of the time range in ISO format.
 * @param {string} to - The end of the time range in ISO format.
 * @param {boolean} [onlyCurrentlySold] - Whether to include only items that are currently for sale.
 */
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

/**
 * Route to preview the data for a Z-Report without finalizing it.
 * @name get/z-report/preview/:day
 * @function
 * @param {string} day - The day for the report preview in 'YYYY-MM-DD' format.
 */
router.get('/z-report/preview/:day', async (req, res) => { //just check z report dont change db
    try {
        const { exists } = await checkZReportExists(req.params.day);
        if (exists) {
            return res.status(400).json({ error: 'Z report already exists for this date' });
        }
        const latestResult = await db.query(`
            SELECT MAX(oi.created_at) AS latest_time
            FROM order_items oi
            JOIN orders o ON o.order_id = oi.order_id
            WHERE o.is_final = TRUE AND oi.created_at::date = $1
        `, [req.params.day]);
        
        const endTime = latestResult.rows[0]?.latest_time 
            ? new Date(latestResult.rows[0].latest_time)
            : new Date(req.params.day + 'T23:59:59.999Z');
        
        const startTime = await getZReportStartTime(req.params.day, endTime);
        const zReport = await generateZReportData(startTime, endTime);
        
        res.json({
            zReport,
            preview: true,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to create and finalize a Z-Report for a specific day.
 * @name post/z-report/create/:day
 * @function
 * @param {string} day - The day to create the report for in 'YYYY-MM-DD' format.
 */
router.post('/z-report/create/:day', async (req, res) => { //post to make the z report
    try {
        const {exists} = await checkZReportExists(req.params.day);
        if (exists) {
            return res.status(400).json({ error: 'Z report already exists for this date' });
        }
        
        const now = new Date();
        const startTime = await getZReportStartTime(req.params.day, now);
        const zReport = await generateZReportData(startTime, now);
        
        //save z report entry
        const existing = await db.query('SELECT id FROM z_report_history WHERE report_date = $1', [req.params.day]);
        const result = existing.rows.length > 0
            ? await db.query(`
                UPDATE z_report_history 
                SET time_when_closed = NOW(), closed_section = TRUE 
                WHERE report_date = $1 RETURNING time_when_closed
            `, [req.params.day])
            : await db.query(`
                INSERT INTO z_report_history (report_date, time_when_closed, closed_section)
                VALUES ($1, NOW(), TRUE) RETURNING time_when_closed
            `, [req.params.day]);
        
        const closedAt = new Date(result.rows[0].time_when_closed);
        res.json({
            zReport,
            closedAt: closedAt.toISOString(),
            startTime: startTime.toISOString(),
            endTime: closedAt.toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports=router;