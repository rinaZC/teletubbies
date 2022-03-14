import * as React from 'react';
import Post from '../components/Post';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Refresh from '@mui/icons-material/Refresh';
import AddBox from '@mui/icons-material/AddBox';

function TopBar() {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              App Name
            </Typography>
            
            <IconButton
                size="large"
                color="inherit"
              >
                <Refresh />
                <Typography variant="button">Refresh</Typography>
            </IconButton>
            <IconButton
                size="large"
                color="inherit"
              >
                <AddBox/>
                <Typography variant="button">Make A Post</Typography>
            </IconButton>
            <IconButton
                size="large"
                color="inherit"
              >
                <AccountCircle />
                <Typography variant="button">Profile</Typography>
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }

let posts = [{}, {}, {}, {}, {}]


export default function Main() {
    return (
        <div>
            <TopBar/>
            {posts.map((item, index) => {
                return <Post/>
            })}
        </div>
    )
}