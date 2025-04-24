export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  genreIds: number[];
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
}

export class MovieModel implements Movie {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  genreIds: number[];
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;

  constructor(data: any = {}) {
    this.id = data.id || 0;
    this.title = data.title || '';
    this.originalTitle = data.original_title || '';
    this.overview = data.overview || '';
    this.posterPath = data.poster_path || '';
    this.backdropPath = data.backdrop_path || '';
    this.releaseDate = data.release_date || '';
    this.voteAverage = data.vote_average || 0;
    this.voteCount = data.vote_count || 0;
    this.genreIds = data.genre_ids || [];
    this.genres = data.genres || [];
    this.runtime = data.runtime;
    this.tagline = data.tagline;
    this.status = data.status;
    this.budget = data.budget;
    this.revenue = data.revenue;
  }
}

export interface MovieDetail extends Movie {
  runtime: number;
  tagline: string;
  budget: number;
  revenue: number;
  status: string;
  production_companies: ProductionCompany[];
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  homepage: string | null;
  imdb_id: string | null;
  credits: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
      order: number;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
      profile_path: string | null;
    }>;
  };
  similar: {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
  };
  recommendations: {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
  };
  videos: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      size: number;
      type: string;
      official: boolean;
      published_at: string;
    }>;
  };
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
  parent_company: any | null;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
}

export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
}

export interface Cast {
  id: number;
  name: string;
  profile_path: string;
  character: string;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  profile_path: string;
  job: string;
  department: string;
}
