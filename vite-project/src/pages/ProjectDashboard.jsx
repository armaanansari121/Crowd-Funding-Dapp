import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWeb3 } from "../context/Web3";
import { Box } from "@mui/material";
import { useProjectManager } from "../context/ProjectManager";
import Loader from "../components/Loader";
import Header from "../components/Header";
import SnackbarAlert from "../components/SnackbarAlert";
import DonateForm from "../components/DonateForm";
import RefundForm from "../components/RefundForm";
import ProjectDetails from "../components/ProjectDetails";

const ProjectDashboard = () => {
  const { address } = useParams();
  const { web3 } = useWeb3();
  const {
    loadProject,
    projectInstances,
    projectStates,
    projectManagerStates,
    dispatch,
    projectManagerContract,
  } = useProjectManager();

  const project = projectInstances[address] || {};
  const { name } = project;

  useEffect(() => {
    const fetchProject = async () => {
      if (web3 && Object.keys(project).length === 0) {
        await loadProject(address);
      } else if (Object.keys(project).length !== 0) {
        dispatch({ type: "project/loaded", payload: { address, project } });
      }
    };
    fetchProject();
  }, [web3, address, projectManagerContract]);

  if (projectManagerStates.isLoading) {
    return <Loader />;
  }

  return (
    <>
      {projectStates.errorMessage && (
        <SnackbarAlert
          message={projectStates.errorMessage}
          severity="error"
          resetMessage={() => dispatch({ type: "project/resetMessages" })}
        />
      )}
      {projectStates.successMessage && (
        <SnackbarAlert
          message={projectStates.successMessage}
          severity="success"
          resetMessage={() => dispatch({ type: "project/resetMessages" })}
        />
      )}
      <Header>{name}</Header>
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
          <DonateForm />
          <RefundForm />
        </Box>
        <Box
          sx={{
            width: "50%",
            height: "100%",
            overflowY: "auto",
          }}
        >
          <ProjectDetails />
        </Box>
      </Box>
    </>
  );
};

export default ProjectDashboard;
