import React, { useEffect, useState } from "react";
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Typography, Divider,
  Box, Stack, Button, TextField, MenuItem, InputAdornment
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    handleSearchAndSort();
  }, [searchTerm, rows, sortKey]);

  
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
      setRows(data);
      setFilteredRows(data);
    } catch (error) {
      setMessage(error.message || "Error fetching products");
    }
  };

  const handleSearchAndSort = () => {
    let temp = [...rows];

    if (searchTerm) {
      temp = temp.filter((item) =>
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
    saveAs(blob, "products.csv");
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
        Swal.fire("Deleted!", "Product has been deleted.", "success");
        const updated = rows.filter((r) => r.menuId !== id);
        setRows(updated);
      } catch (error) {
        Swal.fire("Error!", "Failed to delete product", "error");
      }
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
        Products List
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

        <TextField
          select
          label="Sort by"
          size="small"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="price">Price</MenuItem>
          <MenuItem value="quantity">Quantity</MenuItem>
        </TextField>

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" onClick={exportToCSV}>
          Export
        </Button>

        <Button
          variant="contained"
          endIcon={<AddCircleIcon />}
          onClick={() => navigate("/admin/add-product")}
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
                  No products found.
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
                    <TableCell>{row.quantity}</TableCell>
 <TableCell align="left">
                      {row.imageUrl ? (
                        <img
                          src={getImageSrc(row.imageUrl)}
                          alt={row.name}
                          style={{
                            width: 80,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/fallback-image.png";
                          }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </TableCell>
                    <TableCell>{categories[row.categoryId]}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          backgroundColor: row.isActive ? "green" : "red",
                          color: "white",
                          borderRadius: 1,
                          px: 1,
                          py: 0.5,
                          fontSize: 12,
                        }}
                      >
                        {row.isActive ? "Active" : "Not Active"}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <EditIcon
                          sx={{ color: "blue", cursor: "pointer" }}
                          onClick={() => navigate(`/admin/edit-product/${row.menuId}`)}
                        />
                        <DeleteIcon
                          sx={{ color: "darkred", cursor: "pointer" }}
                          onClick={() => deleteProduct(row.menuId)}
                        />
                      </Stack>
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
