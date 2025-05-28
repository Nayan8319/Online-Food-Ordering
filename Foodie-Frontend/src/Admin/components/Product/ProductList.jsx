import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function ProductList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [categories, setCategories] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Fetch categories to map categoryId to category name
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5110/api/Category", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();

      const catMap = {};
      data.forEach((cat) => {
        catMap[cat.categoryId] = cat.name;
      });
      setCategories(catMap);
    } catch (error) {
      console.error("Category fetch error:", error);
    }
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5110/api/Menu", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch products");
      }
      const data = await response.json();
      setRows(data);
      setFilteredRows(data);
      setMessage("");
    } catch (err) {
      setMessage(err.message || "Error fetching products");
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter products by selected product (from autocomplete)
  const filterData = (selectedProduct) => {
    if (selectedProduct) {
      setFilteredRows([selectedProduct]);
      setPage(0);
    } else {
      setFilteredRows(rows);
    }
  };

  // Delete product confirmation
  const deleteProduct = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Add delete API call here if needed
        Swal.fire("Deleted!", "Product has been deleted.", "success");
      }
    });
  };

  return (
    <Paper sx={{ width: "98%", overflow: "hidden", padding: "12px" }}>
      <Typography gutterBottom variant="h5" component="div" sx={{ padding: "20px" }}>
        Products List
      </Typography>
      <Divider />
      <Box height={10} />
      <Stack direction="row" spacing={2} className="my-2 mb-2">
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={rows}
          sx={{ width: 300 }}
          onChange={(e, v) => filterData(v)}
          getOptionLabel={(option) => option.name || ""}
          renderInput={(params) => <TextField {...params} size="small" label="Search Products" />}
        />
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" endIcon={<AddCircleIcon />}>
          Add
        </Button>
      </Stack>

      {message && (
        <Typography color="error" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}

      <TableContainer>
        <Table stickyHeader aria-label="products table">
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ minWidth: 60 }}>ID</TableCell>
              <TableCell align="left" style={{ minWidth: 150 }}>Name</TableCell>
              <TableCell align="left" style={{ minWidth: 300 }}>Description</TableCell>
              <TableCell align="left" style={{ minWidth: 80 }}>Price (₹)</TableCell>
              <TableCell align="left" style={{ minWidth: 80 }}>Quantity</TableCell>
              <TableCell align="left" style={{ minWidth: 150 }}>Image</TableCell>
              <TableCell align="left" style={{ minWidth: 150 }}>Category</TableCell>
              <TableCell align="center" style={{ minWidth: 100 }}>Active</TableCell>
              <TableCell align="left" style={{ minWidth: 100 }}>Actions</TableCell>
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
                .map((row) => (
                  <TableRow key={row.menuId}>
                    <TableCell align="left">{row.menuId}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                    <TableCell align="left">₹{row.price}</TableCell>
                    <TableCell align="left">{row.quantity}</TableCell>
                    <TableCell align="left">
                      {row.imageUrl ? (
                        <img
                          src={`http://localhost:5110/images/${row.imageUrl}`}
                          alt={row.name}
                          style={{ width: 80, height: 50, objectFit: "cover", borderRadius: 4 }}
                          onError={(e) => {
                            e.target.onerror = null;
                             e.target.src = '/images/fallback-image.png'; // fallback image path
                          }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </TableCell>
                    <TableCell align="left">
                      {categories[row.categoryId] || `ID: ${row.categoryId}`}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          color: "white",
                          backgroundColor: row.isActive ? "green" : "red",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          width: 90,
                          textAlign: "center",
                          fontWeight: "bold",
                          userSelect: "none",
                        }}
                      >
                        {row.isActive ? "Active" : "Not Active"}
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      <Stack direction="row" spacing={1}>
                        <EditIcon
                          style={{ fontSize: "20px", color: "blue", cursor: "pointer" }}
                          // onClick={() => editProduct(row.menuId)}
                        />
                        <DeleteIcon
                          style={{ fontSize: "20px", color: "darkred", cursor: "pointer" }}
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
            marginRight: "16px",
          },
        }}
      />
    </Paper>
  );
}
