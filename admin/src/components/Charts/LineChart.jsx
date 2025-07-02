import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "./Chart";

const LineChart = ({ url }) => {
    const [orderCountData, setOrderCountData] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${url}/api/order/list`);
                if (response.data.success) {
                    const orders = response.data.data || []; // Ensure orders is an array
                    if (orders.length === 0) {
                        console.warn("No orders found");
                        return;
                    }

                    const ordersByDate = orders.reduce((acc, order) => {
                        const date = new Date(order.date).toLocaleDateString();
                        acc[date] = (acc[date] || 0) + 1;
                        return acc;
                    }, {});

                    setOrderCountData(ordersByDate);
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
        labels: Object.keys(orderCountData), // Dates
        datasets: [
            {
                label: "Order Count",
                data: Object.values(orderCountData), // Order counts
                fill: false,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
            },
        ],
    };

    return <Line data={data} />;
};

export default LineChart;
