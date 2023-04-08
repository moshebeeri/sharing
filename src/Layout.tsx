import { firebase } from "./config/firebase";
import React, { useState, useEffect, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Link,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';

export const auth = getAuth(firebase)

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const authInstance = getAuth();
    const unsubscribe = onAuthStateChanged(authInstance, (firebaseUser) => {
      setUser(firebaseUser);
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

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link color="inherit" href="/" >Home</Link>
          </Typography>
          {user ? (
            <>
              <Link color="inherit" href="/" >Create Schedule</Link>
              <Link color="inherit" href="/" >My Activities</Link>
              <Link color="inherit" href="/" >Logout</Link>
            </>
          ) : (
            <Link color="inherit" href="/login" >Login</Link>
            )}
      </AppBar>
      <Container>
        <Box my={4}>{children}</Box>
      </Container>
      <Box mt={5} textAlign="center">
        <Typography variant="body2" color="textSecondary" component="p">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </Typography>
      </Box>
      {/* <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link component={RouterLink} to="/" color="inherit" underline="none">
              Home
            </Link>
          </Typography>
          {user ? (
            <>
              <Button component={RouterLink} to="/create-schedule" color="inherit">
                Create Schedule
              </Button>
              <Button component={RouterLink} to="/my-activities" color="inherit">
                My Activities
              </Button>
              <Button onClick={handleLogout} color="inherit">
                Logout
              </Button>
            </>
          ) : (
            <Button component={RouterLink} to="/login" color="inherit">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        <Box my={4}>{children}</Box>
      </Container>
       */}
    </>
  );
};

export default Layout;