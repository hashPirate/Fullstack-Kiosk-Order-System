import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Reports.module.css';

export default function Reports() {
    const [view, setView] = useState('z'); //eitherz or x
    const [zDate, setZDate] = useState(new Date().toISOString().split('T')[0]);
    const [xDate, setXDate] = useState(new Date().toISOString().split('T')[0]);
    const [zReport, setZReport] = useState(null);
    const [xReport, setXReport] = useState([]);
    const [zReportExists, setZReportExists] = useState(false);
    const [zReportClosedAt, setZReportClosedAt] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); 
    // i just did a full rewrite from this point
    
    //check if Z report exists for the selected date
    useEffect(() => {
        const checkZReportExists = async () => {
            try {
                const response = await axios.get(`/api/reports/z-report/check/${zDate}`);
                setZReportExists(response.data.exists);
                if (response.data.closedAt) {
                    const closedDate = new Date(response.data.closedAt);
                    if (!isNaN(closedDate.getTime())) {
                        setZReportClosedAt(closedDate);
                    } else {
                        setZReportClosedAt(null);
                    }
                } else {
                    setZReportClosedAt(null);
                }
                //clear the report when date changes so it no confused
                setZReport(null);
            } catch (err) {
                console.error('Error checking Z-report status:',err);
                setZReportExists(false);
                setZReportClosedAt(null);
                setZReport(null);
            }
        };
        checkZReportExists();
    }, [zDate]);
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
    const handleViewZ=async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/reports/z-report/${zDate}`);
            setZReport(response.data);
        } catch (err) {
            console.error('Error loading Z-report:', err);
            setError(err.response?.data?.error||'Failed to load Z-report. Please try again.');
            setZReport(null);
        } finally {
            setLoading(false);
        }
    };
    const handlePreviewZ=async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/reports/z-report/preview/${zDate}`);
            setZReport(response.data.zReport);
        } catch (err) {
            console.error('Error previewing Z-report:',err);
            setError(err.response?.data?.error||'Failed to preview Z-report. Please try again.');
            setZReport(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateZ=async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`/api/reports/z-report/create/${zDate}`);
            setZReport(response.data.zReport);
            setZReportExists(true);
            setZReportClosedAt(new Date(response.data.closedAt));
        } catch (err) {
            console.error('Error creating Z-report:', err);
            setError(err.response?.data?.error || 'Failed to create Z-report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRunX = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/reports/x-report/${xDate}`);
            setXReport(response.data);
        } catch (err) {
            console.error('Error loading X-report:', err);
            setError('Failed to load X-report. Please try again.');
            setXReport([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusMessage = () => {
        if (view === 'z') {
            if (zReportExists && zReportClosedAt) {
                return `Closed at: ${formatDateTime(zReportClosedAt)}`;
            } else {
                return 'Z Report is open';
            }
        }
        return null;
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

            {error && (
                <div className={styles.error} style={{ color: 'red', padding: '10px', margin: '10px 0' }}>
                    {error}
                </div>
            )}

            {view === 'z' && (
                <div className={styles.zView}>
                    <div className={styles.zControls}>
                        <input
                            type="date"
                            value={zDate}
                            onChange={(e) => setZDate(e.target.value)}
                            className={styles.dateInput}
                        />
                        {zReportExists ? (
                            <button onClick={handleViewZ} disabled={loading} className={styles.viewButton}>
                                {loading ? 'Loading...' : 'View Z-Report'}
                            </button>
                        ) : (
                            <>
                                <button onClick={handlePreviewZ} disabled={loading} className={styles.previewButton}>
                                    {loading ? 'Loading...' : 'Preview Z-Report'}
                                </button>
                                <button
                                    onClick={handleCreateZ}
                                    disabled={loading}
                                    className={styles.createButton}
                                >
                                    {loading ? 'Creating...' : 'Create Z-Report'}
                                </button>
                            </>
                        )}
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
                                    <td>{zReportExists ? 'Gross Sales' : 'Total Sales'}</td>
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
                        <button onClick={handleRunX} disabled={loading}>
                            {loading ? 'Loading...' : 'Run X-Report'}
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
                    {xReport.length === 0 && !loading && (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            No sales data for this date. Click "Run X-Report" to load data.
                        </div>
                    )}
                </div>
            )}
        </div> 
    );//this was so painful
}
