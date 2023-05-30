import { Backdrop, Box, Toolbar, useMediaQuery } from '@mui/material';
import { Navbar, Sidebar } from '../components';
import { useSelector } from 'react-redux';

const drawerWidth = 240;

export const JournalLayout = ({ children }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const { showMenu } = useSelector((state) => state.journal);

  return (
    <Box
      sx={{ display: 'flex' }}
      className="animate__animated animate__fadeIn animate__faster"
    >
      <Navbar drawerWidth={drawerWidth} />
      {!isMobile && <Sidebar drawerWidth={drawerWidth} />}
      {showMenu && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={showMenu}
        >
          <Sidebar drawerWidth={drawerWidth} />
        </Backdrop>
      )}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Toolbar */}
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
