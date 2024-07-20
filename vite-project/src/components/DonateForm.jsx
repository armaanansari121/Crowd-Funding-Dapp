import { Box, Typography, Button } from "@mui/material";
import InputField from "./InputField";
import AccountSelector from "./AccountSelector";
import { useWeb3 } from "../context/Web3";
import { useProjectManager } from "../context/ProjectManager";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function DonateForm() {
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");
  const { web3, selectedAccount } = useWeb3();
  const { dispatch, projectInstances } = useProjectManager();
  const { address } = useParams();
  const project = projectInstances[address] || {};
  const { projectInstance: contract, raised } = project;

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
          Donate
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
  );
}
