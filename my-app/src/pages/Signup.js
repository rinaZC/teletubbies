import React, {useState} from 'react';
import "./Login.css"
import logo from '../static/images/login.png';
import axios from "axios";
import {
  Route,
  Navigate,
} from 'react-router-dom';

const sign_up_json = {
    operation: "create",
    username: "",
    password: "",
    email: "",
    favorite: "",
    completed: true
};

class FluidInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      value: "" };

  }
  focusField() {
    const { focused } = this.state;
    this.setState({
      focused: !focused });

  }
  handleChange(event) {
    const { target } = event;
    const { value } = target;
    this.setState({
      value: value });

  }
  render() {
    const { type, label, style, id } = this.props;
    const { focused, value } = this.state;
    if(id === "username") {
        sign_up_json.username = value;
    }
    else if(id === "password") {
        sign_up_json.password = value;
    }
    else if(id === "email") {
        sign_up_json.email = value;
    }
    else if(id === "favorite") {
        sign_up_json.favorite = value;
    }

    let inputClass = "fluid-input";
    if (focused) {
      inputClass += " fluid-input--focus";
    } else if (value !== "") {
      inputClass += " fluid-input--open";
    }

    return /*#__PURE__*/(
      React.createElement("div", { className: inputClass, style: style }, /*#__PURE__*/
      React.createElement("div", { className: "fluid-input-holder" }, /*#__PURE__*/
      React.createElement("input", {
        className: "fluid-input-input",
        type: type,
        id: id,
        onFocus: this.focusField.bind(this),
        onBlur: this.focusField.bind(this),
        onChange: this.handleChange.bind(this),
        autoComplete: "off" }), /*#__PURE__*/

      React.createElement("label", { className: "fluid-input-label" },
      label))));




  }}


function Form() {
    const [isLogin, setIsLogin] = useState(false);


    function HandleSubmit(e) {
    e.preventDefault();
    console.log('You clicked submit.');

    const sendPostRequest = async () => {
        try {
            const resp = await axios.post('/api/accounts/', sign_up_json);
            console.log(resp.data);
            if (resp.data.result === 'Success') {
                alert(resp.data.message)
                setIsLogin(true);
            }
            else{
                alert(resp.data.message)
            }
        } catch (err) {
        // Handle Error Here
            console.error(err);
        }};
    sendPostRequest();
  }

  return (
    <form onSubmit={HandleSubmit}>
        <div className={'loginButtonWrapper'}>
            <button className={'login-button'} type="submit">Sign Up</button>
            {isLogin ? <Navigate to={'/accounts/login'} /> : null}
        </div>
    </form>
  );
}


class Signup extends React.Component {
  render() {
    const style = {
      margin: "15px 0" };

    return /*#__PURE__*/(
        <div className={"login-container"}>
            <span>
                <img src={ logo } alt={'Logo'} width={"95"} height={"95"}/>
            </span>
            <div className={"title"}>Sign Up</div>
            <FluidInput type={"username"} label={"username"} id={"username"} style={style}></FluidInput>
            <FluidInput type={"password"} label={"password"} id={"password"} style={style}></FluidInput>
            <FluidInput type={"email"} label={"email"} id={"email"} style={style}></FluidInput>
            <FluidInput type={"favorite"} label={"favorite"} id={"favorite"} style={style}></FluidInput>
            <Form/>
            <br/>
            <p>Already had an account?</p>
            <a href={"/accounts/login/"}> Login in here! </a>
        </div>
    );
  }}

export default Signup;