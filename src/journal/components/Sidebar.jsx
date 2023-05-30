import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { SideBarItem } from './SideBarItem';
import { CloseOutlined } from '@mui/icons-material';
import { setMenu } from '../../store/journal';

export const Sidebar = ({ drawerWidth = 240 }) => {
  const { photoURL, displayName } = useSelector((state) => state.auth);
  const { notes } = useSelector((state) => state.journal);
  const isMobile = useMediaQuery('(max-width:600px)');
  const dispatch = useDispatch();

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        <Toolbar>
          <Grid
            container
            direction="row"
            justifyContent={!isMobile ? 'space-around' : 'space-between'}
            alignItems="center"
          >
            <Avatar
              src={`${photoURL}`}
              alt="Imagen de la nota"
              loading="lazy"
              sx={{ width: 56, height: 56 }}
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: !isMobile ? 'block' : 'none' }}
            >
              {displayName.split(' ')[0].toUpperCase()}
            </Typography>
          </Grid>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 2, display: { sm: 'none' } }}
            onClick={() => dispatch(setMenu())}
          >
            <CloseOutlined sx={{ fontSize: 30 }} />
          </IconButton>
        </Toolbar>

        <Divider />

        <List>
          {notes.map((note) => (
            <SideBarItem key={note.id} {...note} />
          ))}
        </List>
      </Drawer>
    </Box>
  );
};
