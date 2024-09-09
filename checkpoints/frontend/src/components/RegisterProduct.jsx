/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import styled from '@emotion/styled';
import axios from "axios";

const Body = styled.div`
  margin: 0;
  padding: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
`;

const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
`;

const ContainerStyled = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  padding-top: 20px; /* Adjust this value to control the gap */
`;

const CardStyled = styled.div`
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
`;

const ButtonStyled = styled(Button)`
  background-color: #fda085;
  color: #fff;
  &:hover {
    background-color: #f6d365;
  }
`;

const TypographyStyled = styled(Typography)`
  color: #333;
`;

const TextFieldStyled = styled(TextField)`
  background-color: #fff;
  border-radius: 4px;
`;

const RegisterProduct = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products?page=${currentPage}&perPage=${perPage}`
        );
        setProducts(response.data.products);
        setTotalPages(Math.ceil(response.data.total / perPage));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [currentPage, perPage]);

  const [formData, setFormData] = useState({
    productID: "",
    productName: "",
    zone1_ideal: "",
    zone2_ideal: "",
    zone3_ideal: "",
    zone4_ideal: "",
    zone5_ideal: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/registerProduct",
        {
          formData,
        }
      );
      if (response.data.success) {
        window.location.href = "/register-product";
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleNextPage = async () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = async () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Body>
      <Root>
        <ContainerStyled>
          <CardStyled>
            <TypographyStyled
              variant="h4"
              align="center"
              sx={{ fontWeight: 600 }}
              style={{  textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'}}
              gutterBottom
            >
              Register New Product
            </TypographyStyled>
            <form onSubmit={handleSubmit} autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextFieldStyled
                    label="Product ID"
                    variant="outlined"
                    fullWidth
                    name="productID"
                    value={formData.productID}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextFieldStyled
                    label="Product Name"
                    variant="outlined"
                    fullWidth
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Zone Ideal Times
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextFieldStyled
                    label="Zone 1"
                    variant="outlined"
                    fullWidth
                    name="zone1_ideal"
                    value={formData.zone1_ideal}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextFieldStyled
                    label="Zone 2"
                    variant="outlined"
                    fullWidth
                    name="zone2_ideal"
                    value={formData.zone2_ideal}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextFieldStyled
                    label="Zone 3"
                    variant="outlined"
                    fullWidth
                    name="zone3_ideal"
                    value={formData.zone3_ideal}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextFieldStyled
                    label="Zone 4"
                    variant="outlined"
                    fullWidth
                    name="zone4_ideal"
                    value={formData.zone4_ideal}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextFieldStyled
                    label="Zone 5"
                    variant="outlined"
                    fullWidth
                    name="zone5_ideal"
                    value={formData.zone5_ideal}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <ButtonStyled variant="contained" type="submit">
                    Register Product
                  </ButtonStyled>
                </Grid>
              </Grid>
            </form>
          </CardStyled>
        </ContainerStyled>

        <ContainerStyled>
          {products.length > 0 && (
            <>
              <CardStyled>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product ID</TableCell>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Zone 1</TableCell>
                      <TableCell>Zone 2</TableCell>
                      <TableCell>Zone 3</TableCell>
                      <TableCell>Zone 4</TableCell>
                      <TableCell>Zone 5</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.productID}</TableCell>
                        <TableCell>{product.productName}</TableCell>
                        <TableCell>{product.zone1_ideal}</TableCell>
                        <TableCell>{product.zone2_ideal}</TableCell>
                        <TableCell>{product.zone3_ideal}</TableCell>
                        <TableCell>{product.zone4_ideal}</TableCell>
                        <TableCell>{product.zone5_ideal}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardStyled>

              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  mt: 2,
                  background: "#121212CC",
                  color: "#F2F2F2",
                  borderRadius: "3rem",
                  padding: "10px",
                }}
              >
                <IconButton
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  aria-label="Previous Page"
                >
                  <NavigateBeforeIcon htmlColor="#F1F1F1" />
                </IconButton>
                <Typography variant="button">
                  {currentPage} of {totalPages}
                </Typography>
                <IconButton
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  aria-label="Next Page"
                >
                  <NavigateNextIcon htmlColor="#F1F1F1" />
                </IconButton>
              </Grid>
            </>
          )}
        </ContainerStyled>
      </Root>
    </Body>
  );
};

export default RegisterProduct;
