import React, { Component } from "react";
import { getMovieById } from "./../services/getMovieById";
import { getMovieActors } from "./../services/movieActors";
import { getMovieCategories } from "./../services/movieCategoryService";
import "../test.css";
import { Helmet } from "react-helmet";
import Reviews from "./reviews";
import auth from "../services/authService";

import AbsoluteWrapper from "./common/AbsoluteWrapper";
import "../App.css";

import Joi from "@hapi/joi";
import Form from "./common/form";
import { getGenres } from "../services/genreService";
import { updateMovie } from "../services/movieService";
import { toast } from "react-toastify";
import EditMovie from "./editMovie";
import MovieDetails from "./movieDetails";

class Details extends Form {
  state = {
    user: {},
    movie: {},
    actors: [],
    genres: [],
    allGenres: [],
    editMovieToggle: false
  };

  schema = {
    title: Joi.string()
      .required()
      .label("Title"),
    year: Joi.number()
      .integer()
      .min(1900)
      .max(2050)
      .required()
      .label("Year"),
    description: Joi.string()
      .min(10)
      .max(255)
      .required()
      .label("Description")
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    const { data: movie } = await getMovieById(id);
    const { data: actors } = await getMovieActors(id);
    const { data: genres } = await getMovieCategories(id);
    const user = auth.getCurrentUser();
    this.setState({ movie, actors, genres, user });
  }
  async populateGenres() {
    const { data: allGenres } = await getGenres();
    allGenres.sort((a, b) => (a.genre > b.genre ? 1 : -1));
    this.setState({ allGenres: allGenres });
  }

  addGenre = ev => {
    //console.log(ev.target.value);
    let findSelectedGenre = this.state.allGenres.filter(
      genre => genre.genre === ev.target.value
    );
    let genres = this.state.genres;
    if (!genres.filter(genre => genre.genre === ev.target.value).length > 0) {
      genres.push(...findSelectedGenre);
      this.setState({ genres });
    }
    //console.log("genres", genres);
  };

  deleteGenre = ev => {
    ev.preventDefault();
    let genreToDelete = ev.target.value;
    //console.log("genre to delete: ", genreToDelete);
    let genres = this.state.genres.filter(
      genre => genre.genre !== genreToDelete
    );
    this.setState({ genres });
  };

  addActor = ev => {
    ev.preventDefault();
    let actorToAdd = document.getElementById("add-actor").value;
    let actorInput = document.getElementById("add-actor");
    actorInput.value = "";
    let actors = this.state.actors;
    if (!actors.filter(actor => actor.name === actorToAdd).length > 0) {
      actors.push({ name: actorToAdd });
    }
    this.setState({ actors });
    //console.log(document.getElementById("add-actor").value);
  };

  deleteActor = ev => {
    ev.preventDefault();
    let actorToDelete = ev.target.value;
    //console.log("actor to delete", actorToDelete);
    let actors = this.state.actors.filter(
      actor => actor.name !== actorToDelete
    );
    this.setState({ actors });
  };

  editMovie = async () => {
    await this.populateGenres();
    const editMovieToggle = !this.state.editMovieToggle;
    this.setState({ editMovieToggle });
    //console.log(this.state.genres);
    //console.log("genres list", this.state.genres);
  };

  onChange = ev => {
    ev.preventDefault();
    //console.log("onchange called");
    let movie = this.state.movie;
    movie[ev.target.id] = ev.target.value;
    this.setState({ movie });
  };

  changePhoto = ev => {
    ev.preventDefault();
    const file = ev.target.files[0];
    getBase64(file)
      .then(base64 => {
        let movie = this.state.movie;
        movie.photo = base64.split(",")[1];
        this.setState({ movie });
        //let newUser = { photo: user.photo, id: user.id };
        ////console.log("user photo", user.photo);
        //updatePhoto(newUser);
        //toast.info("Your photo has been updated.");
        //this.setState({ user });
      })
      .catch(er => {});
  };

  submitForm = ev => {
    ev.preventDefault();
    let editMovieToggle = false;
    let movie = this.state.movie;
    movie.actors = this.state.actors;
    movie.genres = this.state.genres;
    this.setState({ movie, editMovieToggle });
    try {
      updateMovie(movie, movie.id);
      toast.info("Movie was updated.");
    } catch (err) {
      toast.err("Error while trying to update the movie");
    }
  };

