import React from "react";
import video from "../../logo/mov.svg";
import { useSpring, animated } from "react-spring";

const Jumbo = ({ user }) => {
  const fade = useSpring({
    from: {
      opacity: 0
    },
    to: {
      opacity: 1
    }
  });

  return (
    <animated.div
      className="jumbotron text-center"
      style={fade}
      // style={fade}
    >
      <img src={video} alt="" style={{ width: 75, height: 75 }} />
      <div className="header-title">
        <h3>Welcome to the Movie Theater app, {user}!</h3>
      </div>

      <div className="header-span">
        <span className="header--text text-white p-2">
          The place where you can find the most amazing movies!
        </span>
      </div>
    </animated.div>
  );
};

export default Jumbo;
