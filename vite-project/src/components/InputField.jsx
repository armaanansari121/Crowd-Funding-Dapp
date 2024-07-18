import { TextField } from "@mui/material";

export default function InputField({
  name,
  placeholder,
  value,
  onChange,
  type = "text",
}) {
  return (
    <TextField
      label={placeholder}
      name={name}
      value={value || ""}
      onChange={(e) => onChange(e)}
      type={type}
      required
      fullWidth
      InputLabelProps={{ style: { color: "white" } }}
      InputProps={{
        style: { color: "white" },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "white",
          },
          "&:hover fieldset": {
            borderColor: "white",
          },
          "&.Mui-focused fieldset": {
            borderColor: "white",
          },
        },
      }}
    />
  );
}
