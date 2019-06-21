import React, { Component } from "react";
import { Helmet } from "react-helmet";
import {
  getUserById,
  updateUser,
  updatePhoto,
  deleteUserAccount
} from "./../services/userService";
import "../../node_modules/font-awesome/css/font-awesome.min.css";
import { toast } from "react-toastify";
import auth from "../services/authService";
import { confirmAlert } from "react-confirm-alert";
import AbsoluteWrapper from "./common/AbsoluteWrapper";

class Profile extends Component {
  state = {
    user: {}
  };

  async componentDidMount() {
    let token = localStorage.getItem("token");
    let userId = JSON.parse(atob(token.split(".")[1])).id;
    const user = await getUserById(userId);
    this.setState({ user: user.data });
    console.log(user);
  }

  deleteAccount = () => {
    const user = this.state.user;
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure you want to delete your account?",
      buttons: [
        {
          label: "Yes",
          onClick: () =>
            deleteUserAccount(user.id)
              .then(response => {
                toast.warn("Your account was deleted.");
                auth.logout();
                window.setTimeout(() => {
                  window.location = "/";
                }, 2000);
              })
              .catch(er => {
                toast.error("We couldn't erase your account at this time.");
              })
        },
        {
          label: "No"
        }
      ]
    });
  };

  uploadImage = e => {
    e.preventDefault();
    const file = e.target.files[0];
    const { user } = this.state;
    getBase64(file)
      .then(base64 => {
        user.photo = base64.split(",")[1];
        let newUser = { photo: user.photo, id: user.id };
        //console.log("user photo", user.photo);
        updatePhoto(newUser);
        toast.info("Your photo has been updated.");
        this.setState({ user });
      })
      .catch(er => {
        toast.error(
          "An error occured while trying to change your profile photo."
        );
      });
  };

  render() {
    let imageSrc = "data:image/png;base64,";
    const { user } = this.state;
    console.log("user", this.state.user);
    return (
      <AbsoluteWrapper>
        <Helmet>
          <title>Profile Page</title>
        </Helmet>
        {user && (
          <>
            <h1 className="text-light text-center">
              Hello, <span className="text-warning">{user.username}</span>!
            </h1>
            <div className="user--profile d-flex flex-wrap flex-lg-nowrap justify-content-center pt-lg-4">
              <div className="profile--photo d-flex flex-wrap flex-lg-nowrap justify-content-center">
                {user.photo !== null ? (
                  <img src={imageSrc + user.photo} alt={user.name} />
                ) : (
                  <img
                    src="http://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
                    alt="Avatar default"
                  />
                )}

                <div className="user--details text-light mt-2  h4">
                  <div className="p-2">
                    <span className="text-warning">Email:</span> {user.email}
                  </div>
                  <div className="p-2">
                    <span className="text-warning">Username:</span>{" "}
                    {user.username}
                  </div>
                  <div className="p-2">
                    <span className="text-warning">Name:</span> {user.name}
                  </div>
                  <div className="p-2">
                    <span className="text-warning">Age:</span> {user.age}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-lg-4 mt-sm-2">
              <label className="h4 text-light mr-2" htmlFor="avatar">
                Upload Photo:
              </label>
              <div className="photo--input d-flex align-items-center justify-content-center">
                <input
                  onChange={this.uploadImage}
                  title=""
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/png, image/jpeg"
                />
              </div>
            </div>

            <div className="delete-account text-center pt-sm-2 pt-lg-4 mr-5">
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={this.deleteAccount}
              >
                Delete My Account!
              </button>
            </div>
          </>
        )}
      </AbsoluteWrapper>
    );
  }
}

const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

export default Profile;
