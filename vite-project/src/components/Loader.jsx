// import { Box } from "@mui/material";
// import Backdrop from "@mui/material/Backdrop";
// import CircularProgress from "@mui/material/CircularProgress";

// export default function Loader() {
//   return (
//     <Box>
//       <Backdrop
//         sx={{
//           color: "#fff",
//           zIndex: (theme) => theme.zIndex.drawer + 1,
//           opacity: 0.5,
//         }}
//         open={true}
//       >
//         <CircularProgress color="inherit" />
//       </Backdrop>
//     </Box>
//   );
// }

// Loader.jsx
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loader({ loadingMessage }) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <CircularProgress color="inherit" />
      <Typography margin={2}>{loadingMessage}</Typography>
    </Box>
  );
}
