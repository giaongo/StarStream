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

const AddEventScreen = () => {
  const [titleError, setTitleError] = React.useState(false);
  const [titleErrorMessage, setTitleErrorMessage] = React.useState("");
  const [streamingKeyError, setStremingKeyError] = React.useState(false);
  const [streamingKeyMessage, setStreamingKeyMessage] = React.useState("");
  const [uploadFile, setuploadFile] = useState("");

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
            onSubmit={() => console.log("handled submit")}
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
                name="xxx"
                placeholder="Selectxxx"
                type="datetime-local"
                id="start_date"
                autoFocus
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="end_date">End date</FormLabel>
              <OutlinedInput
                name="end_date"
                type="datetime-local"
                id="end_date"
                autoFocus
                required
                fullWidth
                variant="outlined"
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
