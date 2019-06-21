import React from "react";
import Popup from "reactjs-popup";

const YoutubePopup = (key, toggle, onPopupClose) => {
  {
    console.log("youtube" + toggle);
  }
  return (
    <Popup
      open={toggle === "true" ? true : false}
      closeOnEscape={true}
      position="right center"
      onClose={onPopupClose}
      contentStyle={{ width: 560, height: 315 }}
    >
      <div className="movie--trailer">
        <iframe
          src={"https://www.youtube.com/embed/" + key}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </Popup>
  );
};

export default YoutubePopup;

/* const YoutubePopup = () => (
  <Popup
    trigger={<input type="text" placeholder="start typing ... " />}
    on="focus"
    position="top left"
    closeOnDocumentClick
  >
    <span> On focus popup event </span>
  </Popup>
);

render(<YoutubePopup />); */
