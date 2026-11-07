import * as React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function BasicDatePicker() {
  const [value, setValue] = React.useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label="Date Of Birth"
        value={value}
        onChange={(newValue) => setValue(newValue)}
        slotProps={{
          textField: {
            fullWidth: true,
            size: "small",
            sx: {
              "& .MuiInputBase-input": { color: "black" }, // text color
              "& .MuiInputLabel-root": { color: "black" }, // label color
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "black", // default border
              },
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "black", // hover border
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "black", // focus border
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "black", // label focus color
              },
            },
          },
        }}
        sx={{ width: "100%" }}
      />
    </LocalizationProvider>
  );
}
