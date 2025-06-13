import React from "react";
import { Card } from "react-bootstrap";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Typography } from "@mui/material";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

const SalesPieChart = ({ data, totalSales }) => (
  <Card style={{ backgroundColor: "#17a2b8", color: "white", height: "300px" }} className="p-4 d-flex flex-column align-items-center justify-content-center">
    <Typography variant="h5" className="mb-2">Total Sales</Typography>
    <Typography variant="h4" className="mb-3">${totalSales.toLocaleString()}</Typography>
    <PieChart width={320} height={180}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name }) => name}
        outerRadius={70}
        fill="#8884d8"
        dataKey="sales"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend verticalAlign="bottom" height={36} />
    </PieChart>
  </Card>
);

export default SalesPieChart;

