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

const ProjectDetail = () => {
  const { address } = useParams();
  const { web3 } = useWeb3();
  const [project, setProject] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (web3) {
        const projectABI = [
          /* Add the ABI of the Project contract here */
        ];
        const projectInstance = new web3.eth.Contract(projectABI, address);

        const name = await projectInstance.methods.name().call();
        const description = await projectInstance.methods.description().call();
        const goal = await projectInstance.methods.goal().call();
        const raised = await projectInstance.methods.raised().call();
        const state = await projectInstance.methods.state().call();

        setProject({ address, name, description, goal, raised, state });
        setLoading(false);
      }
    };

    fetchProject();
  }, [web3, address]);

  const handleDonate = async () => {
    if (web3 && project) {
      const accounts = await web3.eth.getAccounts();
      const projectInstance = new web3.eth.Contract(projectABI, address);

      await projectInstance.methods.donateToProject("").send({
        from: accounts[0],
        value: web3.utils.toWei(donationAmount, "ether"),
      });
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4">{project.name}</Typography>
      <Typography>{project.description}</Typography>
      <Typography>
        Goal: {web3.utils.fromWei(project.goal, "ether")} ETH
      </Typography>
      <Typography>
        Raised: {web3.utils.fromWei(project.raised, "ether")} ETH
      </Typography>
      <Typography>State: {project.state}</Typography>
      <TextField
        label="Donation Amount (ETH)"
        value={donationAmount}
        onChange={(e) => setDonationAmount(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleDonate}>
        Donate
      </Button>
    </Box>
  );
};

export default ProjectDetail;
