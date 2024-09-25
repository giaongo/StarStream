import { useSelector } from "react-redux";
import { Alert, Box, Slide, Snackbar } from "@mui/material";

const Notification = () => {
  const notification = useSelector((state) => state.notification);
  return (
    <Snackbar open={notification.show} TransitionComponent={Slide}>
      <Alert
        severity={
          notification.severity === "success"
            ? "success"
            : notification.severity === "error"
            ? "error"
            : notification.severity === "info"
            ? "info"
            : notification.severity === "warning"
            ? "warning"
            : ""
        }
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
