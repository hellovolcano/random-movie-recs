import { Box, Typography, Divider } from "@mui/material";
import Section from "./section";

export default function ResultsSections({ groups, filtered }) {
  // groups expected: { subscription: [], free: [], rentOrBuy: [] }
  const { subscription = [], free = [], rentOrBuy = [] } = groups ?? {};

  const totalCount = subscription.length + free.length + rentOrBuy.length;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Where to watch
      </Typography>

      {totalCount > 0 ? (
        <>
          <Section title="Subscription" items={subscription} />
          {(subscription.length > 0 && (free.length > 0 || rentOrBuy.length > 0)) && (
            <Divider sx={{ mt: 2 }} />
          )}

          <Section title="Free" items={free} />
          {(free.length > 0 && rentOrBuy.length > 0) && <Divider sx={{ mt: 2 }} />}

          <Section title="Rent / Buy" items={rentOrBuy} />
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {filtered ? "No matches for the selected filters." : "No sources found."}
        </Typography>
      )}
    </Box>
  );
}