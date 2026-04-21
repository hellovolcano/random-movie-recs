import { useState } from "react";
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
  Collapse,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const majorServiceNames = ["Amazon", "AppleTV", "Netflix", "Disney+", "Hulu", "Peacock", "Paramount+"];

export default function FiltersDrawer({
  open,
  onClose,
  loading,
  error,
  selectedServices,
  setSelectedServices,
  serviceOptions = [],
}) {
  const [showMore, setShowMore] = useState(false);

  function toggle(service) {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  }

  const majorServices = serviceOptions.filter((s) => majorServiceNames.includes(s));
  const minorServices = serviceOptions.filter((s) => !majorServiceNames.includes(s));

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
        <>
          <FormGroup>
            {majorServices.map((service) => (
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

          {minorServices.length > 0 && (
            <>
              <Box
                onClick={() => setShowMore((v) => !v)}
                sx={{ display: "flex", alignItems: "center", cursor: "pointer", mt: 1, color: "text.secondary" }}
              >
                {showMore ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {showMore ? "Fewer streaming options" : "More streaming options"}
                </Typography>
              </Box>
              <Collapse in={showMore}>
                <FormGroup>
                  {minorServices.map((service) => (
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
              </Collapse>
            </>
          )}
        </>
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
