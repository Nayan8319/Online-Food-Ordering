import React, { useEffect, useState } from "react";
import { Col, Spinner, Row, Card } from "react-bootstrap";
import { FaUser, FaShoppingCart, FaBoxOpen, FaBars } from "react-icons/fa";
import "./StatsBoxes.css"; // ⬅️ custom CSS for gradients & hover

const StatsBoxes = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5110/api/Dashboard/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Col md={4} className="text-center py-5">
        <Spinner animation="border" />
      </Col>
    );
  }

  if (!stats) {
    return (
      <Col md={4} className="text-center py-5">
        <p className="text-danger">Failed to load dashboard stats.</p>
      </Col>
    );
  }

  return (
    <Row className="g-4">
      <Col md={3}>
        <Card className="stat-card gradient-green text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6>Total Users</h6>
              <h2>{stats.totalUsers.toLocaleString()}</h2>
              <p className="small">Last Month</p>
            </div>
            <FaUser size={28} />
          </div>
        </Card>
      </Col>

      <Col md={3}>
        <Card className="stat-card gradient-pink text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6>Total Orders</h6>
              <h2>{stats.totalOrders.toLocaleString()}</h2>
              <p className="small">Last Month</p>
            </div>
            <FaShoppingCart size={28} />
          </div>
        </Card>
      </Col>

      <Col md={3}>
        <Card className="stat-card gradient-blue text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6>Total Menus</h6>
              <h2>{stats.totalMenus.toLocaleString()}</h2>
              <p className="small">Last Month</p>
            </div>
            <FaBoxOpen size={28} />
          </div>
        </Card>
      </Col>

      <Col md={3}>
        <Card className="stat-card gradient-yellow text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6>Total Categories</h6>
              <h2>{stats.totalCategories.toLocaleString()}</h2>
              <p className="small">Last Month</p>
            </div>
            <FaBars size={28} />
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default StatsBoxes;
