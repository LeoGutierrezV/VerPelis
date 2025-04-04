export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: Date;
  voteAverage: number;
  runtime?: number;
  status?: MovieStatus;
  budget?: number;
  revenue?: number;
  genres: Genre[];
  productionCompanies?: Company[];
  cast?: Cast[];
  videos?: Video[];
  similar?: {
    results: Movie[];
  };
  originalLanguage: string;
  productionCountries: ProductionCountry[];
  spokenLanguages: SpokenLanguage[];
  popularity: number;
  voteCount: number;
  video: boolean;
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
  profilePath: string | null;
  order?: number;
  department?: string;
  job?: string;
}

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

export interface MovieResponse {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
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

export enum MovieStatus {
  Rumored = 'Rumored',
  Planned = 'Planned',
  InProduction = 'In Production',
  PostProduction = 'Post Production',
  Released = 'Released',
  Canceled = 'Canceled'
}

export enum VideoSite {
  YouTube = 'YouTube',
  Vimeo = 'Vimeo'
}

export enum VideoType {
  Trailer = 'Trailer',
  Teaser = 'Teaser',
  Clip = 'Clip',
  Featurette = 'Featurette',
  BehindTheScenes = 'Behind the Scenes',
  Bloopers = 'Bloopers'
}
