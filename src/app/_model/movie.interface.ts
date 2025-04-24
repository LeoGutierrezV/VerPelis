export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: Date;
  voteAverage: number;
  runtime: number;
  status: MovieStatus;
  budget?: number;
  revenue?: number;
  genres: Genre[];
  productionCompanies?: Company[];
  cast: Cast[];
  videos: Video[];
  similar: Movie[];
  originalLanguage: string;
  productionCountries: ProductionCountry[];
  spokenLanguages: SpokenLanguage[];
  popularity: number;
  voteCount: number;
  video: boolean;
}

export type MovieStatus = 'Released' | 'Post Production' | 'In Production' | 'Planned';

export type VideoSite = 'YouTube' | 'Vimeo';

export type VideoType = 'Trailer' | 'Teaser' | 'Clip' | 'Featurette' | 'Behind the Scenes';

export interface Video {
  id: string;
  key: string;
  name: string;
  site: VideoSite;
  type: VideoType;
  official: boolean;
  publishedAt: string;
  iso_639_1: string;
  iso_3166_1: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Company {
  id: number;
  name: string;
  logoPath: string | null;
  originCountry: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profilePath: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
