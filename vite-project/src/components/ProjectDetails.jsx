import { Box, Typography, Button } from "@mui/material";
import Loader from "./Loader";
import { useWeb3 } from "../context/Web3";
import { useProjectManager } from "../context/ProjectManager";
import { useParams } from "react-router-dom";

export default function ProjectDetails() {
  const { web3 } = useWeb3();
  const { dispatch, projectInstances, projectStates } = useProjectManager();
  const { address } = useParams();
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
          <Typography sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
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
  );
}
