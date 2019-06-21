import React, { Component } from "react";
import { getUserById } from "./../services/userService";
import { Helmet } from "react-helmet";
import AbsoluteWrapper from "./common/AbsoluteWrapper";

class PublicProfile extends Component {
  state = {
    user: {}
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    console.log(id);
    const user = await getUserById(id);
    this.setState({ user: user.data });
    console.log(user);
  }

  render() {
    let imageSrc = "data:image/png;base64,";
    const { user } = this.state;
    return (
      <AbsoluteWrapper>
        <Helmet>
          <title>{user.username + "'s Profile Page"}</title>
        </Helmet>
        {user && (
          <>
            <h1 className="text-light text-center">
              <span className="text-warning">{user.username}'s </span>
              Profile Page!
            </h1>
            <div className="user--profile d-flex flex-wrap flex-lg-nowrap justify-content-center pt-lg-4">
              <div className="profile--photo d-flex flex-wrap flex-lg-nowrap justify-content-center">
                {user.photo !== null ? (
                  <img src={imageSrc + user.photo} />
                ) : (
                  <img src="http://s3.amazonaws.com/37assets/svn/765-default-avatar.png" />
                )}

                <div className="user--details text-light mt-2 h4">
                  <div className="p-2">
                    <span className="text-warning">Username: </span>
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
          </>
        )}
      </AbsoluteWrapper>
    );
  }
}

export default PublicProfile;
