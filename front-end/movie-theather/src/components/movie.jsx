import React, { Component } from "react";
import { getMovieById } from "./../services/getMovieById";
import { getMovieActors } from "./../services/movieActors";
import { getMovieCategories } from "./../services/movieCategoryService";
import { Helmet } from "react-helmet";

class Movie extends Component {
  state = {
    movie: {},
    actors: [],
    genres: []
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    const { data: movie } = await getMovieById(id);
    const { data: actors } = await getMovieActors(id);
    const { data: genres } = await getMovieCategories(id);
    this.setState({ movie, actors, genres });
  }
  render() {
    const { movie, actors, genres } = this.state;
    const imageSrc = "data:image/png;base64," + movie.photo;
    return (
      <>
        <Helmet>
          <title>{movie.title + " " + movie.year}</title>
          <meta name="description" content={movie.description} />
        </Helmet>
        <div className="movie--form__single">
          <img className="rounded" src={imageSrc} alt={movie.title} />
          <div className="movie--form__details">
            <h1>
              {movie.title} {movie.year}
            </h1>
            <h6 className="text-white">Actors:</h6>
            <p className="movie--form__actors">
              {actors.map(actor => actor.name + " ")}{" "}
            </p>
            <h6 className="text-white">Categories:</h6>
            <p className="movie--form__genres">
              {genres.map(genre => genre.genre + " ")}{" "}
            </p>
            <h6 className="text-white">Description</h6>
            <p>{movie.description}</p>
          </div>
        </div>
      </>
    );
  }
}

export default Movie;
