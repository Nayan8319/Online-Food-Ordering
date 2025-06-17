import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import InvoiceGenerator from "./InvoiceGenerator";
import "./OrderDetails.css";

const ORDER_API = "http://localhost:5110/api/Orders";
const PROFILE_API = "http://localhost:5110/api/Auth/profile";
const fallbackImage = "/fallback-image.png";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrderAndProfile = async () => {
      try {
        const [orderRes, profileRes] = await Promise.all([
          axios.get(`${ORDER_API}/getOrderById/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(PROFILE_API, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setOrder(orderRes.data);
        setUserName(profileRes.data.name || profileRes.data.username);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load order or profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndProfile();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status"></div>
        <h5 className="mt-3">Loading order details...</h5>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container py-5 text-danger text-center">
        <h4>Error: {typeof error === "string" ? error : "Unable to fetch order"}</h4>
        <button className="btn btn-dark mt-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const { generate } = InvoiceGenerator({ order, userName });

  const statusSteps = ["Placed", "Confirmed", "OutForDelivery", "Delivered"];
  const displayNames = {
    Placed: "Placed",
    Confirmed: "Confirmed",
    OutForDelivery: "Out for Delivery",
    Delivered: "Delivered",
  };

  return (
    <section className="h-100" style={{ backgroundColor: "#f0f2f5" }}>
      <MDBContainer className="py-5 mt-5">
        <MDBRow className="justify-content-center">
          <MDBCol lg="10" xl="8">
            <MDBCard className="shadow-lg border-0 rounded-5 overflow-hidden">
              <MDBCardHeader className="bg-warning-subtle px-4 py-4">
                <MDBTypography tag="h5" className="text-dark fw-bold mb-0">
                  🎉 Thanks for your order,{" "}
                  <span className="text-primary">{userName}</span>!
                </MDBTypography>
              </MDBCardHeader>

              <MDBCardBody className="p-4">
                {/* Status Progress */}
                <div className="card-stepper">
                  <ul id="progressbar-1">
                    {statusSteps.map((step, index) => {
                      const isActive =
                        statusSteps.indexOf(order.status) >= index;
                      return (
                        <li key={index} className={isActive ? "active" : ""}>
                          {displayNames[step]}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Order Items */}
                {order.orderDetails.map((item) => (
                  <MDBCard key={item.menuId} className="shadow-sm mb-4 border-0">
                    <MDBCardBody>
                      <MDBRow className="align-items-center">
                        <MDBCol md="2">
                          <MDBCardImage
                            src={
                              item.imageUrl
                                ? `http://localhost:5110${item.imageUrl}`
                                : fallbackImage
                            }
                            fluid
                            alt={item.menuName}
                            className="rounded"
                          />
                        </MDBCol>
                        <MDBCol md="5">
                          <p className="fw-bold mb-1">{item.menuName}</p>
                          <p className="text-muted small">
                            Quantity: {item.quantity}
                          </p>
                        </MDBCol>
                        <MDBCol md="3">
                          <p className="text-muted small">
                            ₹{item.price.toFixed(2)} x {item.quantity}
                          </p>
                        </MDBCol>
                        <MDBCol md="2" className="text-end">
                          <p className="fw-bold">
                            ₹{(item.quantity * item.price).toFixed(2)}
                          </p>
                        </MDBCol>
                      </MDBRow>
                    </MDBCardBody>
                  </MDBCard>
                ))}

                {/* Summary */}
                <div className="p-4 bg-light rounded-4 mt-4">
                  <h6 className="fw-bold mb-3">📋 Order Summary</h6>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span>Total Items</span>
                    <span>{order.orderDetails.length}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span>Status</span>
                    <span>{displayNames[order.status] || order.status}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span>Invoice No.</span>
                    <span>#{order.orderNo}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span>Order Date</span>
                    <span>
                      {new Date(order.orderDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between pt-2">
                    <span>Delivery Charges</span>
                    <span className="text-success fw-bold">Free</span>
                  </div>
                </div>
              </MDBCardBody>

              <MDBCardFooter className="bg-dark text-white d-flex justify-content-between align-items-center px-4 py-3">
                <h5 className="mb-0 fw-bold">
                  Total Paid: ₹{order.totalAmount.toFixed(2)}
                </h5>
                <div>
                  <button
                    className="btn btn-outline-light me-2"
                    onClick={() => navigate("/profile")}
                  >
                    Back
                  </button>
                  <button
                    className="btn btn-warning text-dark fw-bold"
                    onClick={generate}
                  >
                    Download Invoice
                  </button>
                </div>
              </MDBCardFooter>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
};

export default OrderDetails;
