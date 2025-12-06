import React, { Component } from "react";
import { useEffect, useState } from 'react';
import styles from './SalesReport.module.css';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid,Legend, ResponsiveContainer,} from 'recharts';
export default function SalesReport() {
  const dateToday = new Date();
  const twoDaysBefToday = new Date(dateToday);
  twoDaysBefToday.setDate(twoDaysBefToday.getDate() - 2);
  const [reportType, setType] = useState('menuItems'); 
  const [fromDate, setFromDate] = useState(twoDaysBefToday.toISOString().replace(/T.*/, ''));
  const [toDate, setToDate] = useState(dateToday.toISOString().replace(/T.*/, ''));
  const [currentlySold, setCurrSold] = useState(false);
  const [freqRows, setFreqRows] = useState([]); 
  const [itemRows, setItemRows] = useState([]);   
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  function getFrequency(row) {
    if(row.number){
      return Number(row.number);
    }
    return 0;
  }
  function getQuantity(row) {
    if (row.totalquantity) {
      return Number(row.totalquantity);
    } 
    else if (row.totalQuantity) {
      return Number(row.totalQuantity);
    } 
    return 0;
  }
  function getSales(row) {
    if (row.totalsales) {
      return Number(row.totalsales);
    } 
    else if (row.totalSales) {
      return Number(row.totalSales);
    } 
    return 0;
  }
  let totalQuantity = 0;
  if(reportType==="menuItems"){
    for (let i = 0; i < itemRows.length; i++) {
        if (itemRows[i].totalquantity){
            totalQuantity += itemRows[i].totalquantity;
        }
        else if (itemRows[i].totalQuantity){
            totalQuantity += itemRows[i].totalQuantity;
        }
        else{
            
        }
    }
  }
  let totalRevenue = 0;
  if (reportType === "menuItems"){
    for (let i = 0; i < itemRows.length; i++) {
        if (itemRows[i].totalsales){
            totalRevenue += itemRows[i].totalsales;
        }
        else if (itemRows[i].totalSales){
            totalRevenue += itemRows[i].totalSales;
        }
    }

  }
  const chartVals = [];
  for(let i = 0; i < freqRows.length; i++) {
    const row = freqRows[i];
    let quantity = 0;
    if (row.number != null) {
        quantity = row.number;
    }
    chartVals.push({name: row.label, quantity: quantity,});
    }
    let menuItemsBtnClass = styles.selectorButton;
    if (reportType === "menuItems") {
        menuItemsBtnClass = styles.selectorButton + " " + styles.selectedType;
    }
    let menuPartsBtnClass = styles.selectorButton;
    if (reportType === "menuParts") {
        menuPartsBtnClass = `${styles.selectorButton} ${styles.selectedType}`;
    }
    function handleFromDateChange(e) {
        setFromDate(e.target.value);
    }

    function handleToDateChange(e) {
        setToDate(e.target.value);
    }

  useEffect(() => {
    if (!fromDate || !toDate) {
        return;
    }
    const handleFromDateChange = (e) => {
        setFromDate(e.target.value);
    };
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try{
        const chartReqs = new URLSearchParams();
        chartReqs.set("from", fromDate);
        chartReqs.set("to", toDate);
        if(currentlySold) {
            chartReqs.set("currentlySold", "true");
        } else {
            chartReqs.set("currentlySold", "false");
        }
        let getReportType = "";
        if(reportType === "menuItems"){
        getReportType = "/api/reports/menu-item-sales?" + chartReqs.toString();
            } 
        else {
        getReportType = "/api/reports/menu-part-sales?" + chartReqs.toString();
            }
        const totalRes = await fetch(getReportType);
        if (!totalRes.ok) {
          throw new Error(totalRes.status);
        }
        const totalDataEnt = await totalRes.json();
        if (Array.isArray(totalDataEnt)) {
            setFreqRows(totalDataEnt);
        } 
        else {
            setFreqRows([]);
          }
        if (reportType === "menuItems") {
          const itemRes = await fetch(`/api/reports/item-sales-report?${chartReqs.toString()}`);
          if (!itemRes.ok) {
            throw new Error(itemRes.status);
          }
          const itemJson = await itemRes.json();
          if (Array.isArray(itemJson)) {
            setItemRows(itemJson);
          } 
          else 
          {
            setItemRows([]);
          }
        } 
        else {
          setItemRows([]);
        }
      } 
      catch (err) {
        setError(err.message || 'Failed to load sales report');
        setFreqRows([]);
        setItemRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, 
  [reportType, fromDate, toDate, currentlySold]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sales Report</h2>
      <div className={styles.reportSettings}>
        <div className={styles.reportSelector}>
          <button type="button" className={menuItemsBtnClass} onClick={() => setType("menuItems")}>Menu Items</button>
          <button type="button" className={menuPartsBtnClass} onClick={() => setType("menuParts")}>Menu Parts</button>
        </div>
        <div className={styles.dateRange}>
        <label> From:{' '}<input type="date" value={fromDate} onChange={handleFromDateChange} className={styles.dateInput}/></label>
        <label> To:{' '} <input type="date" value={toDate} onChange={handleToDateChange}/></label>
        </div>
        <label className={styles.checkboxLabel}><input type="checkbox" className={styles.dateInput} checked={currentlySold} onChange={(e) => setCurrSold(e.target.checked)}/>
        Show currently sold items
        </label>
      </div>
      {loading && <p className={styles.outputText}>Loading sales data…</p>}
      {error && <p className={styles.errorText}>Error: {error}</p>}
      {!loading && (<>{freqRows.length === 0 ? (
            <p className={styles.outputText}>No sales found</p>): 
            (<><p className={styles.summary}>Viewing {reportType === 'menuItems' ? 'Menu Items' : 'Menu Parts'}{' '}</p>
              <div className={styles.chartBox}>
                <ResponsiveContainer width="100%" height={310}>
                  <BarChart data={chartVals} margin={{ top: 12, right: 20, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0}tick={{ fill: "#000", fontSize: "15px" }} />
                    <YAxis /> <Legend verticalAlign="top" align="center" wrapperStyle={{ color: "black", fontSize: "17px", marginTop: "-20px"}}/> <Bar dataKey="quantity" name="Sales Count" fill="#ff7518"/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className={styles.tableBox}>
                {reportType === 'menuItems' ? (<table className={styles.table}><thead><tr> <th>Item</th> <th>Quantity Sold</th> <th>Total Sales</th> <th>Average Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemRows.map((row) => {const qty = getQuantity(row); 
                      const sales = getSales(row); 
                      const avg = qty > 0 ? sales/qty : 0;
                        return (<tr key={row.menuItemId}> <td>{row.itemName}</td> <td>{qty}</td> <td>{sales.toFixed(2)}</td> <td>{avg.toFixed(2)}</td></tr>);})}
                    </tbody>
                  </table>):
                   (<table className={styles.table}> <thead><tr> <th>Part</th> <th>Sales Count</th></tr></thead><tbody>{freqRows.map((row, idx) => 
                   (<tr key={idx}><td>{row.label}</td><td>{getFrequency(row)}</td></tr>))}</tbody>
                  </table>)}
              </div>
            </>)}
        </>)}
    </div>);}
