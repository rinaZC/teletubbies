import * as React from "react";
import Post from "../components/Post";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import Modal from "@mui/material/Modal";
import { Grid, Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { ModeEditOutline } from "@mui/icons-material";

const boxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Profile() {
  const uid = Cookies.get("id");

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    if (!Cookies.get("id")) {
      alert("Please sign in first.");
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    getLatestUserPosts(setPosts);
    setOpen(false);
  };

  
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
      .get(`/api/accounts/${uid}`)
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


  const defaultValues = {
    ...user,
    owner: Cookies.get("id"),
  };
  const [formValues, setFormValues] = React.useState(defaultValues);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //make api call here
    axios
      .put("/api/posts/", formValues)
      .then((res) => {})
      .catch((err) => console.log(err));

    setFormValues(defaultValues);
    handleClose();
  };

  React.useEffect(() => {
    getLatestUserPosts(setPosts);
    getUserProfile(setUser);
  }, [user]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={boxStyle}>
          <form onSubmit={handleSubmit}>
            <Grid
              container
              alignItems="center"
              justify="center"
              direction="column"
              rowSpacing={3}
            >
              <Grid item>
                <Typography>Make A Post</Typography>
              </Grid>
              <Grid item>
                <TextField
                  id="pronouns-input"
                  name="pronouns"
                  label={user.pronouns}
                  type="text"
                  value={user.pronouns}
                  onChange={handleInputChange}
                />

              </Grid>
              <Grid item>
                <TextField
                  id="bios-input"
                  name="bios"
                  label={user.bios}
                  type="text"
                  value={user.bios}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="favorite-input"
                  name="favorite"
                  label={user.favorite}
                  type="text"
                  value={user.favorite}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="artist-input"
                  name="artist"
                  label={user.artist}
                  type="text"
                  value={user.artist}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>

      // fengge
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
