import { Box } from "@mui/material";
import CreateProjectForm from "./components/CreateProjectForm";
import ProjectList from "./components/ProjectList";

export default function Home() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "50%",
          height: "100%",
          overflowY: "auto",
        }}
      >
        <CreateProjectForm />
      </Box>
      <Box
        sx={{
          width: "50%",
          height: "100%",
          overflowY: "auto",
        }}
      >
        <ProjectList />
      </Box>
    </Box>
  );
}
