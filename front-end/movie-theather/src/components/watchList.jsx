import React, { Component, Suspense } from "react";
import { getAllMovies, deleteFromWatchlist } from "../services/userService";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Loader from "react-loader-spinner";
// import ImageCard from './imageCard';

import {
  seachMovieTrailer,
  searchTrailerByMovieId,
  addRatingToMovie
} from "../services/movieService";
import YoutubePopup from "./common/youtubePopup";
import { Helmet } from "react-helmet";
import AbsoluteWrapper from "./common/AbsoluteWrapper";
import video from "../logo/video.svg";
import mark from "../logo/mark.svg";
import close from "../logo/close.svg";

const ImageCard = React.lazy(() => import("./imageCard"));

class Watchlist extends Component {
  state = {
    movies: [],
    user: {},
    displayedMovies: [],
    totalPages: 0,
    trailerKey: ""
  };

  async componentDidMount() {
    const { user } = this.props;
    const movieData = await getAllMovies(this.props.user.id);
    console.log(movieData);
    const movies = movieData.data.content;
    const totalPages = movieData.data.totalPages;

    this.setState({ movies, user, totalPages });
  }

  ratingMovie = (rating, movieId) => {
    console.log("rating movie", movieId, rating);
    addRatingToMovie(movieId, rating);
  };

  removeMovieFromWatchlist = async (userId, movie) => {
    console.log(userId, movie.id);

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <img src={video} />
            <h1>Confirm to submit</h1>
            <p>
              Are you sure you want to <strong id="remove">REMOVE</strong> the
              following movie from your watchlist?
            </p>
            <h3>
              {movie.title} ({movie.year})
            </h3>
            <a
              onClick={async () => {
                deleteFromWatchlist(userId, movie.id)
                  .then(response => {
                    toast.success(
                      "The movie " +
                        movie.title +
                        " (" +
                        movie.year +
                        ") was successfully removed from your watchlist!",
                      {
                        className: "toast-class-success",
                        progressClassName: "fancy-progress",
                        closeButton: false
                      }
                    );
                  })
                  .catch(err => {
                    toast.error(
                      "Error occured while removing the movie from your wishlist"
                    );
                  });

                const newMovies = this.state.movies.filter(
                  m => movie.id !== m.id
                );
                console.log("removed", movie);
                this.setState({ movies: newMovies });
                onClose();
              }}
            >
              <img src={mark} id="yes" />
            </a>
            <a onClick={onClose}>
              <img src={close} id="no" />
            </a>
          </div>
        );
      }
    });
  };

  onPageChange = async onChangeObj => {
    if (!this.state.user.id) {
      return;
    }
    let pageNumber = Object.values(onChangeObj)[0];
    console.log(pageNumber);
    let q;
    q = "?page=" + pageNumber;
    const movieData = await getAllMovies(this.state.user.id, q);
    const movies = movieData.data.content;

    console.log("movie data", movies);
    console.log("totalPages", this.state.totalPages);
    this.setState({ movies });
  };

  searchTrailer = async movie => {
    console.log("search trailer");
    const resultData = await seachMovieTrailer(movie.title);
    console.log("result data", resultData);

    let result;
    if (resultData.data.results.length > 0) {
      result = resultData.data.results[0].id;
    } else {
      toast.error("Movie trailer not found");
      return;
    }

    const trailerData = await searchTrailerByMovieId(result);
    console.log("trailer data", trailerData);
    if (trailerData.data.results.length > 0) {
      const trailerKey = trailerData.data.results[0].key;
      const youtubeUrl = "https://www.youtube.com/watch?v=" + trailerKey;
      console.log(youtubeUrl);
      this.setState({ trailerKey });
      return trailerKey;
    } else {
      toast.error("Movie trailer not found");
    }
  };

  onPopupClose = () => {
    YoutubePopup(this.state.trailerKey, "false");
    this.setState({ trailerKey: "" });
  };

  render() {
    //console.log("render movie length", this.state.movies.length);
    console.log("watchlist");
    const { movies } = this.state;
    return (
      <AbsoluteWrapper>
        <Helmet>
          <title>Your Watchlist</title>
        </Helmet>
        <div className="watch-div">
          <h1 className="watchlist">WATCHLIST</h1>
        </div>
        <div className="movies-table">
          <Suspense
            fallback={
              <h1 className="text-white" style={{ textAlign: "center" }}>
                Loading...
              </h1>
            }
          >
            <div className="main">
              {movies.map(movie => (
                <>
                  <ImageCard
                    movie={movie}
                    user={this.state.user}
                    location={this.props.location.pathname}
                    removeMovieFromWatchlist={this.removeMovieFromWatchlist}
                    ratingMovie={this.ratingMovie}
                    searchTrailer={this.searchTrailer}
                  />
                </>
              ))}
            </div>
          </Suspense>

          {this.state.trailerKey.length > 0
            ? YoutubePopup(this.state.trailerKey, "true", this.onPopupClose)
            : //<YoutubePopup key={this.state.trailerKey} />
              ""}

          {this.state.totalPages > 1 && (
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={this.state.totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.onPageChange}
              containerClassName={
                "d-flex justify-content-center pagination pagination--bar"
              }
              activeClassName={"page-item active"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              initialPage={0}
              previousClassName={"page-link bg-dark"}
              nextClassName={"page-link bg-dark"}
              breakLinkClassName={"page-link bg-dark"}
              disabledClassName={"d-none"}
            />
          )}
        </div>
      </AbsoluteWrapper>
    );
  }
}

export default Watchlist;
