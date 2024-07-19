import { Box } from "@mui/material";
import CreateProjectForm from "../components/CreateProjectForm";
import ProjectList from "../components/ProjectList";
import Header from "../components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <Box
        sx={{
          width: "100vw",
          height: "calc(100vh - 116px)",
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
    </>
  );
}
