import { useState } from 'react';
import styles from './Reports.module.css';

//Fake report data for demoooo
const FAKE_Z_REPORT = {
    totalOrders: 127,
    totalItems: 342,
    totalEarnings: 1847.50
};
const FAKE_X_REPORT = [
    { hour: new Date().setHours(8,0,0,0), total_sales: 145.25 },
    { hour: new Date().setHours(9,0,0,0), total_sales: 198.50 },
    { hour: new Date().setHours(10, 0, 0, 0), total_sales: 267.75 },
    { hour: new Date().setHours(11, 0, 0, 0), total_sales: 312.00 },
    { hour: new Date().setHours(12, 0, 0, 0), total_sales: 445.30 },
    { hour: new Date().setHours(13, 0, 0, 0), total_sales: 389.20 },
    { hour: new Date().setHours(14, 0, 0, 0), total_sales: 234.15 },
    { hour: new Date().setHours(15, 0, 0, 0), total_sales: 198.75 },
    { hour: new Date().setHours(16, 0, 0, 0), total_sales: 156.40 },
    { hour: new Date().setHours(17, 0, 0, 0), total_sales: 101.20 }
];
export default function Reports() {
    const [view, setView] = useState('z'); //eitherz or x
    const [zDate, setZDate] = useState(new Date().toISOString().split('T')[0]);
    const [xDate, setXDate] = useState(new Date().toISOString().split('T')[0]);
    const [zReport, setZReport] = useState(null);
    const [xReport, setXReport] = useState([]);
    const [lastZReportTime, setLastZReportTime] = useState(null);
    const isToday = (date) => {
        const today = new Date().toISOString().split('T')[0];
        return date === today;
    };
    const isAlreadyClosedToday = () => {//check for this cause last time we got a bit cooked
        if (!lastZReportTime) return false;
        const today = new Date();
        const lastZ = new Date(lastZReportTime);
        return today.toDateString()===lastZ.toDateString();
    };

    const handleRunZ = () => {
        setZReport(FAKE_Z_REPORT);
    };

    const handleCreateZ = () => {
        setZReport(FAKE_Z_REPORT);
        const now=new Date();
        setLastZReportTime(now);
    };

    const handleRunX = () => {
        setXReport(FAKE_X_REPORT);
    };

    const formatTime = (timestamp) => {//unused atm
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US',{ hour:'numeric', minute:'2-digit', hour12:true });
    };
    const formatDateTime = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };
    const getStatusMessage = () => {
        if (view === 'z') {
            const viewingToday = isToday(zDate);
            if (viewingToday && isAlreadyClosedToday()) {
                return `Closed at: ${formatDateTime(lastZReportTime)}`;
            } else if (viewingToday) {
                return 'Z Report is open';
            } else {
                return `Viewing Z-Report for ${zDate}`;
            }
        }
        return null;
    };
    const canCreateZ = () => {
        return isToday(zDate) && !isAlreadyClosedToday();
    };

    return (
        <div className={styles.reports}>
            <div className={styles.viewButtons}>
                <button
                    className={view === 'z' ? styles.active : ''}
                    onClick={() => setView('z')}
                >
                    Z Report
                </button>
                <button
                    className={view === 'x' ? styles.active : ''}
                    onClick={() => setView('x')}
                >
                    X Report
                </button>
            </div>

            {view === 'z' && (
                <div className={styles.zView}>
                    <div className={styles.zControls}>
                        <input
                            type="date"
                            value={zDate}
                            onChange={(e) => setZDate(e.target.value)}
                            className={styles.dateInput}
                        />
                        <button onClick={handleRunZ}>
                            View Z-Report
                        </button>
                        <button
                            onClick={handleCreateZ}
                            disabled={!canCreateZ()}
                            className={styles.createButton}
                        >
                            Create Z-Report
                        </button>
                        {getStatusMessage() && (
                            <span className={styles.statusLabel}>
                                {getStatusMessage()}
                            </span>
                        )}
                    </div>

                    {zReport && (
                        <table className={styles.reportTable}>
                            <thead>
                                <tr>
                                    <th>Component</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Total Orders</td>
                                    <td>{zReport.totalOrders || 0}</td>
                                </tr>
                                <tr>
                                    <td>Total Items Sold</td>
                                    <td>{zReport.totalItems || 0}</td>
                                </tr>
                                <tr>
                                    <td>{isToday(zDate) && isAlreadyClosedToday() ? 'Gross Sales' : 'Total Sales'}</td>
                                    <td>${parseFloat(zReport.totalEarnings || 0).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Average Order Value</td>
                                    <td>
                                        {zReport.totalOrders > 0
                                            ? `$${(parseFloat(zReport.totalEarnings || 0) / zReport.totalOrders).toFixed(2)}`
                                            : '$0.00'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {view === 'x' && (
                <div className={styles.xView}>
                    <div className={styles.xControls}>
                        <input
                            type="date"
                            value={xDate}
                            onChange={(e) => setXDate(e.target.value)}
                            className={styles.dateInput}
                        />
                        <button onClick={handleRunX}>
                            Run X-Report
                        </button>
                    </div>

                    {xReport.length > 0 && (
                        <table className={styles.reportTable}>
                            <thead>
                                <tr>
                                    <th>Hour</th>
                                    <th>Total Sales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {xReport.map((row, index) => {
                                    const hour = new Date(row.hour);
                                    const hourStr = hour.toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        hour12: true
                                    });
                                    return (
                                        <tr key={index}>
                                            <td>{hourStr}</td>
                                            <td>${parseFloat(row.total_sales || 0).toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div> 
    );//this was so painful
}
