import React, { useState } from "react";
import { useProjectManager } from "../context/ProjectManager";
import { Box, Button, Typography } from "@mui/material";
import InputField from "./InputField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DateField from "./DateField";
import AccountSelector from "./AccountSelector";
import SnackbarAlert from "./SnackbarAlert";

const CreateProjectForm = () => {
  const { projectManagerStates, handleSubmit, dispatch } = useProjectManager();
  const { errorMessage, successMessage } = projectManagerStates;
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
      const now = Math.floor(new Date().getTime() / 1000);
      const fundingDeadlineUnix = Math.floor(
        new Date(form.fundingDeadline).getTime() / 1000
      );
      const refundDeadlineUnix = Math.floor(
        new Date(form.refundDeadline).getTime() / 1000
      );
      if (fundingDeadlineUnix - now < 432000) {
        throw new Error("Funding Duration must be atleast 5 days.");
      }
      if (refundDeadlineUnix - fundingDeadlineUnix < 86400) {
        throw new Error("Refund Duration must be atleast 1 day.");
      }
      const formData = {
        ...form,
        fundingDeadlineUnix,
        refundDeadlineUnix,
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

        <AccountSelector />
        {errorMessage && (
          <SnackbarAlert
            severity={"error"}
            message={errorMessage}
            resetMessage={() =>
              dispatch({ type: "projectManager/resetMessages" })
            }
          />
        )}
        {successMessage && (
          <SnackbarAlert
            severity={"success"}
            message={successMessage}
            resetMessage={() =>
              dispatch({ type: "projectManager/resetMessages" })
            }
          />
        )}
        <Button type="submit" variant="contained" color="primary">
          Create Project
        </Button>
      </Box>
    </Box>
  );
};

export default CreateProjectForm;
