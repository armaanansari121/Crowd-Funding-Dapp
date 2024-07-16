import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWeb3 } from "../context/Web3";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useProjectManager } from "../context/ProjectManager";
import Loader from "./Loader";
import InputField from "./InputField";

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

const ProjectDetail = () => {
  const { address } = useParams();
  const { web3 } = useWeb3();
  const { loadProject, projectInstances, isLoading } = useProjectManager();
  const project = projectInstances[address];
  console.log(web3);

  const [donationAmount, setDonationAmount] = useState("");
  useEffect(() => {
    const fetchProject = async () => {
      if (web3 && isEmpty(project)) {
        loadProject(address);
      }
    };

    fetchProject();
  }, [web3, address]);

  console.log(project);
  // const handleDonate = async () => {
  //   if (web3 && project) {
  //     const accounts = await web3.eth.getAccounts();
  //     const projectInstance = new web3.eth.Contract(projectABI, address);

  //     await projectInstance.methods.donateToProject("").send({
  //       from: accounts[0],
  //       value: web3.utils.toWei(donationAmount, "ether"),
  //     });
  //   }
  // };

  return (
    <Box>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Typography variant="h4">{project.name}</Typography>
          <Typography>{project.description}</Typography>
          <Typography>
            Goal: {web3.utils.fromWei(project.goal, "ether")} ETH
          </Typography>
          <Typography>
            Raised:{" "}
            {project.raised === 0n
              ? 0
              : web3.utils.fromWei(project.raised, "ether")}{" "}
            ETH
          </Typography>
          <Typography>State: {project.state}</Typography>
          <InputField
            name="donation"
            placeholder="Donation Amount (ETH)"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            type="number"
          />
          {/* <Button variant="contained" color="primary" onClick={handleDonate}>
        Donate
        </Button> */}
        </>
      )}
    </Box>
  );
};

export default ProjectDetail;
