import {
  Typography,
  Box,
  TextField,
  FormControl,
  Button,
  FormLabel,
  OutlinedInput,
} from "@mui/material";
import React, { useState } from "react";
import { FormContainer, FormCard } from "../components/FormLayout";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { VisuallyHiddenInput } from "../components/FormLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEvent } from "../hooks/ApiHooks";
import { useNavigate } from "react-router-dom";
import { displayNotification } from "../reducers/notificationReducer";

const AddEventScreen = () => {
  const [titleError, setTitleError] = useState(false);
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [streamingKeyError, setStreamingKeyError] = useState(false);
  const [streamingKeyMessage, setStreamingKeyMessage] = useState("");
  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);
  const [uploadFile, setuploadFile] = useState("");
  const user = useSelector((state) => state.user);
  const { addEvent } = useEvent();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Validate form input
   * @returns boolean
   */
  const validateInputs = () => {
    const title = document.getElementById("title");
    const streamingKey = document.getElementById("streaming_key");
    const startDate = document.getElementById("start_date");
    const endDate = document.getElementById("end_date");

    let isValid = true;

    if (!title.value || title.value.length < 3) {
      setTitleError(true);
      setTitleErrorMessage("Title must be at least 3 characters long.");
      isValid = false;
    }

    if (!streamingKey.value || streamingKey.value.length < 3) {
      setStreamingKeyError(true);
      setStreamingKeyMessage(
        "Streaming key must be at least 3 characters long."
      );
      isValid = false;
    }

    if (!startDate.value) {
      setStartDateError(true);
      isValid = false;
    }

    if (!endDate.value || endDate.value <= startDate.value) {
      setEndDateError(true);
      isValid = false;
    }

    if (!uploadFile) {
      isValid = false;
    }

    return isValid;
  };

  /**
   * Handling form validation and submission
   * @param {*} event
   * @returns
   */
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // form encounter input errors
    if (!validateInputs()) {
      console.log("Form inputs are not validated");
      return;
    }

    // form values passed -> upload form to server
    const inputData = new FormData(event.currentTarget);
    try {
      const addResult = await addEvent(user.token, inputData);
      dispatch(
        displayNotification(
          { message: addResult.msg, severity: "success" },
          1000
        )
      );
      navigate("/");
    } catch (error) {
      console.log(error);
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
            Add Event
          </Typography>
          <Box
            component="form"
            onSubmit={handleFormSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="title">Title</FormLabel>
              <TextField
                error={titleError}
                helperText={titleErrorMessage}
                id="title"
                type="text"
                name="title"
                placeholder="Type your event title"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={titleError ? "error" : "primary"}
                sx={{ ariaLabel: "title" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="start_date">Start date</FormLabel>
              <OutlinedInput
                error={startDateError}
                name="start_date"
                type="datetime-local"
                id="start_date"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={startDateError ? "error" : "primary"}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="end_date">End date</FormLabel>
              <OutlinedInput
                error={endDateError}
                name="end_date"
                type="datetime-local"
                id="end_date"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={endDateError ? "error" : "primary"}
              />
            </FormControl>

            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormLabel htmlFor="event_image">Upload event image</FormLabel>
              <Button
                sx={{
                  width: "10%",
                  textAlign: "center",
                  marginLeft: "10px",
                  backgroundColor: "upcomingBtn",
                }}
                component="label"
                variant="contained"
                tabIndex={-1}
              >
                <CloudUploadIcon />
                <VisuallyHiddenInput
                  type="file"
                  id="event_image"
                  name="event_image"
                  multiple={false}
                  onChange={(event) =>
                    setuploadFile(event.target.files[0].name)
                  }
                />
              </Button>
              {uploadFile && (
                <Typography
                  variant="subtitle2"
                  sx={{ color: "upcomingBtn", marginLeft: "10px" }}
                >
                  {uploadFile}
                </Typography>
              )}
            </FormControl>

            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormLabel htmlFor="streaming_key">Streaming key</FormLabel>
              <TextField
                error={streamingKeyError}
                helperText={streamingKeyMessage}
                id="streaming_key"
                type="text"
                name="streaming_key"
                placeholder="Create a unique streaming key"
                autoFocus
                fullWidth
                required
                variant="outlined"
                color={streamingKeyError ? "error" : "primary"}
                sx={{ ariaLabel: "streaming_key", marginLeft: "10px" }}
              />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ marginTop: "20px" }}
            >
              ADD
            </Button>
          </Box>
        </FormCard>
      </FormContainer>
    </>
  );
};

export default AddEventScreen;
