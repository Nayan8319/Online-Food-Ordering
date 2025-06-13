import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import StatsBoxes from "../components/Dashboard/StatsBoxes";
// import SalesPieChart from "../components/Dashboard/SalesPieChart";
import SalesOverviewChart from "../components/Dashboard/SalesOverviewChart";
import RecentOrders from "../components/Dashboard/RecentOrders";
import ProductTable from "../components/Dashboard/ProductTable";

const salesData = {
  daily: [
    { name: "Mon", sales: 200 },
    { name: "Tue", sales: 300 },
    { name: "Wed", sales: 250 },
    { name: "Thu", sales: 400 },
    { name: "Fri", sales: 150 },
    { name: "Sat", sales: 500 },
    { name: "Sun", sales: 350 },
  ],
  weekly: [
    { name: "Week 1", sales: 1500 },
    { name: "Week 2", sales: 1800 },
    { name: "Week 3", sales: 1700 },
    { name: "Week 4", sales: 2100 },
  ],
  monthly: [
    { name: "Jan", sales: 8000 },
    { name: "Feb", sales: 9500 },
    { name: "Mar", sales: 8700 },
    { name: "Apr", sales: 12000 },
    { name: "May", sales: 15000 },
  ],
};

const totalSales = 45000;
const productList = [
  { id: 1, name: "Product A", price: "$100", stock: 50 },
  { id: 2, name: "Product B", price: "$150", stock: 30 },
  { id: 3, name: "Product C", price: "$200", stock: 20 },
  { id: 4, name: "Product D", price: "$250", stock: 60 },
];
const recentOrders = [
  { id: 1, customer: "Alice", status: "Delivered", total: "$150" },
  { id: 2, customer: "Bob", status: "Pending", total: "$220" },
  { id: 3, customer: "Charlie", status: "Shipped", total: "$180" },
  { id: 4, customer: "David", status: "Cancelled", total: "$0" },
  { id: 5, customer: "Eva", status: "Delivered", total: "$310" },
];

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [filterText, setFilterText] = useState("");
  const [productFilter, setProductFilter] = useState("");

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <StatsBoxes />
        <Col md={6}>
          {/* <SalesPieChart data={salesData.monthly} totalSales={totalSales} /> */}
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <SalesOverviewChart timeRange={timeRange} setTimeRange={setTimeRange} data={salesData[timeRange]} />
        </Col>
        <Col md={6}>
          <RecentOrders orders={recentOrders} />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <ProductTable
            filterText={filterText}
            setFilterText={setFilterText}
            productFilter={productFilter}
            setProductFilter={setProductFilter}
            productList={productList}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
