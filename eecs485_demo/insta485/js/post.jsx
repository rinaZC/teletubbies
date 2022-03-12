import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class Post extends React.Component {
  /* Display number of image and post owner of a single post
   */

  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      age: '',
      imgUrl: '',
      owner: '',
      ownerImgUrl: '',
      ownerShowUrl: '',
      lognameLikesThis: -1,
      likesCount: 0,
      postid: -1,
      comments: [],
      value: '',
    };
    this.handleOneLike = this.handleOneLike.bind(this);
    this.handleDoubleLike = this.handleDoubleLike.bind(this);
    this.postLikes = this.postLikes.bind(this);
    this.handleCommentPost = this.handleCommentPost.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // This line automatically assigns this.props.url to the const variable url
    const { url } = this.props;

    // Call REST API to get the post's information
    fetch(url, { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        this.setState({
          age: data.age,
          imgUrl: data.img_url,
          owner: data.owner,
          ownerImgUrl: data.owner_img_url,
          ownerShowUrl: data.owner_show_url,
        });
      })
      .catch((error) => console.log(error));

    // Call REST API to get the likes information
    fetch(`${url}likes/`, { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        this.setState({
          lognameLikesThis: data.logname_likes_this,
          likesCount: data.likes_count,
          postid: data.postid,
        });
      })
      .catch((error) => console.log(error));

    // Call REST API to get the comments information
    fetch(`${url}comments/`, { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        this.setState({
          comments: data.comments,
        });
      })
      .catch((error) => console.log(error));
  }

  handleOneLike(event) {
    event.preventDefault();
    const { url } = this.props;
    const { lognameLikesThis, likesCount } = this.state;
    this.setState({
      lognameLikesThis: lognameLikesThis ? lognameLikesThis - 1 : lognameLikesThis + 1,
      likesCount: lognameLikesThis ? likesCount - 1 : likesCount + 1,
    });
    if (lognameLikesThis === 0) {
      this.postLikes();
    } else {
      fetch(`${url}likes/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
    }
  }

  handleDoubleLike(event) {
    event.preventDefault();
    const { lognameLikesThis, likesCount } = this.state;
    if (lognameLikesThis === 0) {
      this.setState(({
        lognameLikesThis: 1,
        likesCount: likesCount + 1,
      }));
      this.postLikes();
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleCommentPost(event) {
    event.preventDefault();
    const { comments } = this.state;
    const { value } = this.state;
    const { url } = this.props;
    const tempComment = {};
    fetch(`${url}comments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: value }),
    })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        tempComment.commentid = data.commentid;
        tempComment.owner = data.owner;
        tempComment.owner_show_url = data.owner_show_url;
        tempComment.postid = data.postid;
        tempComment.text = data.text;
        this.setState(() => ({
          comments: comments.concat(tempComment),
        }));
      })
      .catch((error) => console.log(error));
  }

  postLikes() {
    const { url } = this.props;
    fetch(`${url}likes/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
  }

  render() {
    const {
      comments, postid, lognameLikesThis, likesCount,
      age, ownerShowUrl,
      ownerImgUrl, imgUrl, owner, value,
    } = this.state;

    return (
      <div
        className="post"
        style={{
          position: 'relative',
          top: '150px',
          left: '30%',
          width: '1000px',
          height: '1500px',
          border: '1px solid #000',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '18px',
            width: '75px',
            height: '75px',
          }}
        >
          <a href={ownerShowUrl}>
            <img src={ownerImgUrl} style={{ width: '100%', height: 'auto' }} alt="owner" />
          </a>
        </div>
        <a
          style={{
            position: 'absolute', top: '10px', left: '100px', fontSize: '20px',
          }}
          href={ownerShowUrl}
        >
          <p>
            {owner}
          </p>
        </a>
        <div
          style={{
            position: 'absolute', top: '100px', width: '1000px', height: '300px',
          }}
        >
          <img
            style={{
              width: '100%', height: 'auto',
            }}
            src={imgUrl}
            alt="Image_owner"
            onDoubleClick={this.handleDoubleLike}
          />
        </div>
        <a
          href={`/p/${postid}/`}
          style={{
            position: 'absolute', top: '10px', right: '18px', fontSize: '20px',
          }}
        >
          <p>
            {moment(age, 'YYYY-MM-DD h:mm:ss').fromNow()}
          </p>
        </a>
        <div
          style={{
            position: 'absolute', top: '900px', left: '50px', fontSize: '20px',
          }}
        >
          <p>
            {likesCount}
            {' '}
            {likesCount === 1 ? 'like' : 'likes'}
          </p>
          <button
            type="button"
            className="like-unlike-button"
            onClick={this.handleOneLike}
          >
            {lognameLikesThis ? 'Unlike' : 'Like'}
          </button>
        </div>
        <div
          style={{
            position: 'absolute', top: '1050px', left: '50px', fontSize: '20px',
          }}
        >
          <div>
            {comments.map((comment) => (
              <p key={comment.commentid}>
                <a href={`/u/${comment.owner}/`}>
                  {comment.owner}
                </a>
                {comment.text}
              </p>
            ))}
          </div>
          <form
            className="comment-form"
            onSubmit={this.handleCommentPost}
          >
            <input
              type="text"
              value={value}
              onChange={this.handleChange}
            />
          </form>
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Post;
