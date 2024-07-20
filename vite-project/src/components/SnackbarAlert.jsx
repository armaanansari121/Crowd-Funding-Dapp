import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function SnackbarAlert({ severity, message, resetMessage }) {
  return (
    <div>
      <Snackbar
        open={true}
        autoHideDuration={severity === "success" ? 6000 : null}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={() => {
          resetMessage();
        }}
      >
        <Alert
          onClose={() => {
            resetMessage();
          }}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
