import React, { useState, useEffect } from "react";
import { Card, Table, Form, Row, Col, Spinner } from "react-bootstrap";
import { Typography } from "@mui/material";

const ProductTable = ({ filterText, setFilterText, productFilter, setProductFilter }) => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch product/menu data from API on mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5110/api/Menu", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setProductList(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card className="p-4 text-center">
        <Spinner animation="border" variant="primary" />
      </Card>
    );
  }

  if (productList.length === 0) {
    return (
      <Card className="p-4 text-center">
        <Typography variant="body1" color="textSecondary">
          No menu items found.
        </Typography>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <Typography variant="h5" className="mb-4">Menu List</Typography>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            size="sm"
            type="text"
            placeholder="Search..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            size="sm"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
          >
            <option value="">Filter by</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="quantity">Quantity</option>
          </Form.Select>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th className="fw-bold">Menu Id</th>
            <th className="fw-bold">Name</th>
            <th className="fw-bold">Price</th>
            <th className="fw-bold">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {productList
            .filter(menu => {
              const text = filterText.toLowerCase();
              if (productFilter === 'price') {
                return menu.price.toString().toLowerCase().includes(text);
              } else if (productFilter === 'quantity') {
                return menu.quantity.toString().includes(text);
              } else {
                return menu.name.toLowerCase().includes(text);
              }
            })
            .map((menu, idx) => (
              <tr key={menu.menuId}>
                <td>{idx + 1}</td>
                <td>{menu.name}</td>
                <td>₹{menu.price.toLocaleString()}</td>
                <td>{menu.quantity}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default ProductTable;
