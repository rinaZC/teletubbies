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
import Cookies from 'js-cookie';

export default function Profile() {
    const uid  = Cookies.get('id');

    const [user, setUser] = React.useState({'username': null, 'email': null, 'favorite': null, 'bios': null, 'pronouns': null, 'artist': null})
    //const [posts, setPosts] = React.useState([]);
    const getUserProfile = () => {
        axios
            .get(`/api/uprofiles/${uid}`)
            .then((res) => setUser(res.data))
            .catch((err) => console.log(err));
    }
    // const getLatestPosts = () => {
    //   axios
    //     .get("/api/posts/")
    //     .then((res) => setPosts(res.data.sort((a, b) => b.id - a.id).filter((post)=>{return post.owner==uid})))
    //     .catch((err) => console.log(err));
    // };


    React.useEffect(() => {
        getUserProfile(setUser);
      }, [user]);

    return (
        <div>
            <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"18px 0px",
                    borderBottom:"1px solid gray"
                }}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:'80px'}}
                    src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc29ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
                    />
                </div>
                <div>
                    <h4>{user.username}</h4>
                    <div style={{dispay:"flex", justifyContent:"space-between", width:"108%"}}>
                        <h5>Pronouns: {user.pronouns}</h5>
                        <h5>Bios: {user.bios}</h5>
                        <h5>Favorite: {user.favorite}</h5>
                        <h5>Artist: {user.artist}</h5>
                    </div>
                </div>
                
            </div>
            {/* <div
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
                    getLatestPosts={getLatestPosts}
                    loggedInUser={user.username}
                    />
                );
                })}
            </div> */}
        </div>
    )
}