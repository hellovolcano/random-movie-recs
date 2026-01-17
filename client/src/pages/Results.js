import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AppBar,
  Badge,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Box,
  Button,
  Alert,
  CircularProgress,
  Grid
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { searchMovie, getServiceNamesByRegion } from "../api";
import SearchBar from "../components/SearchBar";
import FiltersDrawer from "../components/FiltersDrawer";
import ResultsSections from "../components/ResultsSections";
import { groupAndDedupeSources } from "../helpers/resultsHelpers";

export default function ResultsPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const initialTitle = params.get("title") ?? "";

  const [title, setTitle] = useState(initialTitle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [movie, setMovie] = useState(null);
  const [sources, setSources] = useState([]);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);

  const REGION = "US";

  // Keep local input in sync when URL changes (back/forward)
  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  // Load service options (US-only) for the filters drawer
  const [serviceOptions, setServiceOptions] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setServicesLoading(true);
      setServicesError(null);
      try {
        const services = await getServiceNamesByRegion(REGION);
        if (!cancelled) setServiceOptions(services);
      } catch (e) {
        if (!cancelled) {
          setServicesError(e?.message ?? "Failed to load services");
          setServiceOptions([]);
        }
      } finally {
        if (!cancelled) setServicesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch when the URL title changes
  useEffect(() => {
    const q = initialTitle.trim();
    if (!q) return;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchMovie(q);
        const wmSources = Array.isArray(data.watchmode?.sources) ? data.watchmode.sources : [];

        setMovie(data.movie ?? null);
        setSources(wmSources);
      } catch (e) {
        setMovie(null);
        setSources([]);
        setError(e?.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, [initialTitle]);

  // If you search a new movie, remove any selected filters that aren’t present in the options
  useEffect(() => {
    setSelectedServices((prev) => prev.filter((s) => serviceOptions.includes(s)));
  }, [serviceOptions]);

  function onSubmit(e) {
    e.preventDefault();
    const q = title.trim();
    if (!q) return;
    setParams({ title: q });
  }

  // 1) Always restrict to US
  // 2) Optionally restrict to selected services
  const filteredSources = useMemo(() => {
    let list = sources ?? [];

    list = list.filter((s) => (s?.region ?? s?.country) === REGION);

    if (selectedServices.length > 0) {
      list = list.filter((s) => selectedServices.includes(s.name));
    }

    return list;
  }, [sources, selectedServices]);

  // 3) Group + dedupe into { subscription, free, rentOrBuy } (whatever your helper returns)
  const groupedSources = useMemo(() => {
    return groupAndDedupeSources(filteredSources);
  }, [filteredSources]);

  const isFiltered = selectedServices.length > 0;
  const activeFilterCount = selectedServices.length;

  return (
    <>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate("/")} aria-label="Back">
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flex: 1 }}>
            
          </Typography>

          <Button
            onClick={() => setFiltersOpen(true)}
            variant="outlined"
            sx={{
                color: "text.secondary",
                borderColor: "text.secondary"
            }}
            startIcon={
              <Badge
                color="primary"
                badgeContent={activeFilterCount}
                invisible={activeFilterCount === 0}
              >
                <FilterListIcon />
              </Badge>
            }
          >
            Filters
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box sx={{ py: 3 }}>
          <SearchBar value={title} onChange={setTitle} onSubmit={onSubmit} loading={loading} />

          {loading && (
            <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                Searching…
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

    {movie && (
    <Box sx={{ mt: 4 }}>
        <Grid container spacing={2} alignItems="flex-start">
            {/* Poster */}
            <Grid item xs={12} sm={4}>
                {movie.Poster && movie.Poster !== "N/A" ? (
                <Box>
                    <img
                    src={movie.Poster}
                    alt={`${movie.Title} poster`}
                    style={{ width: "100%", maxWidth: 240, borderRadius: 12 }}
                    />
                </Box>
                ) : null}
            </Grid>

            {/* Title + summary */}
            <Grid item xs={12} sm={8}>
                <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                    {movie.Title}
                </Typography>

                <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
                    {movie.Year}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
                {movie.Plot === "N/A" ? "Plot not available." : movie.Plot}
                </Typography>

                <ResultsSections groups={groupedSources} filtered={isFiltered} />
            </Grid>
        </Grid>
    </Box>
          )}
        </Box>
      </Container>

      <FiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        loading={servicesLoading}
        error={servicesError}
        selectedServices={selectedServices}
        setSelectedServices={setSelectedServices}
        serviceOptions={serviceOptions}
      />
    </>
  );
}
