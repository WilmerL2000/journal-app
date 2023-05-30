import { LogoutOutlined, MenuOutlined } from '@mui/icons-material';
import {
  AppBar,
  Grid,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { startLogout } from '../../store/auth';
import { setMenu } from '../../store/journal';

export const Navbar = ({ drawerWidth = 240 }) => {
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(startLogout());
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          sx={{ mr: 2, display: { sm: 'none' } }}
          onClick={() => dispatch(setMenu())}
        >
          <MenuOutlined />
        </IconButton>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" noWrap component="div">
            Journal App
          </Typography>
          <Tooltip title="Cerrar sesión" TransitionComponent={Zoom}>
            <IconButton color="error" onClick={onLogout}>
              <LogoutOutlined />
            </IconButton>
          </Tooltip>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
