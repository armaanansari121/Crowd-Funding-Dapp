import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useWeb3 } from "../context/Web3";

export default function AccountSelector() {
  const { selectedAccount, accounts, handleAccountChange } = useWeb3();
  return (
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
  );
}
