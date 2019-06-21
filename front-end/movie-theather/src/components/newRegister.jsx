import React from "react";
import Form from "./common/form";
import * as userService from "../services/userService";
import Joi from "@hapi/joi";
import { checkIfUsernameExists } from "../services/findUserByUsername";
import { checkUserByEmail } from "../services/findUserByEmail";
import { Helmet } from "react-helmet";
import AbsoluteWrapper from "./common/AbsoluteWrapper";
import "../loginForm.css";

class NewRegisterForm extends Form {
  state = {
    data: {
      username: "",
      password: "",
      name: "",
      email: "",
      age: ""
    },
    errors: {},
    registered: false
  };

  schema = {
    username: Joi.string()
      .alphanum()
      .min(5)
      .max(30)
      .required()
      .label("Username"),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{7,30}$/, { name: "password" })
      .required()
      .label("Password"),
    name: Joi.string()
      .regex(/^[A-Z][a-z]{1,15}/, { name: "name" })
      .required()
      .label("Name"),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required()
      .label("Email"),
    age: Joi.number()
      .integer()
      .min(14)
      .max(110)
      .required()
      .label("Age")
  };

  doSubmit = async () => {
    const errors = { ...this.state.errors };

    try {
      const { data } = await userService.addUser(this.state.data);
      this.setState({ registered: true });
      /* await auth.login(data.username, this.state.data.password);
      window.location = "/"; */
    } catch (ex) {
      const errors = { ...this.state.errors };
      checkUserByEmail(this.state.data.email).then(response => {
        if (response.data) {
          const errors = { ...this.state.errors };
          errors["email"] = "The email already exists.";
          this.setState({ errors });
        }
      });

      checkIfUsernameExists(this.state.data.username).then(response => {
        if (response.data) {
          const errors = { ...this.state.errors };
          errors["username"] = "The username already exists.";
          this.setState({ errors });
        }
      });

      console.log("exception asd", ex);
      //errors.username = ex.response.data;
      //this.setState({ errors });
    }
  };

  render() {
    return this.state.registered === false ? (
      <AbsoluteWrapper>
        <Helmet>
          <title>Registration Form - Movie Theater App</title>
        </Helmet>

        <div id="modal">
          <div id="modal-content">
            <div id="modal-title">
              <h2>REGISTER</h2>
              <div className="underline-title" />
            </div>
            <form className="form" onSubmit={this.handleSubmit}>
              {this.renderInput("username", "Username", "fa fa-user")}
              <div className="form-border" />
              {this.renderInput(
                "password",
                "Password",
                "fa fa-unlock-alt",
                "password"
              )}
              <div className="form-border" />
              {this.renderInput("name", "Name", "fa fa-address-card")}
              <div className="form-border" />
              {this.renderInput("email", "Email", "fa fa-envelope")}
              <div className="form-border" />
              {this.renderInput("age", "Age", "fa fa-hourglass-half")}
              <div className="form-border" />

              {this.renderButton("REGISTER")}
            </form>
          </div>
        </div>
      </AbsoluteWrapper>
    ) : (
      <div className="text-center">
        <h1 className="text-light">
          Thank you for your registration. Please check your email to confirm
          your account.
        </h1>
      </div>
    );
  }
}

export default NewRegisterForm;
