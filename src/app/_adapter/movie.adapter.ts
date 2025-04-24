import { Movie } from '../_model/movie.interface';

export class MovieAdapter {
  static adaptFromApi(apiMovie: any): Movie {
    return {
      id: apiMovie.id,
      title: apiMovie.title,
      overview: apiMovie.overview,
      posterPath: apiMovie.poster_path,
      backdropPath: apiMovie.backdrop_path,
      releaseDate: apiMovie.release_date,
      voteAverage: apiMovie.vote_average,
      voteCount: apiMovie.vote_count,
      popularity: apiMovie.popularity,
      genres: apiMovie.genres || [],
      runtime: apiMovie.runtime,
      status: apiMovie.status,
      tagline: apiMovie.tagline,
      budget: apiMovie.budget,
      revenue: apiMovie.revenue,
      productionCompanies: apiMovie.production_companies || [],
      spokenLanguages: apiMovie.spoken_languages || [],
      originalLanguage: apiMovie.original_language,
      originalTitle: apiMovie.original_title,
      adult: apiMovie.adult || false,
      video: apiMovie.video || false
    };
  }

  static adaptToApi(movie: Movie): any {
    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.posterPath,
      backdrop_path: movie.backdropPath,
      release_date: movie.releaseDate,
      vote_average: movie.voteAverage,
      vote_count: movie.voteCount,
      popularity: movie.popularity,
      genres: movie.genres,
      runtime: movie.runtime,
      status: movie.status,
      tagline: movie.tagline,
      budget: movie.budget,
      revenue: movie.revenue,
      production_companies: movie.productionCompanies,
      spoken_languages: movie.spokenLanguages,
      original_language: movie.originalLanguage,
      original_title: movie.originalTitle,
      adult: movie.adult,
      video: movie.video
    };
  }
}
