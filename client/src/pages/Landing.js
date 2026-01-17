import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import SearchBar from "../components/SearchBar";

export default function LandingPage() {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    const q = title.trim();
    if (!q) return;
    navigate(`/results?title=${encodeURIComponent(q)}`);
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          textAlign: "center",
        }}
      >
          <Typography variant="h1" component="h1" sx={{ fontWeight: 700 }}>
            Find A Movie
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Search for a movie and see where it’s streaming.
          </Typography>
        <SearchBar
          value={title}
          onChange={setTitle}
          onSubmit={onSubmit}
          loading={false}
          autoFocus
        />
      </Box>
    </Container>
  );
}
