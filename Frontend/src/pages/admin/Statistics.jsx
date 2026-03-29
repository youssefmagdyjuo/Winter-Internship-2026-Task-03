import React, { useEffect, useState } from 'react';
import {
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Bar,
    Line,
    ComposedChart,
    ResponsiveContainer
} from 'recharts';
import axios from 'axios';

export default function Statistics() {

    const token = localStorage.getItem('ssbms_token');

    const [totals, setTotals] = useState({
        totalServices: 0,
        totalUsers: 0,
        totalBookings: 0,
        totalApprovedBookings: 0,
        totalPendingBookings: 0,
        totalRejectedBookings: 0
    });

    const [statsData, setStatsData] = useState([]);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/v1/api/statistics`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setTotals(res.data.totals);
                setStatsData(res.data.dailyStats);

            } catch (err) {
                console.error("Failed to fetch statistics:", err);
            }
        };

        fetchStatistics();
    }, []);

    return (
        <div className="p-4">

            {/* ===================== */}
            {/* TOTAL CARDS */}
            {/* ===================== */}
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4 mb-8">

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold">Total Services</h3>
                    <p className="text-xl font-bold">{totals.totalServices}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold">Total Users</h3>
                    <p className="text-xl font-bold">{totals.totalUsers}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold">Total Bookings</h3>
                    <p className="text-xl font-bold">{totals.totalBookings}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold text-green-600">Approved</h3>
                    <p className="text-xl font-bold">{totals.totalApprovedBookings}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold text-yellow-600">Pending</h3>
                    <p className="text-xl font-bold">{totals.totalPendingBookings}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold text-red-600">Rejected</h3>
                    <p className="text-xl font-bold">{totals.totalRejectedBookings}</p>
                </div>

            </div>

            {/* ===================== */}
            {/* CHART */}
            {/* ===================== */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">
                    Bookings Overview
                </h2>

                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={statsData}>
                        <CartesianGrid strokeDasharray="5 5" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />

                        {/* Total Bookings */}
                        <Bar dataKey="bookings" fill="var(--color-primary)" />

                        {/* Approved Bookings */}
                        <Line
                            type="monotone"
                            dataKey="approved"
                            strokeWidth={3}
                            fill='var(--color-secondary)'
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
}