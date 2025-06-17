import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Divider,
  Box,
  Stack,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";

export default function ProductList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [categories, setCategories] = useState({});
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("");

  const navigate = useNavigate();

  const sortOptions = [
    { label: "None", value: "" },
    { label: "Name", value: "name" },
    { label: "Price", value: "price" },
    { label: "Quantity", value: "quantity" },
  ];

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    handleSearchAndSort();
  }, [searchTerm, sortKey, rows]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5110/api/Category", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const catMap = {};
      data.forEach((cat) => (catMap[cat.categoryId] = cat.name));
      setCategories(catMap);
    } catch (error) {
      console.error("Category fetch error:", error.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5110/api/Menu", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setRows(data);
        setFilteredRows(data);
      } else if (data && Array.isArray(data.items)) {
        setRows(data.items);
        setFilteredRows(data.items);
      } else {
        setRows([]);
        setFilteredRows([]);
        setMessage("No valid Menu Item data found.");
      }
    } catch (error) {
      setMessage(error.message || "Error fetching Menu Items");
    }
  };

  const handleSearchAndSort = () => {
    let temp = [...rows];

    if (searchTerm) {
      temp = temp.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (categories[item.categoryId] || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (sortKey) {
      temp.sort((a, b) => {
        if (sortKey === "price" || sortKey === "quantity") {
          return a[sortKey] - b[sortKey];
        }
        return a[sortKey].localeCompare(b[sortKey]);
      });
    }

    setFilteredRows(temp);
    setPage(0);
  };

  const exportToCSV = () => {
    const dataToExport = filteredRows.map((item) => ({
      Name: item.name,
      Description: item.description,
      Price: item.price,
      Quantity: item.quantity,
      Category: categories[item.categoryId] || item.categoryId,
      Active: item.isActive ? "Yes" : "No",
    }));
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Menus.csv");
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5110/api/Menu/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire("Deleted!", "Menu Item has been deleted.", "success");
        const updated = rows.filter((r) => r.menuId !== id);
        setRows(updated);
      } catch (error) {
        Swal.fire("Error!", "Failed to delete Menu Item", "error");
      }
    }
  };

  const deactivateOutOfStock = async () => {
    const confirm = await Swal.fire({
      title: "Deactivate Out-of-Stock Items?",
      text: "This will deactivate all menu items with quantity 0 or less.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5110/api/Menu/deactivate-out-of-stock",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const resultText = await response.text();

      if (response.ok) {
        Swal.fire("Success", resultText, "success");
        fetchProducts();
      } else {
        Swal.fire("Error", resultText || "Failed to deactivate", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to deactivate", "error");
    }
  };

  const getImageSrc = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    } else if (imageUrl.startsWith("/")) {
      return `http://localhost:5110${imageUrl}`;
    } else {
      return `http://localhost:5110/${imageUrl}`;
    }
  };

  return (
    <Paper sx={{ width: "98%", overflow: "hidden", padding: "12px" }}>
      <Typography gutterBottom variant="h5" sx={{ padding: "20px" }}>
        Menus List
      </Typography>
      <Divider />

      <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 2 }}>
        <TextField
          label="Search by name/category"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Autocomplete
          size="small"
          options={sortOptions}
          value={sortOptions.find((opt) => opt.value === sortKey) || sortOptions[0]}
          onChange={(e, newValue) => setSortKey(newValue?.value || "")}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          sx={{ width: 200 }}
          renderInput={(params) => (
            <TextField {...params} label="Sort by" variant="outlined" />
          )}
        />

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="error" onClick={deactivateOutOfStock}>
          Out of Stock
        </Button>

        <Button variant="outlined" onClick={exportToCSV}>
          Export
        </Button>

        <Button
          variant="contained"
          endIcon={<AddCircleIcon />}
          onClick={() => navigate("/admin/menu/add-menu-item")}
        >
          Add
        </Button>
      </Stack>

      {message && <Typography color="error">{message}</Typography>}

      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price (₹)</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="center">Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No Menu Item found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={row.menuId}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>₹{row.price}</TableCell>
                    <TableCell>
                      {row.quantity === 0 ? (
                        <span className="badge rounded-pill" style={{ backgroundColor: "#ff1a1a", color: "#fff" }}>
                          Out of Stock
                        </span>
                      ) : row.quantity <= 5 ? (
                        <span className="badge rounded-pill" style={{ backgroundColor: "#ffcc00", color: "#000" }}>
                          Low Stock ({row.quantity})
                        </span>
                      ) : (
                        row.quantity
                      )}
                    </TableCell>
                    <TableCell>
                      {row.imageUrl ? (
                        <img
                          alt={row.name}
                          src={getImageSrc(row.imageUrl)}
                          style={{ width: 50, height: 50, objectFit: "cover" }}
                        />
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>{categories[row.categoryId]}</TableCell>
                    <TableCell align="center">
                      <span
                        className="badge rounded-pill"
                        style={{
                          backgroundColor: row.isActive ? "green" : "red",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                          padding: "0.25em 0.75em",
                          borderRadius: "50rem",
                          display: "inline-flex",
                          justifyContent: "center",
                          width: "75px",
                        }}
                      >
                        {row.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        sx={{ mr: 1 }}
                        onClick={() => navigate(`/admin/menu/edit-menu/${row.menuId}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => deleteProduct(row.menuId)}
                      >
                        Delete
                      </Button>
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
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          "& .MuiTablePagination-toolbar": {
            display: "flex",
            justifyContent: "space-between",
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            margin: 0,
          },
        }}
      />
    </Paper>
  );
}
