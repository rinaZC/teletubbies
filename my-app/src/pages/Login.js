import React, { useState } from "react";
import "./Login.css";
import logo from "../static/images/login.png";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Typography } from "@mui/material";

const login_json = {
  operation: "login",
  username: "",
  password: "",
};

class FluidInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      value: "",
    };
  }
  focusField() {
    const { focused } = this.state;
    this.setState({
      focused: !focused,
    });
  }
  handleChange(event) {
    const { target } = event;
    const { value } = target;
    this.setState({
      value: value,
    });
  }
  render() {
    const { type, label, style, id } = this.props;
    const { focused, value } = this.state;

    if (id === "username") {
      login_json.username = value;
    } else if (id === "password") {
      login_json.password = value;
    }

    let inputClass = "fluid-input";
    if (focused) {
      inputClass += " fluid-input--focus";
    } else if (value !== "") {
      inputClass += " fluid-input--open";
    }

    return /*#__PURE__*/ React.createElement(
      "div",
      { className: inputClass, style: style } /*#__PURE__*/,
      React.createElement(
        "div",
        { className: "fluid-input-holder" } /*#__PURE__*/,
        React.createElement("input", {
          className: "fluid-input-input",
          type: type,
          id: id,
          onFocus: this.focusField.bind(this),
          onBlur: this.focusField.bind(this),
          onChange: this.handleChange.bind(this),
          autoComplete: "off",
        }) /*#__PURE__*/,

        React.createElement("label", { className: "fluid-input-label" }, label)
      )
    );
  }
}

function Form() {
  const [isLogin, setIsLogin] = useState(false);

  function HandleSubmit(e) {
    e.preventDefault();
    console.log("You clicked submit.");

    const sendPostRequest = async () => {
      try {
        const resp = await axios.post("/api/accounts/", login_json);
        console.log(resp.data);
        if (resp.data.result === "Success") {
          Cookies.set("id", resp.data.id);
          setIsLogin(true);
          console.log("Cookie:", Cookies.get("id"));
        } else {
          alert(resp.data.message);
        }
      } catch (err) {
        // Handle Error Here
        console.error(err);
      }
    };
    sendPostRequest();
  }

  return (
    <form onSubmit={HandleSubmit}>
      <div className={"loginButtonWrapper"}>
        <button className={"login-button"} type="submit">
          Login
        </button>
        {isLogin ? <Navigate to={"/"} /> : null}
      </div>
    </form>
  );
}

class Login extends React.Component {
  render() {
    const style = {
      margin: "15px 0",
    };

    return (
      <div>
        <Typography
          variant="h4"
          color={"gray"}
          sx={{ margin: 5, textAlign: "center" }}
        >
          WELCOME TO MUSIC AGER
        </Typography>

        <div className={"login-container"}>
          <span>
            <img src={logo} alt={"Logo"} width={"95"} height={"95"} />
          </span>
          <div className={"title"}>Login</div>
          <FluidInput
            type={"username"}
            label={"username"}
            id={"username"}
            style={style}
          ></FluidInput>
          <FluidInput
            type={"password"}
            label={"password"}
            id={"password"}
            style={style}
          ></FluidInput>
          <Form />
          <br />
          <p>No account?</p>
          <a href={"/accounts/create/"}> Sign up here! </a>
        </div>
      </div>
    );
  }
}

export default Login;
