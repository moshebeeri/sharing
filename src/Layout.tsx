import React, { useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { styled } from '@mui/system';
import { useSelector } from "react-redux";
import { RootState } from "./app/store";

const ShraitImg = styled('img')({
  height: '70px',
  display: 'none',
  marginRight: '8px',
  '@media (min-width: 768px)': {
    display: 'inline',
  },
});

interface LayoutProps {
  children: ReactNode;
}

const pages = [
  { name: 'Schedule', href: '/schedule' },
  { name: 'Activities', href: '/activities' },
  { name: 'Resources', href: '/resources' },
  { name: 'Search', href: '/search' }
];
const settings = ['Profile', 'Account', 'Dashboard'];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const [ authUser, setAuthUser] = useState<User | null>(null);

  useEffect(() => {
    const authInstance = getAuth();
    const unsubscribe = onAuthStateChanged(authInstance, (firebaseUser) => {
      setAuthUser(firebaseUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const authInstance = getAuth();
      await signOut(authInstance);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSettingsMenuClickes = (setting: String) => {
    switch (setting) {
      case 'Logout':
        handleLogout();
    }
    handleCloseUserMenu();
  };
  function getUserInitials(name: string | null, email: string | null): string {
    if (name) {
      return name.split(' ').map((n) => n[0]).join('').toUpperCase();
    } else if (email) {
      return email[0].toUpperCase();
    } else {
      return '';
    }
  }

  return (
    <>
    <AppBar position="static">
      <Container maxWidth="xl">
          <Toolbar disableGutters>
            <a href="/" id="home" >
              <ShraitImg src="ShareEz-logo.png" alt="Shreit Icon" />
            </a>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SHARE
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
            {
              [
                ...pages.map((page) => (
                  <MenuItem key={'mobile-' + page.name} onClick={handleCloseNavMenu} href={page.href}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                )),
                !isLoading && user ? (
                  <MenuItem key='mobile-Logout' onClick={handleCloseNavMenu} href='/logout'>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                ) : (
                  <MenuItem key='mobile-Login' onClick={handleCloseNavMenu} href='/login'>
                    <Typography textAlign="center">Login</Typography>
                  </MenuItem>
                )
              ]
            }


            </Menu>
          </Box>
            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SHARE
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {[
              ...pages.map((page) => (
                <Button
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  href={page.href}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.name}
                </Button>
              )),
              !isLoading && user ? null : (
                <Button
                  key='login'
                  onClick={handleCloseNavMenu}
                  href={'/login'}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  LOGIN
                </Button>
              ),
            ]}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={authUser?.displayName ?? ''}
                  src={authUser?.photoURL ?? ''}
                >
                  {!user || !authUser?.photoURL ? getUserInitials(authUser?.displayName ?? '', authUser?.email ?? '') : null}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {[
                ...settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => handleSettingsMenuClickes(setting)}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>

                )),
                !isLoading && user ? (
                  <MenuItem key='mobile-Logout' onClick={() => handleSettingsMenuClickes('Logout')} href='/logout'>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                ) : (
                  <MenuItem key='mobile-Login' onClick={handleCloseNavMenu} href='/login'>
                    <Typography textAlign="center">Login</Typography>
                  </MenuItem>
                )
              ]}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    <Container>
        <Box my={4}>{children}</Box>
    </Container>

    <footer style={{ width:'100%', color: "gray", position: "fixed", bottom: 0 }}>
      <Box mt={5} textAlign="center">
        <Typography variant="body2" color="textSecondary" component="p">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </Typography>
      </Box>
    </footer>
    </>
  );
};

export default Layout;