import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function MultipleSelectChip({
  data = [],
  loading = false,
  value = [],
  onChange,
}) {
  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value: nextValue },
    } = event;
    onChange(typeof nextValue === "string" ? nextValue.split(",") : nextValue);
  };

  const handleDelete = (idToDelete) => {
    onChange(value.filter((id) => id !== idToDelete));
  };

  return (
    <div>
      <FormControl
        sx={{
          minWidth: { xs: "100%", sm: 300 },
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#f8fafc",
            fontSize: "13.5px",
            "& fieldset": { borderColor: "#e2e8f0" },
            "&:hover": {
              backgroundColor: "#ffffff",
              "& fieldset": { borderColor: "#cbd5e1" },
            },
            "&.Mui-focused": {
              backgroundColor: "#ffffff",
              "& fieldset": { borderColor: "#0f172a", borderWidth: "1.5px" },
            },
          },
          "& .MuiInputLabel-root": {
            fontSize: "13px",
            fontWeight: 500,
            color: "#64748b",
            "&.Mui-focused": { color: "#0f172a", fontWeight: 600 },
          },
        }}
        size="small"
        fullWidth
      >
        <InputLabel id="demo-multiple-chip-label">
          {loading ? "Loading Terms..." : "Select Terms"}
        </InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          multiple
          value={value}
          onChange={handleChange}
          input={<OutlinedInput label="Select Terms" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((id) => {
                const term = data.find((item) => item.id === id);
                return (
                  <Chip
                    key={id}
                    label={term ? term.title : id}
                    sx={{
                      backgroundColor: "#ecfdf5",
                      color: "#059669",
                      fontWeight: 600,
                      fontSize: "12px",
                      border: "1px solid #a7f3d0",
                      "& .MuiChip-deleteIcon": {
                        color: "#059669",
                        "&:hover": { color: "#047857" },
                      },
                    }}
                    size="small"
                    onDelete={() => handleDelete(id)}
                    onMouseDown={(event) => event.stopPropagation()}
                  />
                );
              })}
            </Box>
          )}
          disabled={loading || data.length === 0}
          MenuProps={MenuProps}
        >
          {data.map((item) => (
            <MenuItem
              key={item.id}
              value={item.id}
              style={getStyles(item.id, value, theme)}
              sx={{ fontSize: "13.5px" }}
            >
              {item.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
