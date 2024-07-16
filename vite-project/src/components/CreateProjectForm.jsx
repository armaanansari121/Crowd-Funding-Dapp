import React, { useEffect, useState } from "react";
import { useWeb3 } from "../context/Web3";
import { useProjectManager } from "../context/ProjectManager";
import Loader from "./Loader";
import {
  Box,
  Select,
  MenuItem,
  Button,
  Typography,
  InputLabel,
  FormControl,
  Alert,
} from "@mui/material";
import InputField from "./InputField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { differenceInSeconds } from "date-fns";
import DateField from "./DateField";

const CreateProjectForm = () => {
  const { accounts, selectedAccount, handleAccountChange } = useWeb3();
  const { isLoading, errorMessage, handleSubmit, dispatch, successMessage } =
    useProjectManager();
  const [form, setForm] = useState({
    receiverAddress: "",
    name: "",
    description: "",
    goal: "",
    fundingDeadline: null,
    refundDeadline: null,
  });
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (name, date) => {
    setForm({
      ...form,
      [name]: date || "",
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const now = new Date();
      const fundingDuration = differenceInSeconds(
        new Date(form.fundingDeadline),
        now
      );
      if (fundingDuration < 432000) {
        throw new Error("Funding Duration must be atleast 5 days.");
      }
      const refundDuration = differenceInSeconds(
        new Date(form.refundDeadline),
        new Date(form.fundingDeadline)
      );
      if (refundDuration < 86400) {
        throw new Error("Refund Duration must be atleast 1 day.");
      }
      const formData = {
        ...form,
        fundingDuration,
        refundDuration,
      };

      await handleSubmit(formData);
    } catch (err) {
      console.error(err);
      dispatch({ type: "projectCreation/failed", payload: err.message });
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#121212",
        color: "white",
        // Hheight: "100%",
        display: "flex",
        flexDirection: "column",
        // width: "50%",
      }}
    >
      {/* {isLoading && <Loader />} */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          textAlign={"center"}
          sx={{ color: "white" }}
        >
          Create a Project
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleFormSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 450,
          margin: "0 auto",
        }}
      >
        <InputField
          name="receiverAddress"
          placeholder="Receiver's Address"
          value={form.receiverAddress}
          onChange={handleChange}
        />
        <InputField
          name="name"
          placeholder="Project Name"
          value={form.name}
          onChange={handleChange}
        />
        <InputField
          name="description"
          placeholder="Describe The Project"
          value={form.description}
          onChange={handleChange}
        />
        <InputField
          name="goal"
          placeholder="Goal (ETH)"
          value={form.goal}
          onChange={handleChange}
          type="number"
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateField
            label="Funding Deadline"
            name="fundingDeadline"
            value={form.fundingDeadline}
            onDateChange={handleDateChange}
          />

          <DateField
            label="Refund Deadline"
            name="refundDeadline"
            value={form.refundDeadline}
            onDateChange={handleDateChange}
          />
        </LocalizationProvider>

        <FormControl variant="outlined">
          <InputLabel
            shrink={true}
            sx={{
              color: "white",
              backgroundColor: "#121212",
              paddingRight: "4px",
            }}
          >
            Select Account
          </InputLabel>
          <Select
            value={selectedAccount || ""}
            onChange={(e) => handleAccountChange(e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            sx={{
              color: "white",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "& .MuiSelect-select": {
                color: "white",
              },
              "& .MuiSelect-icon": {
                color: "white",
              },
            }}
          >
            {accounts.map((account) => (
              <MenuItem key={account} value={account}>
                {account}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {errorMessage && (
          <Alert severity="error" variant="filled">
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" variant="filled">
            {successMessage}
          </Alert>
        )}
        <Button type="submit" variant="contained" color="primary">
          Create Project
        </Button>
      </Box>
    </Box>
  );
};

export default CreateProjectForm;
