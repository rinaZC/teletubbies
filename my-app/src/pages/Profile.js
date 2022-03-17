import * as React from "react";
import Post from "../components/Post";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Refresh from "@mui/icons-material/Refresh";
import AddBox from "@mui/icons-material/AddBox";
import axios from "axios";
import Modal from "@mui/material/Modal";
import { Grid, Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { ModeEditOutline } from "@mui/icons-material";

export default function Profile() {
  const uid = Cookies.get("id");

  const [user, setUser] = React.useState({
    username: null,
    email: null,
    favorite: null,
    bios: null,
    pronouns: null,
    artist: null,
  });
  //const [posts, setPosts] = React.useState([]);
  const getUserProfile = () => {
    axios
      .get(`/api/uprofiles/${uid}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  };
  const [posts, setPosts] = React.useState([]);
  const getLatestUserPosts = () => {
    axios
      .get("/api/posts/")
      .then((res) =>
        setPosts(
          res.data.sort((a, b) => b.id - a.id).filter((p) => p.owner == uid)
        )
      )
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    getLatestUserPosts(setPosts);
    getUserProfile(setUser);
  }, [user]);

  return (
    <div>
      <Box sx={{ flexGrow: 1, marginBottom: 3 }}>
        <AppBar position="sticky">
          <Toolbar sx={{ backgroundColor: "gray" }}>
            <Link to={"/"} style={{ color: "white", flexGrow: 1 }}>
              <Typography variant="h6" component="div">
                MUSIC AGER
              </Typography>
            </Link>
          </Toolbar>
        </AppBar>
      </Box>
      <div
        style={{
          display: "flex",
          justifyContent: "normal",
          margin: "18px 0px",
          borderBottom: "1px solid gray",
        }}
      >
        <div>
          <img
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "80px",
              marginLeft: "400px",
              marginRight: "50px",
            }}
            src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc29ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
          />
        </div>
        <div style={{ marginLeft: "100px", paddingTop: "20px" }}>
          <div>
            <Typography>Welcome, {user.username}</Typography>
            <IconButton>
              <ModeEditOutline />
              <Typography fontSize={"15px"}>Edit Profile</Typography>
            </IconButton>
          </div>
          <div style={{ marginTop: "5px" }}>
            <h5>Pronouns: {user.pronouns}</h5>
            <h5>Bios: {user.bios}</h5>
            {/* <h5>Favorite Music Genre(s): {user.favorite}</h5> */}
            <h5>Favorite Music Genre(s): Indie</h5>
            <h5>Favorite Artist(s): {user.artist}</h5>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {posts.map((post) => {
          return (
            <Post
              post={post}
              getLatestPosts={getLatestUserPosts}
              loggedInUserId={uid}
            />
          );
        })}
      </div>
    </div>
  );
}
