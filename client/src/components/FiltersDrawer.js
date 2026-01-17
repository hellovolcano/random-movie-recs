import React from "react";
import {
  Drawer,
  Box,
  CircularProgress,
  Typography,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function FiltersDrawer({
  open,
  onClose,
  loading,
  error,
  selectedServices,
  setSelectedServices,
  serviceOptions = [],
}) {
  function toggle(service) {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  }

  const hasOptions = serviceOptions.length > 0;

  return (
    
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 320, p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={onClose} aria-label="Close filters">
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Select one or more services to narrow the results!
        </Typography>

        <Divider sx={{ my: 2 }} />

        {!loading && error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                {error}
            </Typography>
            )}

        {loading ? (
        <Box
            sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mt: 2,
            }}
        >
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
            Loading streaming services…
            </Typography>
        </Box>
        ) : (
        <FormGroup>
            {serviceOptions.map((service) => (
            <FormControlLabel
                key={service}
                control={
                <Checkbox
                    checked={selectedServices.includes(service)}
                    onChange={() => toggle(service)}
                />
                }
                label={service}
            />
            ))}
        </FormGroup>
        )}

        <Divider sx={{ my: 2 }} />

        <Button
          variant="outlined"
          fullWidth
          onClick={() => setSelectedServices([])}
          disabled={selectedServices.length === 0}
        >
          Clear filters
        </Button>
      </Box>
    </Drawer>
  );
}
