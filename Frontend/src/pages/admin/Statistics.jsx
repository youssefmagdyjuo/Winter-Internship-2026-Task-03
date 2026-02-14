import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, AreaChart, Area, ComposedChart } from 'recharts';
import axios from 'axios';

export default function Statistics() {
    const token = localStorage.getItem('mvec_token')

    const [totals, setTotals] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0
    });
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/api/statistics`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTotals(res.data.totals);
                setSalesData(res.data.dailySales);
            } catch (err) {
                console.error("Failed to fetch statistics:", err);
            }
        };

        fetchStatistics();
    }, []);

    return (
        <div className="p-4">
            {/* Totals */}
            <div className="grid lg:grid-cols-4 gap-4 mb-8 sm:grid-cols-2">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold">Total Products</h3>
                    <p>{totals.totalProducts}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold">Total Users</h3>
                    <p>{totals.totalUsers}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold">Total Orders</h3>
                    <p>{totals.totalOrders}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold">Total Revenue</h3>
                    <p>${totals.totalRevenue}</p>
                </div>
            </div>

            {/* Sales Chart */}
            <div className="stat_container">
                <ComposedChart width={'100%'} height={400} data={salesData} >
                    <CartesianGrid stroke="var(--light-gray)" strokeDasharray="5 5" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#82ca9d" />
                    <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" />
                </ComposedChart>
            </div>

        </div>
    );
}
