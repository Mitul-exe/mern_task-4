import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import "./Chart";

const DoughnutChart = ({ url }) => {
    const [categoryData, setCategoryData] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(url + "/api/order/list");
                if (response.data.success) {
                    const orders = response.data.data || []; // Ensure orders is an array
                    if (orders.length === 0) {
                        console.warn("No orders found");
                        return;
                    }

                    const categories = orders.flatMap((order) =>
                        order.items.map((item) => item.category)
                    );

                    const categoryCounts = categories.reduce((acc, category) => {
                        acc[category] = (acc[category] || 0) + 1;
                        return acc;
                    }, {});

                    setCategoryData(categoryCounts);
                } else {
                    console.error("Error fetching orders");
                }
            } catch (error) {
                console.error("Error fetching orders", error);
            }
        };

        fetchOrders();
    }, [url]);

    const data = {
        labels: Object.keys(categoryData), // Categories
        datasets: [
            {
                data: Object.values(categoryData), // Count for each category
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                ],
                borderColor: "#fff",
                borderWidth: 1,
            },
        ],
    };

    return <Doughnut data={data} />;
};

export default DoughnutChart;
