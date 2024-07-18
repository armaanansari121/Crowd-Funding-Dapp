import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWeb3 } from "../context/Web3";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useProjectManager } from "../context/ProjectManager";
import Loader from "./Loader";
import Header from "./Header";
import InputField from "./InputField";
import AccountSelector from "./AccountSelector";

const ProjectDetail = () => {
  const { address } = useParams();
  const { web3, accounts, selectedAccount, handleAccountChange } = useWeb3();
  const { loadProject, projectInstances, isLoading, dispatch, projects } =
    useProjectManager();
  const project = projectInstances[address] || {};
  console.log(projects);
  const {
    projectInstance: contract,
    creator,
    name,
    receiver,
    description,
    goal,
    raised,
    fundingDeadline,
    refundDeadline,
    state,
  } = project;
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");
  const [refundAmount, setRefundAmount] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      dispatch({ type: "loading" });
      if (web3 && Object.keys(project).length === 0) {
        await loadProject(address);
        // console.log(project);
      } else if (Object.keys(project).length !== 0) {
        dispatch({ type: "project/loaded", payload: { address, project } });
        // console.log(project);
      }
    };
    fetchProject();
  }, [web3, address]);
  // console.log(project);
  console.log(contract.methods.donateToProject("hello"));
  const handleDonate = async (e) => {
    e.preventDefault();
    if (web3 && contract) {
      const gasPrice = await web3.eth.getGasPrice();
      const gasEstimate = await contract.methods
        .donateToProject(donationMessage)
        .estimateGas({
          from: selectedAccount,
          value: web3.utils.toWei(donationAmount, "gwei"),
        });
      await contract.methods.donateToProject(donationMessage).send({
        from: selectedAccount,
        value: web3.utils.toWei(donationAmount, "gwei"),
        gas: gasEstimate,
        gasPrice,
      });
    }
  };

  const handleRefund = async (e) => {
    e.preventDefault();
    if (web3 && contract) {
      await contract.methods.refund(refundAmount).send({
        from: selectedAccount,
      });
    }
  };

  const handleMakePayment = async (e) => {
    e.preventDefault();
    if (web3 && contract) {
      await contract.methods.makePayment().send({
        from: selectedAccount,
      });
    }
  };

  // console.log(fundingDeadline);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Header>{name}</Header>
      <Box
        sx={{
          width: "100vw",
          height: "calc(100vh - 116px)",
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Left Half - Forms */}
        <Box
          sx={{
            width: "50%",
            height: "100%",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              padding: 4,
              backgroundColor: "#121212",
              color: "white",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ marginBottom: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                textAlign={"center"}
                sx={{ color: "white" }}
              >
                Donate to {name}
              </Typography>
            </Box>
            <Box
              component="form"
              onSubmit={(e) => handleDonate(e)}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: 450,
                margin: "0 auto",
              }}
            >
              <InputField
                name="donationAmount"
                placeholder="Donation Amount"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                type="number"
              />
              <InputField
                name="donationMessage"
                placeholder="Message"
                value={donationMessage}
                onChange={(e) => setDonationMessage(e.target.value)}
              />
              <AccountSelector />
              <Button type="submit" variant="contained" color="primary">
                Donate
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              padding: 4,
              backgroundColor: "#121212",
              color: "white",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ marginBottom: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                textAlign={"center"}
                sx={{ color: "white" }}
              >
                Request a Refund
              </Typography>
            </Box>
            <Box
              component="form"
              onSubmit={(e) => handleRefund(e)}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: 450,
                margin: "0 auto",
              }}
            >
              <InputField
                name="refundAmount"
                placeholder="Refund Amount (ETH)"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
              />
              <AccountSelector />
              <Button type="submit" variant="contained" color="primary">
                Donate
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Right Half - Project Details */}
        <Box
          sx={{
            width: "50%",
            height: "100%",
            overflowY: "auto",
          }}
        >
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
              justifyContent: "space-evenly",
            }}
          >
            <Typography
              textAlign={"center"}
              variant="h4"
              sx={{ marginBottom: 2 }}
            >
              Project Details
            </Typography>
            <Typography>
              <strong>Name:</strong> {name}
            </Typography>
            <Typography
              sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
            >
              <strong>Description:</strong> {description}
            </Typography>
            <Typography>
              <strong>Created By:</strong> {creator}
            </Typography>
            <Typography>
              <strong>Fund Towards:</strong> {receiver}
            </Typography>
            <Typography>
              <strong>Goal:</strong>{" "}
              {goal ? web3.utils.fromWei(goal, "ether") : " "} ETH
            </Typography>
            <Typography>
              <strong>Currently Raised:</strong>{" "}
              {raised
                ? raised == 0
                  ? 0
                  : web3.utils.fromWei(raised, "ether")
                : " "}{" "}
              ETH
            </Typography>
            <Typography>
              <strong>Funding Deadline:</strong>{" "}
              {new Date(Number(fundingDeadline * 1000n)).toLocaleString()}
            </Typography>
            <Typography>
              <strong>Refund Deadline:</strong>{" "}
              {new Date(Number(refundDeadline * 1000n)).toLocaleString()}
            </Typography>
            <Typography>
              <strong>State:</strong>{" "}
              {state.toString() == "0" ? "Ongoing" : "Closed"}
            </Typography>

            <Button
              variant="contained"
              onClick={(e) => handleMakePayment(e)}
              fullWidth
            >
              Make Payment And Close Project
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ProjectDetail;
