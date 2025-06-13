import React from "react";
import { Card, Table, Form, Row, Col } from "react-bootstrap";
import { Typography } from "@mui/material";

const ProductTable = ({ filterText, setFilterText, productFilter, setProductFilter, productList }) => (
  <Card className="p-4">
    <Typography variant="h5" className="mb-4">Product List</Typography>
    <Row className="mb-3">
      <Col md={4}>
        <Form.Control size="sm" type="text" placeholder="Search..." value={filterText} onChange={(e) => setFilterText(e.target.value)} />
      </Col>
      <Col md={3}>
        <Form.Select size="sm" value={productFilter} onChange={(e) => setProductFilter(e.target.value)}>
          <option value="">Filter by</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="stock">Quantity</option>
        </Form.Select>
      </Col>
    </Row>
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Product Name</th>
          <th>Price</th>
          <th>Stock</th>
        </tr>
      </thead>
      <tbody>
        {productList
          .filter(product => {
            const text = filterText.toLowerCase();
            if (productFilter === 'price') {
              return product.price.toLowerCase().includes(text);
            } else if (productFilter === 'stock') {
              return product.stock.toString().includes(text);
            } else {
              return product.name.toLowerCase().includes(text);
            }
          })
          .map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  </Card>
);

export default ProductTable;

