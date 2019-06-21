import React, { Component, Suspense } from "react";
import "../App.css";
import { getGenres } from "./../services/genreService";
import {
  getMovies,
  getMoviesByGenre,
  addRatingToMovie
} from "./../services/movieService";

import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import video from "../logo/video.svg";
import mark from "../logo/mark.svg";
import close from "../logo/close.svg";

import {
  addMovieToWatchlist,
  getAllMovies,
  deleteFromWatchlist
} from "../services/userService";

import YoutubePopup from "./common/youtubePopup";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import debounce from "lodash.debounce";
import "../main.css";

import {
  deleteMovie,
  seachMovieTrailer,
  searchTrailerByMovieId,
  getMoviesByTitle
} from "../services/movieService";

// import ImageCard from "./newImageCard";
import AbsoluteWrapper from "./common/AbsoluteWrapper";
// import FilterTable from "./filterTable";
// import SearchBox from "./searchBox";

const ImageCard = React.lazy(() => import("./newImageCard"));
const FilterTable = React.lazy(() => import("./filterTable"));
const SearchBox = React.lazy(() => import("./searchBox"));

class MoviesTable extends Component {
  state = {
    movies: [],
    genres: [],
    pagination: {
      pageNumber: 0
    },
    queryString: "",
    selectedGenre: "",
    user: {},
    trailerKey: "",
    searchQuery: "",
    watchlist: []
  };

  async componentDidMount() {
    const { user } = this.props;
    console.log("movies table props", this.props);
    console.log("user from movies table", user);
    const movieData = await getMovies();
    let watchList = [];

    if (user !== null) {
      watchList = await getAllMovies(user.id);
      const watchlist = watchList.data.content;
      this.setState({ watchlist });
    }

    console.log("movie dataaaa", movieData);

    const pagination = {};
    pagination.numberOfElements = movieData.data.numberOfElements;
    pagination.totalElements = movieData.data.totalElements;
    pagination.totalPages = movieData.data.totalPages;
    pagination.pageSize = movieData.data.pageable.pageSize;
    pagination.onPageChange = this.onPageChange;

    let movies = movieData.data.content;
    const genreData = await getGenres();
    const genres = genreData.data;
    this.setState({ movies, genres, pagination, user });
  }

  handleGenreSelect = genre => {
    console.log("genul", genre);
    console.log(this.state.movies);
    const newList = this.state.movies.filter(
      movie => movie.movieGenresStringList.indexOf(genre.genre) > -1
    );
    this.setState({ sortedMoviesList: newList, selectedGenre: genre.genre });
  };

  onPageChange = async onChangeObj => {
    let pageNumber = Object.values(onChangeObj)[0];
    console.log("current page object", pageNumber);
    let q;
    const { selectedGenre, queryString } = this.state;

    queryString === "" ? (q = "?") : (q = "&");
    q += "page=" + pageNumber;

    console.log("the genre onPageChange", this.state.selectedGenre);

    let moviesData;
    if (selectedGenre.length > 0) {
      moviesData = await getMoviesByGenre(selectedGenre + queryString + q);
    } else {
      moviesData = await getMovies(queryString + q);
    }
    const movies = moviesData.data.content;
    console.log("onpagechange");
    console.log("onchange movies", movies);

    let pagination = Object.assign({}, this.state.pagination);
    pagination.pageNumber = pageNumber;

    this.setState({ movies, pagination });
  };

  sortedMovies = async (
    sortingValues,
    numberOfResults,
    selectedGenre = "",
    pageNumber = 0
  ) => {
    console.log("pagination", this.state.pagination);
    let queryString = "?";

    for (let entry of sortingValues) {
      queryString += "sort=" + entry[0] + "," + entry[1] + "&";
    }
    queryString += "size=" + numberOfResults;
    console.log("this was query", queryString);

    let theGenre =
      selectedGenre.length >= 0 ? selectedGenre : this.state.selectedGenre;
    let movieData;

    if (theGenre.length > 0 && theGenre.localeCompare("false")) {
      console.log("genre before await", theGenre);
      movieData = await getMoviesByGenre(theGenre + queryString);
    } else {
      movieData = await getMovies(queryString);
      console.log("Se ajunge aici? " + queryString);
      console.log(movieData);
    }

    const pagination = {};
    pagination.numberOfElements = movieData.data.numberOfElements;
    pagination.totalElements = movieData.data.totalElements;
    pagination.totalPages = movieData.data.totalPages;
    pagination.pageSize = movieData.data.pageable.pageSize;
    pagination.pageNumber = 0;
    pagination.onPageChange = this.onPageChange;

    const movies = movieData.data.content;

    console.log("movies.lenght by category", movies.length);

    this.setState({
      movies,
      pagination,
      queryString,
      selectedGenre: theGenre
    });
  };

  ratingMovie = (rating, movieId) => {
    console.log("rating movie", movieId, rating);
    addRatingToMovie(movieId, rating);
  };

