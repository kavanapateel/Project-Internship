import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Button, TextField, Snackbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Login = ({ onLogin }) => {
  const theme = useTheme();

  const [userID, setUserID] = useState("");
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        userID,
      });
      if (response.data.success) {
        onLogin(userID);
      } else {
        setOpenErrorSnackbar(true);
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setOpenErrorSnackbar(true);
      setErrorMessage("Error logging in. Please try again.");
    }
  };

  const handleSnackbarClose = () => {
    setOpenErrorSnackbar(false);
  };

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        width: "50vw",
        gap: "1rem",
        backgroundColor: theme.palette.background.default, // Use theme colors
      }}
    >
      <TextField
        label="Enter User ID"
        variant="outlined"
        value={userID}
        onChange={(e) => setUserID(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={6000} // Set auto-hide duration for error messages
        onClose={handleSnackbarClose}
        message={errorMessage}
      />
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
