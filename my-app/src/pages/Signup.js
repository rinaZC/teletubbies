import React from 'react';
import "./Login.css"
import logo from '../static/images/login.png';
import axios from "axios";

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


class Button extends React.Component {
    handleButtonClicked(event) {
        event.preventDefault();
        axios.post("/api/accounts/", sign_up_json)
    }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", {
        className: `button ${this.props.buttonClass}`,
        onClick: this.handleButtonClicked.bind(this) },

      this.props.buttonText));


  }}


class Signup extends React.Component {
  render() {
    const style = {
      margin: "15px 0" };

    return /*#__PURE__*/(
      React.createElement("div", { className: "login-container" },
      React.createElement("img",
          {src: logo, width: 95, height: 95},
          null),
      React.createElement("div", { className: "title" }, "Sign Up"),
      React.createElement(FluidInput, { type: "username", label: "username", id: "username", style: style} ),
      React.createElement(FluidInput, {
        type: "password",
        label: "password",
        id: "password",
        style: style }), /*#__PURE__*/

      React.createElement(FluidInput, { type: "email", label: "email", id: "email", style: style}),
      React.createElement(FluidInput, { type: "favorite", label: "favorite music genre", id: "favorite", style: style }),
      React.createElement(Button, { buttonText: "sign up", buttonClass: "login-button" }),
      React.createElement("p",{}, "Already had an account?"),
      React.createElement('a',{href: "/accounts/login/"}, "Login in here!")
      ));
  }}

export default Signup;