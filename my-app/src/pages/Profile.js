import * as React from "react";
import 

export default function Profile() {
    const { loggedInUser } = props;
    const [posts, setPosts] = React.useState([]);
    const getLatestPosts = () => {
      axios
        .get("/api/posts/")
        .then((res) => setPosts(res.data.sort((a, b) => b.id - a.id)))
        .catch((err) => console.log(err));
    };
    return (
        <div>
            <div>
                <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"18px 0px"
                }}>
                    <img style={{width:"160px",height:"160px",borderRadius:'80px'}}
                    src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc29ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
                    />
                </div>
                <div>
                    <h4>dfajkdfakweqwe</h4>
                    <div>
                        <h5>Bios: {}</h5>
                        <h5></h5>
                    </div>
                </div>
            </div>
        </div>
    )
}