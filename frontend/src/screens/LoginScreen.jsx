import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useAuthentication } from "../hooks/ApiHooks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { displayNotification } from "../reducers/notificationReducer";
import { checkAndSetAdminUser } from "../reducers/userReducer";
import { FormContainer, FormCard } from "../styles/CustomMaterialStyles";

const LoginScreen = () => {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const { loginAdmin } = useAuthentication();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Validate form inputs
   * @returns
   */
  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  /**
   * Handle form submission
   * @param {*} event
   * @returns
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }
    const data = new FormData(event.currentTarget);

    try {
      const loginResult = await loginAdmin(data);
      localStorage.setItem("starStreamToken", loginResult.token);
      dispatch(
        displayNotification(
          { message: "Login Successfully", severity: "success" },
          3000
        )
      );
      dispatch(checkAndSetAdminUser(loginResult.token));
      navigate("/");
    } catch (error) {
      console.error(error);
      dispatch(
        displayNotification({ message: error.message, severity: "error" }, 3000)
      );
    }
  };

  return (
    <>
      <FormContainer direction="column" justifyContent="space-between">
        <FormCard variant="outlined">
          <Typography
            variant="h3"
            sx={{
              width: "100%",
              color: "black",
              textAlign: "center",
              margin: 0,
            }}
          >
            Admin Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? "error" : "primary"}
                sx={{ ariaLabel: "email" }}
              />
            </FormControl>
            <FormControl>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <FormLabel htmlFor="password">Password</FormLabel>
              </Box>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained">
              Log in
            </Button>
          </Box>
        </FormCard>
      </FormContainer>
    </>
  );
};

export default LoginScreen;
