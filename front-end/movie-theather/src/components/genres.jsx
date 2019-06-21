import React from "react";

const Genres = ({ genres }) => {
  return (
    <div className="genres">
      <select name="genres" className="genres-select">
        <option value="" selected disabled hidden>
          Select category
        </option>
        {genres.map(genre => (
          <option key={genre.id} value="genre.genre">
            {genre.genre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Genres;
