import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { blue, green, grey, red, yellow } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Comment, DeleteOutline, Edit } from "@mui/icons-material";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";
import { color } from "@mui/system";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

var filter = require("leo-profanity");
filter.loadDictionary();

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  // transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  // marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const bgcolors = [red[500], grey, blue, yellow, green];

export default function Post(props) {
  const { loggedInUserId, post, getLatestPosts } = props;
  const [open, setOpen] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
  const [likesNum, setLikesNum] = React.useState(post.likes);
  const [ownerName, setOwnerName] = React.useState("");
  const [expanded, setExpanded] = React.useState(false);
  const [comments, setComments] = React.useState([]);
  const [inputComment, setInputComment] = React.useState("");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickLike = () => {
    let newLikesNum = 0;
    if (liked) {
      setLiked(false);
      newLikesNum = likesNum - 1;
      setLikesNum(newLikesNum);
    } else {
      setLiked(true);
      newLikesNum = likesNum + 1;
      setLikesNum(newLikesNum);
    }
    axios
      .put(`/api/posts/${post.id}/`, { ...post, likes: newLikesNum })
      .then((resp) => {
        console.log(resp.data);
      })
      .catch((err) => console.log(err));
  };

  const postComment = () => {
    axios
      .post(`/api/comments/`, {
        owner: loggedInUserId,
        postID: post.id,
        content: inputComment,
      })
      .then((resp) => {
        console.log(resp.data);
        getPostComments();
        // props.getLatestPosts();
        setInputComment("");
      })
      .catch((err) => console.log(err));
  };

  const getPostComments = () => {
    axios
      .get(`/api/comments/`)
      .then((resp) => {
        let commentsData = [];
        console.log(resp.data);
        resp.data
          .filter((c) => c.postID == post.id)
          .forEach((c) => {
            axios.get(`/api/accounts/${c.owner}`).then((userResp) => {
              commentsData.push({ ...c, ownerName: userResp.data.username });
            });
          });
        console.log(commentsData);
        setComments(commentsData);
      })
      .catch((err) => console.log(err));
  };
  React.useEffect(() => {
    axios.get(`/api/accounts/${post.owner}`).then((resp) => {
      setOwnerName(resp.data.username).catch((err) => console.log(err));
    });
    getPostComments();
  }, [props.post.owner]);

  return (
    <div>
      <Card sx={{ minWidth: 500, marginBottom: 5 }}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: bgcolors[Math.random(bgcolors.length)] }}
              aria-label="recipe"
            >
              {post.ownerName}
            </Avatar>
          }
          action={
            loggedInUserId == post.owner ? (
              <IconButton aria-label="settings" onClick={handleClickOpen}>
                <DeleteOutline />
              </IconButton>
            ) : (
              <></>
            )
          }
          subheader={
            <div>
              <p>{ownerName}</p>
              {post.date.split("T")[0]}
            </div>
          }
        />
        <div dangerouslySetInnerHTML={{ __html: post.music }} />

        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {filter.clean(post.description)}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton onClick={handleClickLike} aria-label="likes">
            <FavoriteIcon sx={{ color: liked ? "red" : "grey" }} />
          </IconButton>
          <Typography> {likesNum}</Typography>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <Comment />
            <Typography marginLeft="5px">{comments.length}</Typography>
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Box sx={{ width: "100%", maxHeight: "180px", overflowY: "auto" }}>
              {comments
                .filter((c) => true)
                .sort((a, b) => b.id - a.id)
                .map((c) => (
                  <Grid key={c.id} container marginBottom="10px">
                    <Grid item xs={1}>
                      <Avatar
                        sizes="small"
                        sx={{ bgcolor: bgcolors[Math.random(bgcolors.length)] }}
                        aria-label="recipe"
                      ></Avatar>
                    </Grid>
                    <Grid margin="0px 8px" item>
                      <div>{c.ownerName}</div>
                      <div style={{ fontSize: "10px" }}>
                        {c.date.split("T")[0]}
                      </div>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{c.content}</Typography>
                    </Grid>
                  </Grid>
                ))}
            </Box>

            <Box>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  postComment();
                }}
              >
                <TextField
                  size="small"
                  label="Write your comment"
                  id="comment"
                  value={inputComment}
                  onChange={(e) => {
                    e.preventDefault();
                    setInputComment(e.target.value);
                  }}
                />
                <Button type="submit">Post</Button>
              </form>
            </Box>
          </CardContent>
        </Collapse>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this post?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can not undo this action.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              axios
                .delete(`/api/posts/${post.id}`)
                .then((res) => {
                  getLatestPosts();
                })
                .catch((err) => console.log(err));
              handleClose();
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
