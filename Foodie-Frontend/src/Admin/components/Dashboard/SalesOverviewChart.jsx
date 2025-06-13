import React from "react";
import { Card } from "react-bootstrap";
import { Box, Typography, Select, MenuItem } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const SalesOverviewChart = ({ timeRange, setTimeRange, data }) => (
  <Card className="p-4">
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h5">Sales Overview</Typography>
      <Select size="small" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
        <MenuItem value="daily">Daily</MenuItem>
        <MenuItem value="weekly">Weekly</MenuItem>
        <MenuItem value="monthly">Monthly</MenuItem>
      </Select>
    </Box>
    <LineChart width={450} height={250} data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  </Card>
);

export default SalesOverviewChart;
