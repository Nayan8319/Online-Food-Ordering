import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Button,
  Select,
  MenuItem,
  Typography,
  Paper,
  Box,
  CircularProgress,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Stack,
} from "@mui/material";
import { CSVLink } from "react-csv";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const AdminReportPage = () => {
  const [chartData, setChartData] = useState([]);
  const [range, setRange] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [orderDate, setOrderDate] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [todayOrders, setTodayOrders] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, [range]);

  const fetchData = async () => {
    setLoading(true);
    await fetchChartData();
    await fetchTodayOrders();
    setLoading(false);
  };

  const fetchChartData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5110/api/Dashboard/sales-chart?range=${range}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setChartData(res.data);
    } catch (err) {
      console.error("Chart data error:", err);
    }
  };

  const fetchTodayOrders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5110/api/Dashboard/today-orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTodayOrders(res.data);
    } catch (err) {
      console.error("Today's orders error:", err);
    }
  };

  const fetchOrdersByDate = async () => {
    if (!orderDate) return;

    try {
      const res = await axios.get(
        `http://localhost:5110/api/Dashboard/orders-by-date?date=${orderDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFilteredOrders(res.data);
    } catch (err) {
      console.error("Orders by date error:", err);
      setFilteredOrders([]);
    }
  };

  const barColors = [
    "#3f51b5",
    "#e91e63",
    "#4caf50",
    "#ff9800",
    "#2196f3",
    "#9c27b0",
    "#f44336",
    "#00bcd4",
    "#8bc34a",
    "#ffc107",
  ];

  const barChartData = {
    labels: chartData.map((item) => item.Name || item.name),
    datasets: [
      {
        label: "Sales",
        data: chartData.map((item) => item.Sales || item.sales),
        backgroundColor: chartData.map(
          (_, index) => barColors[index % barColors.length]
        ),
      },
    ],
  };

  const pieChartData = {
    labels: chartData.map((item) => item.Name || item.name),
    datasets: [
      {
        label: "Sales",
        data: chartData.map((item) => item.Sales || item.sales),
        backgroundColor: barColors,
      },
    ],
  };

  const totalSales = chartData.reduce(
    (acc, item) => acc + (item.Sales || item.sales || 0),
    0
  );

  return (
    <Box p={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Admin Sales Report</Typography>
        {todayOrders.length > 0 && (
          <CSVLink data={todayOrders} filename="today_orders.csv">
            <Button variant="contained" color="secondary">
              Export Today's Orders CSV
            </Button>
          </CSVLink>
        )}
      </Stack>

      <Box display="flex" gap={2} alignItems="center" mb={3}>
        <Typography variant="subtitle1">Chart Range:</Typography>
        <Select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          size="small"
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </Select>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} mb={8}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }} style={{ width: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Sales Bar Chart
              </Typography>
              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <Bar
                  data={barChartData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                  height={350}
                  width={550}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }} style={{ width: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Sales Pie Chart
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Total Sales: ₹{totalSales.toFixed(2)}
              </Typography>
              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <Pie
                  data={pieChartData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                  height={310}
                  width={500}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Box mt={5} display="flex" flexWrap="wrap" gap={2} alignItems="center">
        <Typography variant="h6">Filter Orders by Date:</Typography>
        <TextField
          type="date"
          size="small"
          value={orderDate}
          onChange={(e) => setOrderDate(e.target.value)}
        />
        <Button variant="contained" onClick={fetchOrdersByDate}>
          Get Orders
        </Button>

        {filteredOrders.length > 0 && (
          <CSVLink data={filteredOrders} filename="filtered_orders.csv">
            <Button variant="outlined" color="primary">
              Export Orders CSV
            </Button>
          </CSVLink>
        )}
      </Box>

      {filteredOrders.length > 0 && (
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Orders on {orderDate}
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Order ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Customer</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Total</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.userName || "N/A"}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default AdminReportPage;
