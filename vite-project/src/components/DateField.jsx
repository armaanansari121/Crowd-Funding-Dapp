import { DatePicker } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";

export default function DateField({ label, name, value, onDateChange }) {
  return (
    <DatePicker
      label={label}
      value={value}
      onChange={(date) => onDateChange(name, date)}
      renderInput={(params) => (
        <TextField
          {...params}
          required
          InputProps={{
            ...params.InputProps,
          }}
        />
      )}
    />
  );
}
