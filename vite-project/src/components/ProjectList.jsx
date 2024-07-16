import React from "react";
import { useProjectManager } from "../context/ProjectManager";
import { List, ListItem, ListItemText, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const ProjectList = () => {
  const { projects, isLoading, dispatch } = useProjectManager();

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#4c4c4c",
        color: "white",
        height: "calc(100% - 116px)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        position: "absolute",
        width: "50%",
      }}
    >
      {isLoading && <Loader />}
      <Typography textAlign={"center"} variant="h4" sx={{ marginBottom: 2 }}>
        Projects
      </Typography>
      <List>
        {projects.map((project, index) => (
          <ListItem
            key={index}
            button
            component={Link}
            to={`/project/${project}`}
            onClick={() => dispatch({ type: "loading" })}
          >
            <ListItemText primary={project} sx={{ textAlign: "center" }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ProjectList;
