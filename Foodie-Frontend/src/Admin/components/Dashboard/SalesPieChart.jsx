import React, { useEffect, useState,useCallback } from "react";
import { Card } from "react-bootstrap";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Typography, CircularProgress, Box } from "@mui/material";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

const SalesPieChart = () => {
  const [chartData, setChartData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchChartData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, chartRes] = await Promise.all([
        fetch("http://localhost:5110/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5110/api/dashboard/sales-chart?range=Daily", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const statsData = await statsRes.json();
      const chartData = await chartRes.json();

      setTotalSales(statsData.totalSales || 0);
      setChartData(chartData || []);
    } catch (error) {
      console.error("Error fetching sales pie chart:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  return (
    <Card
      style={{
        backgroundColor: "#17a2b8",
        color: "white",
        height: "300px",
      }}
      className="p-4 d-flex flex-column align-items-center justify-content-center"
    >
      <Typography variant="h5" className="mb-2">
        Total Sales
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={100}>
          <CircularProgress style={{ color: "white" }} />
        </Box>
      ) : (
        <>
          <Typography variant="h4" className="mb-3">
            ₹{totalSales.toLocaleString()}
          </Typography>
          <PieChart width={320} height={180}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name }) => name}
              outerRadius={70}
              fill="#8884d8"
              dataKey="sales"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </>
      )}
    </Card>
  );
};

export default SalesPieChart;
