import React from "react";

const EditMovie = ({
  genres,
  movie,
  deleteGenre,
  submitForm,
  onChange,
  addGenre,
  allGenres,
  addActor,
  actors,
  changePhoto,
  deleteActor
}) => {
  return (
    <>
      <form
        onSubmit={submitForm}
        className="movie--edit__form d-flex justify-content-center align-items-center flex-column"
      >
        <div className="form-group row ml-0">
          <div className="col-xs-2">
            <input
              type="text"
              className="form-control mt-1 input-sm"
              placeholder="Movie Title"
              onChange={onChange}
              value={movie.title}
              id="title"
            />
          </div>
          <div className="col-xs-3">
            <input
              type="text"
              className="form-control ml-lg-2 ml-md-2 mt-1 xs-mx-auto input-sm"
              placeholder="Movie Year"
              id="year"
              onChange={onChange}
              value={movie.year}
            />
          </div>
        </div>

        <textarea
          className="form-control"
          placeholder="Movie Description"
          maxLength="255"
          rows="5"
          cols="10"
          value={movie.description}
          id="description"
          onChange={onChange}
        />

        <select className="form-control col-3" onChange={addGenre}>
          <option key="default">Add category</option>
          {allGenres.map(genre => {
            return <option key={genre.genre}>{genre.genre}</option>;
          })}
        </select>
        <br />
        <div>
          {genres.map(genre => {
            return (
              <button
                key={genre.id}
                id="btn--delete"
                className="btn text-white mr-1"
                value={genre.genre}
                onClick={deleteGenre}
              >
                {genre.genre}
              </button>
            );
          })}
        </div>

        <div className="text-center mt-lg-4 mt-sm-2">
          <label className="h4 text-light mr-2" htmlFor="avatar">
            Change Photo:
          </label>
          <div className="photo--input d-flex align-items-center justify-content-center">
            <input
              onChange={changePhoto}
              title=""
              type="file"
              id="avatar"
              name="avatar"
              accept="image/png, image/jpeg"
            />
          </div>
        </div>

        <div className="container">
          <div className="input-group input-group-sm">
            <div>
              <div className="form-group row ml-0">
                <div className="col-xs-1 mr-1">
                  <input
                    id="add-actor"
                    type="text"
                    className="form-control mr-1"
                    placeholder="Add actor"
                  />
                </div>
                <div className="col-xs-2">
                  <span className="">
                    <button
                      onClick={addActor}
                      className="form-control btn btn-warning"
                    >
                      Add
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2">
          {actors.map(actor => {
            return (
              <button
                key={actor.id}
                id="btn--delete"
                className="btn text-white m-1"
                value={actor.name}
                onClick={deleteActor}
              >
                {actor.name}
              </button>
            );
          })}
        </div>

        <br />
        <button className="btn btn-info" type="submit">
          Save
        </button>
      </form>
    </>
  );
};

export default EditMovie;
