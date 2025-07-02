import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import "./Chart";

const PieChart = ({ url }) => {
    const [statusData, setStatusData] = useState({ processing: 0, outForDelivery: 0, delivered: 0 });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${url}/api/order/list`);
                console.log(response.data);
                console.log(response);
                if (response.data.success) {
                    const orders = response.data.data || []; // Ensure orders is an array
                    if (orders.length === 0) {
                        console.warn("No orders found");
                        return;
                    }

                    const statusCounts = orders.reduce(
                        (acc, order) => {
                            if (order.status === "Food Processing") {
                                acc.processing++;
                            } else if (order.status === "Out for Delivery") {
                                acc.outForDelivery++;
                            } else if (order.status === "Delivered") {
                                acc.delivered++;
                            }
                            return acc;
                        },
                        { processing: 0, outForDelivery: 0, delivered: 0 }
                    );

                    setStatusData(statusCounts);
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
        labels: ["Food Processing", "Out for Delivery", "Delivered"],
        datasets: [
            {
                data: [statusData.processing, statusData.outForDelivery, statusData.delivered],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                borderColor: "#fff",
                borderWidth: 1,
            },
        ],
    };

    return <Pie data={data} />;
};

export default PieChart;
