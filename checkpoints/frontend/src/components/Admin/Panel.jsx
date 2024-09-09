import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

// const millisecondsToHoursMinutes = (milliseconds) => {
//   const hours = Math.floor(milliseconds / 3600000); // 1 hour = 3600000 milliseconds
//   const minutes = Math.floor((milliseconds % 3600000) / 60000); // 1 minute = 60000 milliseconds
//   const hoursMinutes = hours + minutes / 60; // Convert minutes to fraction of an hour

//   return parseFloat(hoursMinutes.toFixed(2)); // Return as a floating-point number with 2 decimal places
// };

const millisecondsToHoursMinutes = (milliseconds) => {
  const minutes = Math.floor((milliseconds % 3600000) / 60000) // 1 minute = 60000 milliseconds

  return parseFloat(minutes.toFixed(2)) // Return as a floating-point number with 2 decimal places
};

export default function Panel() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/register/products?page=${
            currentPage + 1
          }&perPage=${rowsPerPage}`
        );
        setProducts(response.data.products);
        setTotalProducts(response.data.total);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [currentPage, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  return (
    <Container sx={{ mt: 4, filter: "drop-shadow(2px 2px 2px #111)" }}>
      {products.length > 0 && (
        <>
          <Typography
            variant="h4"
            sx={{
              marginBottom: 0,
              padding: "1rem 2rem",
              borderRadius: "1rem 1rem 0 0",
              backgroundColor: "#121212CC",
              color: "#F1F1F1",
              maxWidth: "fit-content",
            }}
          >
            Registered Products
          </Typography>
          <Table
            sx={{ backgroundColor: "#F1F1F1", borderRadius: "0 1rem 0 0" }}
          >
            <TableHead>
              <TableRow sx={{ borderRadius: "0 1rem 0 0" }}>
                <TableCell
                  rowSpan={2}
                  sx={{ fontWeight: 700, verticalAlign: "bottom" }}
                >
                  Product ID
                </TableCell>
                <TableCell
                  rowSpan={2}
                  sx={{ fontWeight: 700, verticalAlign: "bottom" }}
                >
                  Product Name
                </TableCell>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Ideal Times
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Zone 1</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Zone 2</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Zone 3</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Zone 4</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Zone 5</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.productID}</TableCell>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>
                    {millisecondsToHoursMinutes(product.zone1_ideal)}hrs
                  </TableCell>
                  <TableCell>
                    {millisecondsToHoursMinutes(product.zone2_ideal)}hrs
                  </TableCell>
                  <TableCell>
                    {millisecondsToHoursMinutes(product.zone3_ideal)}hrs
                  </TableCell>
                  <TableCell>
                    {millisecondsToHoursMinutes(product.zone4_ideal)}hrs
                  </TableCell>
                  <TableCell>
                    {millisecondsToHoursMinutes(product.zone5_ideal)}hrs
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={totalProducts}
            page={currentPage}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              background: "#121212CC",
              borderRadius: "0 0 1rem 1rem",
              color: "#F1F1F1",
              "& .MuiTablePagination-actions": {
                color: "#F1F1F1",
                cursor: "pointer",
                "*": { color: "#F1F1F1" },
              },
              "& .MuiTablePagination-selectLabel": { color: "#F1F1F1" },
              "& .MuiTablePagination-displayedRows": { color: "#F1F1F1" },
              "& .MuiInputBase-root": { color: "#F1F1F1" },
              "& .MuiSelect-icon": { color: "#F1F1F1" },
            }}
          />
        </>
      )}
    </Container>
  );
}
