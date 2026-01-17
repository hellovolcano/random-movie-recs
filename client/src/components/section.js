import { 
    ListItem,
    Typography,
    List,
    ListItemText,
    Link,
    Card,
    CardContent
 } from "@mui/material";

export default function Section({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <Card sx={{ mt: 2 }}>
        <CardContent>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>
            {title}
        </Typography>

        <List dense>
            {items.map((s, idx) => {
            const url = s.web_url ?? s.webUrl ?? s.url; // defensive
            const key =
                s.id ??
                `${s.name}-${url}-${s.type ?? "na"}-${s.region ?? s.country ?? "xx"}-${idx}`;

            return (
                <ListItem key={key} disableGutters>
                <ListItemText
                    primary={
                    url ? (
                        <Link href={url} target="_blank" rel="noreferrer">
                        {s.name}
                        </Link>
                    ) : (
                        s.name
                    )
                    }
                />
                </ListItem>
            );
            })}
        </List>
        </CardContent>
    </Card>
  );
}