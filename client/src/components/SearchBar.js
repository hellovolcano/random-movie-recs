import React from "react";
import { Box, TextField, Button } from "@mui/material";

export default function SearchBar({ value, onChange, onSubmit, loading, autoFocus }) {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ display: "flex", gap: 1.5, width: "100%", maxWidth: 720 }}
    >
      <TextField
        fullWidth
        label="Search a movie"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{ whiteSpace: "nowrap" }}
      >
        {loading ? "Searching…" : "Search"}
      </Button>
    </Box>
  );
}