  deleteMovieById = async movie => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <img src={video} />
            <h1>Confirm to submit</h1>
            <p>
              Are you sure you want to <strong id="remove">DELETE</strong> the
              following movie from the database?
            </p>
            <h3>
              {movie.title} ({movie.year})
            </h3>
            <a
              onClick={async () => {
                const originalMovies = this.state.movies;
                const movies = originalMovies.filter(m => m.id !== movie.id);
                this.setState({ movies });

                try {
                  await deleteMovie(movie.id);
                  toast.success(
                    movie.title +
                      " " +
                      movie.year +
                      " was successfully removed from database."
                  );
                } catch (error) {
                  toast.warn(
                    "An error occured while trying to remove the movie: " +
                      movie.title
                  );
                  this.setState({ movies: originalMovies });
                }

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

  // deleteMovieById = async movie => {
  //   confirmAlert({
  //     title: "Confirm to submit",
  //     message:
  //       "Are you sure you want to delete " +
  //       movie.title +
  //       " from the database?",
  //     buttons: [
  //       {
  //         label: "Yes",
  //         onClick: async () => {
  //           const originalMovies = this.state.movies;
  //           const movies = originalMovies.filter(m => m.id !== movie.id);
  //           this.setState({ movies });

  //           try {
  //             await deleteMovie(movie.id);
  //             toast.warn(
  //               movie.title + " " + movie.year + " was removed from database."
  //             );
  //           } catch (error) {
  //             toast.warn(
  //               "An error occured while trying to remove the movie: " +
  //                 movie.title
  //             );
  //             this.setState({ movies: originalMovies });
  //           }
  //         }
  //       },
  //       {
  //         label: "No"
  //       }
  //     ]
  //   });
  // };

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

  handleSearch1 = async title => {
    const movieData = await getMoviesByTitle(title);

    console.log("The movie data ");
    console.log(movieData);

    if (movieData === "404") {
      const pagination = {};
      pagination.numberOfElements = 0;
      pagination.totalElements = 0;
      pagination.totalPages = 0;
      pagination.pageSize = 0;
      pagination.pageNumber = 0;

      this.setState({ movies: [], pagination });
    } else {
      const pagination = {};
      pagination.numberOfElements = movieData.data.numberOfElements;
      pagination.totalElements = movieData.data.totalElements;
      pagination.totalPages = movieData.data.totalPages;
      pagination.pageSize = movieData.data.pageable.pageSize;
      pagination.pageNumber = 0;
      pagination.onPageChange = this.onPageChange;

      const movies = movieData.data.content;
      console.log("the movies are ");
      console.log(movies);
      console.log("the title is " + title);

      this.setState({ movies, pagination });
    }
  };

  raiseDoSearch = debounce(() => {
    this.handleSearch1(this.state.searchQuery);
  }, 300);

  handleSearch = title => {
    this.setState({ searchQuery: title }, () => {
      this.raiseDoSearch();
    });
  };

  goToDetails = async movie => {
    console.log("Filmul care trebuie cautat este");
    console.log(movie);
  };

  render() {
    const { movies, searchQuery } = this.state;
    return (
      <AbsoluteWrapper>
        <Suspense fallback={<h1 className="text-white">Page loading...</h1>}>
          <div className="container-fluid sidebar">
            <div className="row  my-row">
              <div className="col-lg-2 col-xs-12 my-col">
                <SearchBox value={searchQuery} onChange={this.handleSearch} />
                <FilterTable
                  toSort={this.sortedMovies}
                  genres={this.state.genres}
                />
              </div>
              <div className="col-lg-10 my-col2">
                <div className="movies-table">
                  <Suspense
                    fallback={<h1 className="text-white">Movies Loading...</h1>}
                  >
                    <div className="main">
                      {movies.map(movie => {
                        return (
                          <ImageCard
                            key={movie.id}
                            movie={movie}
                            addMovieToWishlist={this.addMovieToWishlist}
                            ratingMovie={this.ratingMovie}
                            user={this.state.user}
                            location={this.props.location.pathname}
                            deleteMovieById={this.deleteMovieById}
                            searchTrailer={this.searchTrailer}
                            goToDetails={this.goToDetails}
                            watchlist={this.state.watchlist}
                            removeMovieFromWatchlist={
                              this.removeMovieFromWatchlist
                            }
                          />
                        );
                      })}
                    </div>
                  </Suspense>
                </div>
              </div>
            </div>
            {console.log(
              "trailer key length",
              this.state.trailerKey.length,
              this.state.trailerKey
            )}
            {this.state.trailerKey.length > 0
              ? YoutubePopup(this.state.trailerKey, "true", this.onPopupClose)
              : //<YoutubePopup key={this.state.trailerKey} />
                ""}

            {this.state.pagination.totalPages > 1 && (
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"+5"}
                breakClassName={"break-me"}
                pageCount={this.state.pagination.totalPages}
                marginPagesDisplayed={0}
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
                forcePage={this.state.pagination.pageNumber}
                disabledClassName={"d-none"}
              />
            )}
          </div>
        </Suspense>
      </AbsoluteWrapper>
    );
  }
}

export default MoviesTable;
