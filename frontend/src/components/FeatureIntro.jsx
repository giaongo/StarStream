import React from "react";
import { Typography, Box, Button, TableBody } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const FeatureIntro = ({ type, photo, heading, title, body }) => {
  const navigate = useNavigate();
  return (
    <>
      <Typography variant="h1" textAlign="center" sx={{ pt: 10 }}>
        {heading}
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: "40%",
          mt: 10,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          sx={{
            flexBasis: "50%",
            order: type === "archive" ? 2 : 1,
            flexGrow: 1,
          }}
        >
          <img
            src={photo}
            style={{
              width: "100%",
              height: "500px",
              objectFit: "cover",
            }}
          />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            order: type === "archive" ? 1 : 2,
          }}
        >
          <Typography variant="h2" textAlign="center">
            {title}
          </Typography>

          <Typography variant="subtitle1" textAlign="center">
            {body}
          </Typography>

          {type === "archive" && (
            <Button
              sx={{ backgroundColor: "white", mt: 5, fontWeight: "bold" }}
              onClick={() => navigate("/archive")}
            >
              Discover More
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};

FeatureIntro.propTypes = {
  type: PropTypes.string,
  photo: PropTypes.string,
  heading: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.string,
};

export default FeatureIntro;
