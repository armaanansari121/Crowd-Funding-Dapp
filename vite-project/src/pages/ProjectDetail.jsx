import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWeb3 } from "../context/Web3";
import { Box, Typography, Button } from "@mui/material";
import { useProjectManager } from "../context/ProjectManager";
import Loader from "../components/Loader";
import Header from "../components/Header";
import InputField from "../components/InputField";
import AccountSelector from "../components/AccountSelector";
import SnackbarAlert from "../components/SnackbarAlert";

const ProjectDetail = () => {
  const { address } = useParams();
  const { web3, selectedAccount } = useWeb3();
  const {
    loadProject,
    projectInstances,
    projectStates,
    projectManagerStates,
    dispatch,
    projectManagerContract,
  } = useProjectManager();

  const project = projectInstances[address] || {};
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
      if (web3 && Object.keys(project).length === 0) {
        await loadProject(address);
      } else if (Object.keys(project).length !== 0) {
        dispatch({ type: "project/loaded", payload: { address, project } });
      }
    };
    fetchProject();
  }, [web3, address, projectManagerContract]);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (web3 && contract) {
      try {
        dispatch({ type: "project/loading" });
        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = await contract.methods
          .donateToProject(donationMessage)
          .estimateGas({
            from: selectedAccount,
            value: web3.utils.toWei(donationAmount, "ether"),
          });
        const transaction = await contract.methods
          .donateToProject(donationMessage)
          .send({
            from: selectedAccount,
            value: web3.utils.toWei(donationAmount, "ether"),
            gas: gasEstimate,
            gasPrice,
          });
        console.log("Donation Transaction: ", transaction);
        const donationAmountString = web3.utils.toWei(donationAmount, "ether");
        const donationAmountBigInt = BigInt(donationAmountString);
        dispatch({
          type: "project/donation/success",
          payload: {
            successMessage: "Donation Successful.",
            raised: donationAmountBigInt + (raised ? raised : 0n),
            address,
          },
        });
      } catch (error) {
        console.error(error);
        dispatch({ type: "project/error", payload: error.message });
      }
    }
  };
  // console.log(refundAmount);
  const handleRefund = async (e) => {
    e.preventDefault();
    if (web3 && contract) {
      try {
        dispatch({ type: "project/loading" });
        const refundAmountString = web3.utils.toWei(refundAmount, "ether");
        const refundAmountBigInt = BigInt(refundAmountString);
        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = await contract.methods
          .refund(refundAmountBigInt)
          .estimateGas({
            from: selectedAccount,
          });
        const transaction = await contract.methods
          .refund(refundAmountBigInt)
          .send({
            from: selectedAccount,
            gas: gasEstimate,
            gasPrice,
          });
        console.log("Refund Transaction: ", transaction);
        dispatch({
          type: "project/refund/success",
          raised: raised - refundAmountBigInt,
          payload: "Refunded Successfully.",
        });
      } catch (error) {
        console.error(error);
        dispatch({ type: "project/error", payload: error.message });
      }
    }
  };
  // console.log(raised);
  const handleMakePayment = async (e) => {
    e.preventDefault();
    if (web3 && contract) {
      try {
        dispatch({ type: "project/loading" });
        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = await contract.methods.makePayment().estimateGas({
          from: selectedAccount,
        });
        await contract.methods.makePayment().send({
          from: selectedAccount,
          gas: gasEstimate,
          gasPrice,
        });
        dispatch({
          type: "project/payment/sucess",
          state: 1n,
          payload: "Payment Made and Project Closed.",
        });
      } catch (error) {
        console.error(error);
        dispatch({ type: "project/error", payload: error.message });
      }
    }
  };

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
            {projectStates.isLoading ? (
              <Loader />
            ) : (
              <>
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
                  {raised ? web3.utils.fromWei(raised, "ether") : 0} ETH
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
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ProjectDetail;
