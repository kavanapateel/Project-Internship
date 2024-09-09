import {
  AppBar,
  IconButton,
  styled,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import AdminMenu from "../DropDownMenu/AdminMenu";
import TimelineIcon from "@mui/icons-material/Timeline";

const Typeface = styled(Typography)({
  textDecoration: "none",
  color: "#F1F1F1",
  fontWeight: 700,
  fontFamily: "fantasy",
  filter:
    "drop-shadow(2px 2px #f00) drop-shadow(-2px 0px #0f0) drop-shadow(0px -2px #00f)",
});

export default function Navbar() {
  return (
    <>
      <AppBar position="relative">
        <Toolbar sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Typeface variant="h4" component="a" href="/">
            IDEX
          </Typeface>
          <Tooltip title="Checkpoints" arrow placement="right">
            <IconButton href="/">
              <TimelineIcon htmlColor="#F1F1F1" fontSize="large" />
            </IconButton>
          </Tooltip>
          <AdminMenu />
        </Toolbar>
      </AppBar>
    </>
  );
}
