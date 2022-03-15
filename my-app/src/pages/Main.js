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
import axios from 'axios';

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
                <Typography variant="button">Refresh My Feed</Typography>
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

let testpost = {"id": 1, "music": "<iframe style=\"border-radius:12px\" src=\"https://open.spotify.com/embed/track/0ri0Han4IRJhzvERHOZTMr?utm_source=generator\" width=\"100%\" height=\"380\" frameBorder=\"0\" allowfullscreen=\"\" allow=\"autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture\"></iframe>", "description": "Love this song!"}


export default function Main() {
    const [posts, setPosts] = React.useState([])
    React.useEffect(() => {
      axios.get("/api/posts/").then((res)=>setPosts(res.data)).catch((err)=>console.log(err))
      // axios.post("/api/posts/", testpost).then(res => {}).catch(err => console.log(err))

    }, posts)
    return (
        <div>
            <TopBar/>
            <div style={{"display":"flex", "flexDirection":"column", alignItems:"center"}}>
            {posts.map((post) => {
                return <Post post={post}/>
            })}
            </div>
            
        </div>
    )
}