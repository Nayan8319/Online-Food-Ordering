import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Box, Typography, Select, MenuItem, CircularProgress } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const SalesOverviewChart = ({ timeRange, setTimeRange }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSalesData = async (range) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5110/api/Dashboard/sales-chart?range=${range}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch sales chart data");
      const data = await response.json();
      setChartData(data);
    } catch (error) {
      console.error("Error fetching sales chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData(timeRange);
  }, [timeRange]);

  return (
    <Card className="p-4">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Sales Overview</Typography>
        <Select
          size="small"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </Select>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={250}>
          <CircularProgress />
        </Box>
      ) : (
        <LineChart
          width={450}
          height={250}
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      )}
    </Card>
  );
};

export default SalesOverviewChart;
