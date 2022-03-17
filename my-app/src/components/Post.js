import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { DeleteOutline } from "@mui/icons-material";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";

export default function Post(props) {
  const { loggedInUserId, post, getLatestPosts } = props;
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [ownerName, setOwnerName] = React.useState("");
  React.useEffect(() => {
    axios.get(`/api/accounts/${post.owner}`).then((resp) => {
      setOwnerName(resp.data.username).catch((err) => console.log(err));
    });
  }, [props.post.owner]);

  return (
    <div>
      <Card sx={{ minWidth: 500, marginBottom: 5 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
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
            {post.description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
        </CardActions>
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
