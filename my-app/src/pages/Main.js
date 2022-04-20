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
import { Grid, Button, TextField, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { InfoRounded } from "@mui/icons-material";

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

function TopBar(props) {
  // modal state
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    if (!Cookies.get("id")) {
      alert("Please sign in first.");
      return;
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // modal form state
  const defaultValues = {
    music: "",
    description: "",
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
    // check if empty
    if (formValues.description.length == 0 || formValues.music.length == 0) {
      alert("Input can't be empty");
      return;
    }
    //make api call here
    axios
      .post("/api/posts/", formValues)
      .then((res) => {
        let postsCopy = props.posts.slice();
        postsCopy.unshift(res.data);
        props.setPosts(postsCopy);
      })
      .catch((err) => console.log(err));

    setFormValues(defaultValues);
    handleClose();
  };

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 3 }}>
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
                  id="music-input"
                  name="music"
                  label="Music"
                  type="text"
                  value={formValues.music}
                  onChange={handleInputChange}
                />
                <Tooltip title="Please copy and paste embed track code from Spotify for the best result. ">
                  <InfoRounded />
                </Tooltip>
              </Grid>

              <Grid item>
                <TextField
                  style={{ paddingRight: "23px" }}
                  id="description-input"
                  name="description"
                  label="Thoughts"
                  type="text"
                  value={formValues.description}
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
      <AppBar position="sticky">
        <Toolbar sx={{ backgroundColor: "gray" }}>
          <Link to={"/"} style={{ color: "white", flexGrow: 1 }}>
            <Typography variant="h6" component="div">
              MUSIC AGER
            </Typography>
          </Link>

          <IconButton onClick={props.refreshFeeds} size="large" color="inherit">
            <Refresh />
            <Typography variant="button">Refresh My Feed</Typography>
          </IconButton>
          <IconButton size="large" color="inherit" onClick={handleOpen}>
            <AddBox />
            <Typography variant="button">Make A Post</Typography>
          </IconButton>
          {Cookies.get("id") ? (
            <Link to={"/profile"} style={{ color: "white" }}>
              <IconButton size="large" color="inherit">
                <AccountCircle />
                <Typography variant="button">Profile</Typography>
              </IconButton>
            </Link>
          ) : (
            <Link to={"/accounts/login"} style={{ color: "white" }}>
              <IconButton size="large" color="inherit">
                <AccountCircle />
                <Typography variant="button">Login</Typography>
              </IconButton>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default function Main(props) {
  const loggedInUserId = Cookies.get("id");
  const [posts, setPosts] = React.useState([]);
  const getLatestPosts = () => {
    axios
      .get("/api/posts/")
      .then((res) => setPosts(res.data.sort((a, b) => b.id - a.id)))
      .catch((err) => console.log(err));
  };
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }
  // const getPostComments = (post) => {
  //   axios
  //     .get(`/api/comments/`)
  //     .then((resp) => {
  //       let commentsData = [];
  //       console.log(resp.data);
  //       resp.data
  //         .filter((c) => c.postID == post.id)
  //         .forEach((c) => {
  //           axios.get(`/api/accounts/${c.owner}`).then((userResp) => {
  //             commentsData.push({ ...c, ownerName: userResp.data.username });
  //           });
  //         });
  //       console.log(commentsData);
  //       setComments(commentsData);
  //     })
  //     .catch((err) => console.log(err));
  // };
  const refreshFeeds = (e) => {
    e.preventDefault();
    let postsCopy = shuffle(posts.slice());
    console.log(postsCopy);
    setPosts(postsCopy);
  };
  React.useEffect(() => {
    getLatestPosts(setPosts);
  }, [posts]);
  return (
    <div>
      <TopBar posts={posts} setPosts={setPosts} refreshFeeds={refreshFeeds} />
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
              key={post.id}
              post={post}
              getLatestPosts={(post) => getLatestPosts(post)}
              loggedInUserId={loggedInUserId}
              // setPosts={setPosts}
            />
          );
        })}
      </div>
    </div>
  );
}
