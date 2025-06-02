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
import SearchIcon from "@mui/icons-material/Search";
import { saveAs } from "file-saver";
import Papa from "papaparse";

export default function Users() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    handleSearchAndSort();
  }, [searchTerm, rows, sortKey]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5110/api/Admin/allUsers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setRows(data);
      setFilteredRows(data);
    } catch (error) {
      setMessage(error.message || "Error fetching users");
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
        if (sortKey === "name") return a.name.localeCompare(b.name);
        if (sortKey === "email") return a.email.localeCompare(b.email);
        if (sortKey === "isVerified") return b.isVerified - a.isVerified;
        if (sortKey === "role") return a.roleName.localeCompare(b.roleName);
        return 0;
      });
    }

    setFilteredRows(temp);
    setPage(0);
  };

  const exportToCSV = () => {
    const dataToExport = filteredRows.map((user) => ({
      ID: user.userId,
      Name: user.name,
      Username: user.username,
      Email: user.email,
      Mobile: user.mobile,
      Verified: user.isVerified ? "Yes" : "No",
      Role: user.roleName,
      CreatedDate: user.createdDate,
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "users.csv");
  };

  return (
    <Paper sx={{ width: "98%", overflow: "hidden", padding: "16px" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Users List
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
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="isVerified">Verified</MenuItem>
          <MenuItem value="role">Role</MenuItem>
        </TextField>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" onClick={exportToCSV}>
          Export
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
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Verified</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => (
                  <TableRow key={user.userId}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.mobile}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: user.isVerified ? "green" : "red",
                          color: "#fff",
                          borderRadius: 1,
                          px: 1.5,
                          height: 30,
                          fontSize: 12,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          userSelect: "none",
                          minWidth: 80,
                        }}
                      >
                        {user.isVerified ? "Verified" : "Not Verified"}
                      </Box>
                    </TableCell>
                    <TableCell>{user.roleName}</TableCell>
                    <TableCell>
                      {new Date(user.createdDate).toLocaleDateString()}
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
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            {
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
