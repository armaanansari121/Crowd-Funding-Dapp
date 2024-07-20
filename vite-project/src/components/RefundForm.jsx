import { Box, Typography, Button } from "@mui/material";
import InputField from "./InputField";
import AccountSelector from "./AccountSelector";
import { useWeb3 } from "../context/Web3";
import { useState } from "react";
import { useProjectManager } from "../context/ProjectManager";
import { useParams } from "react-router-dom";

export default function RefundForm() {
  const [refundAmount, setRefundAmount] = useState("");
  const { web3, selectedAccount } = useWeb3();
  const { dispatch, projectInstances } = useProjectManager();
  const { address } = useParams();
  const project = projectInstances[address] || {};
  const { projectInstance: contract, raised } = project;
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

  return (
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
          Request
        </Button>
      </Box>
    </Box>
  );
}
