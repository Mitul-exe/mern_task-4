import React, { useEffect, useState, useMemo } from "react";
import PieChart from "../../components/Charts/Piechart";
import BarChart from "../../components/Charts/BarChart";
import LineChart from "../../components/Charts/LineChart";
import DoughnutChart from "../../components/Charts/DoughnutChart";
import Loading from "../../components/Loading/Loading"; // Import the Loading component
import axios from "axios";
import "./Dashboard.css";

const Dashboard = ({ url }) => {
    const [stats, setStats] = useState({
        orders: 0,
        items: 0,
        revenue: 0, // Add revenue to stats
    });
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchStats = async () => {
            try {
                let orderData = [];
                let foodData = [];

                // Fetch orders
                const response = await axios.get(`${url}/api/order/list`);
                if (response.data.success) {
                    orderData = response.data.data || []; // Ensure orders is an array
                }

                // Fetch food items
                const foodResponse = await axios.get(`${url}/api/food/list`);
                if (foodResponse.data.success) {
                    foodData = foodResponse.data.data || []; // Ensure food is an array
                }

                // Calculate total revenue
                const totalRevenue = orderData.reduce((sum, order) => sum + order.amount, 0);

                // Update stats and stop loading
                setStats({
                    items: foodData.length || 0,
                    orders: orderData.length || 0,
                    revenue: totalRevenue, // Set total revenue
                });
                setLoading(false); // Stop loading
            } catch (error) {
                console.error("Error fetching stats:", error);
                setLoading(false); // Stop loading even if there's an error
            }
        };

        fetchStats();
    }, [url]);

    if (loading) {
        return <div className="loader-overlay"><Loading /></div>; // Show loading animation while fetching
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h2>Admin Dashboard</h2>
                <p>Quick overview of your performance and recent activity.</p>
            </div>

            {/* Stats Section */}
            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Orders</h3>
                    <p>{stats.orders}</p>
                </div>
                <div className="stat-card">
                    <h3>Items</h3>
                    <p>{stats.items}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Revenue</h3>
                    <p>Rs. {stats.revenue}</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="dashboard-charts">
                <div className="chart-container">
                    <PieChart url={url} />
                    <h3 className="chart-label">Order Distribution</h3>
                </div>
                <div className="chart-container">
                    <BarChart url={url} />
                    <h3 className="chart-label">Sales Overview</h3>
                </div>
                <div className="chart-container">
                    <LineChart url={url} />
                    <h3 className="chart-label">Trends Over Time</h3>
                </div>
                <div className="chart-container">
                    <DoughnutChart url={url} />
                    <h3 className="chart-label">Food Category Breakdown</h3>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
