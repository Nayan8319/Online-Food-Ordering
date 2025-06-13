import React, { useEffect, useState } from "react";
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, Typography, Divider, Stack,
  Button, TextField, MenuItem, Chip
} from "@mui/material";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

const statusOptions = [

  { label: "Confirmed", value: 1 },
  { label: "OutForDelivery", value: 2 },
  { label: "Delivered", value: 3 }
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortKey, setSortKey] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [sortKey, orders, searchText]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5110/api/Admin/getAllOrders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
      setFilteredOrders(data);

      data.forEach(order => {
        if (order.status === "OutForDelivery") {
          setAutoDelivery(order.orderId);
        }
      });
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const setAutoDelivery = (orderId) => {
    setTimeout(() => {
      updateOrderStatus(orderId, 3);
    }, 5 * 60 * 1000); // 5 minutes
  };

  const filterAndSortOrders = () => {
    let result = [...orders];

    // Search filter
    if (searchText.trim() !== "") {
      result = result.filter(order =>
        order.orderNo.toLowerCase().includes(searchText.toLowerCase()) ||
        order.status.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Sort logic
    switch (sortKey) {
      case "amount":
        result.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case "date":
        result.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        break;
      case "status":
        result.sort((a, b) => a.status.localeCompare(b.status));
        break;
      default:
        break;
    }

    setFilteredOrders(result);
    setPage(0);
  };

  const handleChangeStatus = async (orderId, currentStatus) => {
    const { value: selectedValue } = await Swal.fire({
      title: "Change Order Status",
      input: "select",
      inputOptions: statusOptions.reduce((acc, cur) => {
        acc[cur.value] = cur.label;
        return acc;
      }, {}),
      inputValue: statusOptions.find(s => s.label === currentStatus)?.value,
      showCancelButton: true,
    });

    if (!selectedValue) return;

    const newStatus = parseInt(selectedValue);
    const selectedLabel = statusOptions.find(s => s.value === newStatus)?.label;

    if (selectedLabel === currentStatus) return;

    await updateOrderStatus(orderId, newStatus);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5110/api/Admin/update-status/${orderId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newStatus }),
      });

      const result = await res.json();
      fetchOrders();

      if (newStatus !== 3) {
        Swal.fire("Updated", result.message || "Status updated", "success");
      }

      if (newStatus === 2) {
        setAutoDelivery(orderId);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Placed":
        return { backgroundColor: "#ffecb3", color: "#795548" };
      case "Confirmed":
        return { backgroundColor: "#c8e6c9", color: "#2e7d32" };
      case "OutForDelivery":
        return { backgroundColor: "#ffe0b2", color: "#ef6c00" };
      case "Delivered":
        return { backgroundColor: "#b2dfdb", color: "#00695c" };
      default:
        return {};
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: "98%", overflow: "hidden", padding: "12px" }}>
      <Typography variant="h5" sx={{ padding: "20px" }}>
        Order List
      </Typography>
      <Divider />

      <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 2 }} justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Stack direction="row" spacing={2}>
          <TextField
            label="Search"
            size="small"
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <TextField
            select
            label="Sort by"
            size="small"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="amount">Amount</MenuItem>
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </TextField>
        </Stack>
        {filteredOrders.length > 0 && (
          <CSVLink data={filteredOrders} filename="all_orders.csv">
            <Button variant="contained" color="secondary">
              Export CSV
            </Button>
          </CSVLink>
        )}
      </Stack>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Order No</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Amount (₹)</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order, index) => (
                  <TableRow key={order.orderId}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{order.orderNo}</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        sx={{
                          borderRadius: "999px",
                          px: 1.5,
                          fontWeight: "bold",
                          ...getStatusStyle(order.status),
                        }}
                      />
                    </TableCell>
                    <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      {order.orderDetails.map((item, i) => (
                        <div key={i}>
                          • {item.menuName} x {item.quantity} – ₹{item.price}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      {order.status !== "Delivered" && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleChangeStatus(order.orderId, order.status)}
                        >
                          Change Status
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 25, 100]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          "& .MuiTablePagination-toolbar": {
            display: "flex",
            flexWrap: "nowrap",
            justifyContent: "space-between",
            alignItems: "center",
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            margin: 0,
            whiteSpace: "nowrap",
          },
          "& .MuiTablePagination-select": {
            marginRight: 2,
          },
          "& .MuiTablePagination-actions": {
            whiteSpace: "nowrap",
            display: "flex",
            gap: "5px",
          },
        }}
      />
    </Paper>
  );
}
