import { Alert } from "@mui/material";
export default function Formerr({ error }) {
  if (error === "") {
    return null;
  } else {
    return <Alert severity="error">{error}</Alert>;
  }
}
