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
  MenuItem,
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

export default function CategoryList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
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
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch categories");

      const data = await response.json();
      if (Array.isArray(data)) {
        setRows(data);
        setFilteredRows(data);
      } else {
        setRows([]);
        setFilteredRows([]);
        setMessage("No valid category data found.");
      }
    } catch (error) {
      setMessage(error.message || "Error fetching categories");
    }
  };

  const handleSearchAndSort = () => {
    let temp = [...rows];

    if (searchTerm) {
      temp = temp.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortKey) {
      temp.sort((a, b) => {
        if (sortKey === "isActive") {
          return a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1;
        }
        if (sortKey === "name") {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
    }

    setFilteredRows(temp);
    setPage(0);
  };

  const exportToCSV = () => {
    const dataToExport = filteredRows.map((item) => ({
      ID: item.categoryId,
      Name: item.name,
      ImageUrl: item.imageUrl || "No Image",
      Active: item.isActive ? "Yes" : "No",
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "categories.csv");
  };

  const deleteCategory = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the category permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5110/api/Category/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage =
            errorData?.message || "Failed to delete category";

          if (
            response.status === 400 &&
            errorMessage
              .toLowerCase()
              .includes("associated with existing products")
          ) {
            Swal.fire(
              "Cannot delete!",
              "This category is associated with existing products and cannot be deleted.",
              "error"
            );
          } else {
            Swal.fire("Error!", errorMessage, "error");
          }
          return;
        }

        Swal.fire("Deleted!", "Category has been deleted.", "success");
        setRows((prev) => prev.filter((r) => r.categoryId !== id));
      } catch (error) {
        Swal.fire("Error!", error.message, "error");
      }
    }
  };

  const getImageSrc = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    return imageUrl.startsWith("/")
      ? `http://localhost:5110${imageUrl}`
      : `http://localhost:5110/${imageUrl}`;
  };

  return (
    <Paper sx={{ width: "98%", overflow: "hidden", padding: "16px" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Categories List
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Search by name"
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
          <MenuItem value="isActive">Active Status</MenuItem>
        </TextField>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" onClick={exportToCSV}>
          Export
        </Button>
        <Button
          variant="contained"
          endIcon={<AddCircleIcon />}
          onClick={() => navigate("/admin/Categories/add-category")}
        >
          Add
        </Button>
      </Stack>

      {message && (
        <Typography color="error" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}

      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Image</TableCell>
              <TableCell align="center">Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={row.categoryId}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      {row.imageUrl ? (
                        <img
                          src={getImageSrc(row.imageUrl)}
                          alt={row.name}
                          width={80}
                          height={50}
                          style={{
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
                    <TableCell align="center">
                      <Box
                        sx={{
                          backgroundColor: row.isActive ? "green" : "red",
                          color: "#fff",
                          borderRadius: 1,
                          px: 1.5,
                          height: 30,
                          fontSize: 12,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          userSelect: "none",
                          minWidth: 100,
                          mx: "auto",
                        }}
                      >
                        {row.isActive ? "Active" : "Not Active"}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <EditIcon
                          sx={{ cursor: "pointer", color: "#0d6efd" }}
                          onClick={() =>
                            navigate(
                              `/admin/Categories/edit-category/${row.categoryId}`
                            )
                          }
                        />
                        <DeleteIcon
                          sx={{ cursor: "pointer", color: "#d32f2f" }}
                          onClick={() => deleteCategory(row.categoryId)}
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