  render() {
    const { movie, actors, genres, user } = this.state;
    const actorsArr = actors.map(actor => actor.name).sort();
    const genresArr = genres.map(genre => genre.genre).sort();
    const imageSrc = "data:image/png;base64," + movie.photo;
    //console.log("moviee", movie);

    return this.state.movie.id !== undefined ? (
      <AbsoluteWrapper>
        <div>
          <Helmet>
            <title>{movie.title + " " + movie.year}</title>
            <meta name="description" content={movie.description} />
          </Helmet>
          <div className="movie-card">
            <h2 className="text-center text-light">
              {movie.title + " (" + movie.year + ")"}
              {user &&
                user.role.filter(r => r.authority === "ROLE_ADMIN").length >
                  0 && (
                  <span className="edit-icon" onClick={this.editMovie}>
                    <i className="fa fa-edit fa-lg ml-2" />
                  </span>
                )}
            </h2>

            <div className="edit-movie">
              {user &&
                user.role.filter(r => r.authority === "ROLE_ADMIN").length >
                  0 && (
                  <div className="container">
                    {this.state.editMovieToggle && (
                      <EditMovie
                        genres={genres}
                        deleteGenre={this.deleteGenre}
                        deleteActor={this.deleteActor}
                        changePhoto={this.changePhoto}
                        actors={actors}
                        addActor={this.addActor}
                        addGenre={this.addGenre}
                        submitForm={this.submitForm}
                        onChange={this.onChange}
                        movie={movie}
                        allGenres={this.state.allGenres}
                      />
                      //   <form
                      //     onSubmit={this.submitForm}
                      //     className="movie--edit__form d-flex justify-content-center align-items-center flex-column"
                      //   >
                      //     <div className="form-group row ml-0">
                      //       <div className="col-xs-2">
                      //         <input
                      //           type="text"
                      //           className="form-control mt-1 input-sm"
                      //           placeholder="Movie Title"
                      //           onChange={this.onChange}
                      //           value={movie.title}
                      //           id="title"
                      //         />
                      //       </div>
                      //       <div className="col-xs-3">
                      //         <input
                      //           type="text"
                      //           className="form-control ml-lg-2 ml-md-2 mt-1 xs-mx-auto input-sm"
                      //           placeholder="Movie Year"
                      //           id="year"
                      //           onChange={this.onChange}
                      //           value={movie.year}
                      //         />
                      //       </div>
                      //     </div>

                      //     <textarea
                      //       className="form-control"
                      //       placeholder="Movie Description"
                      //       maxLength="255"
                      //       rows="5"
                      //       cols="10"
                      //       value={movie.description}
                      //       id="description"
                      //       onChange={this.onChange}
                      //     />

                      //     <select
                      //       className="form-control col-3"
                      //       onChange={this.addGenre}
                      //     >
                      //       <option key="default">Add category</option>
                      //       {this.state.allGenres.map(genre => {
                      //         return (
                      //           <option key={genre.genre}>{genre.genre}</option>
                      //         );
                      //       })}
                      //     </select>
                      //     <br />
                      //     <div>
                      //       {genres.map(genre => {
                      //         return (
                      //           <button
                      //             key={genre.id}
                      //             id="btn--delete"
                      //             className="btn text-white mr-1"
                      //             value={genre.genre}
                      //             onClick={this.deleteGenre}
                      //           >
                      //             {genre.genre}
                      //           </button>
                      //         );
                      //       })}
                      //     </div>

                      //     <div className="text-center mt-lg-4 mt-sm-2">
                      //       <label
                      //         className="h4 text-light mr-2"
                      //         htmlFor="avatar"
                      //       >
                      //         Change Photo:
                      //       </label>
                      //       <div className="photo--input d-flex align-items-center justify-content-center">
                      //         <input
                      //           onChange={this.changePhoto}
                      //           title=""
                      //           type="file"
                      //           id="avatar"
                      //           name="avatar"
                      //           accept="image/png, image/jpeg"
                      //         />
                      //       </div>
                      //     </div>

                      //     <div className="container">
                      //       <div className="input-group input-group-sm">
                      //         <div>
                      //           <div className="form-group row ml-0">
                      //             <div className="col-xs-1 mr-1">
                      //               <input
                      //                 id="add-actor"
                      //                 type="text"
                      //                 className="form-control mr-1"
                      //                 placeholder="Add actor"
                      //               />
                      //             </div>
                      //             <div className="col-xs-2">
                      //               <span className="">
                      //                 <button
                      //                   onClick={this.addActor}
                      //                   className="form-control btn btn-warning"
                      //                 >
                      //                   Add
                      //                 </button>
                      //               </span>
                      //             </div>
                      //           </div>
                      //         </div>
                      //       </div>
                      //     </div>

                      //     <div className="mt-2">
                      //       {actors.map(actor => {
                      //         return (
                      //           <button
                      //             key={actor.id}
                      //             id="btn--delete"
                      //             className="btn text-white m-1"
                      //             value={actor.name}
                      //             onClick={this.deleteActor}
                      //           >
                      //             {actor.name}
                      //           </button>
                      //         );
                      //       })}
                      //     </div>

                      //     <br />
                      //     <button className="btn btn-info" type="submit">
                      //       Save
                      //     </button>
                      //   </form>
                    )}
                  </div>
                )}
            </div>
          </div>

          <MovieDetails
            actorsArr={actorsArr}
            genresArr={genresArr}
            movie={movie}
            imageSrc={imageSrc}
          />

          {/* <div className="d-flex align-content-center justify-content-center flex-wrap flex-lg-nowrap text-light movie-card">
            <img
              className="ml-4 mr-4 movie-poster"
              src={imageSrc}
              alt={movie.title}
            />
            <div className="movie-card-details ml-4 mr-4 mt-lg-4">
              <h5 className="text-success">
                <u>Actors:</u>{" "}
              </h5>

              <p className="text-light">
                <strong>{actorsArr.join(", ")}</strong>
              </p>

              <h5 className="text-warning">
                <u>Categories:</u>{" "}
              </h5>
              <p className="text-light">
                <strong>{genresArr.join(", ")}</strong>
              </p>

              <h5 className="text-primary">
                <u>Description:</u>{" "}
              </h5>
              <p className="text-light">{movie.description}</p>
            </div>
          </div> */}

          {/*currentUser &&
          currentUser.role.filter(r => r.authority === "ROLE_ADMIN")
            .length > 0 && (
            <button
              type="submit"
              onClick={deleteMovieReview}
              className="btn btn-sm btn-danger"
            >
              Delete Comment
            </button>
            ) */}

          <Reviews movieId={movie.id} movie={movie} />
        </div>
      </AbsoluteWrapper>
    ) : (
      ""
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
export default Details;
