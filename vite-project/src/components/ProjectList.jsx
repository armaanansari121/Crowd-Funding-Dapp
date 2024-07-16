import React from "react";
import { useProjectManager } from "../context/ProjectManager";
import { List, ListItem, ListItemText, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const ProjectList = () => {
  const { projects } = useProjectManager();

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#4c4c4c",
        color: "white",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography textAlign={"center"} variant="h4" sx={{ marginBottom: 4 }}>
        Projects
      </Typography>
      <List>
        {projects.map((project, index) => (
          <ListItem
            key={index}
            button
            component={Link}
            to={`/project/${project}`}
          >
            <ListItemText primary={project} sx={{ textAlign: "center" }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ProjectList;
