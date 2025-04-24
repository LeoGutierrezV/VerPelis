export interface Series {
  id: number;
  name: string;
  originalName: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  firstAirDate: Date;
  lastAirDate: Date;
  voteAverage: number;
  status: SeriesStatus;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  genres: Genre[];
  productionCompanies: Company[];
  cast?: Cast[];
  videos?: Video[];
  similar?: {
    results: Series[];
  };
  originalLanguage: string;
  productionCountries: ProductionCountry[];
  spokenLanguages: SpokenLanguage[];
  popularity: number;
  voteCount: number;
  inProduction: boolean;
  seasons: Season[];
  networks: Network[];
}

export type SeriesStatus = 'Returning Series' | 'Ended' | 'Canceled' | 'In Production';

export interface Season {
  id: number;
  name: string;
  overview: string;
  airDate: Date;
  episodeCount: number;
  seasonNumber: number;
  posterPath: string | null;
}

export interface Network {
  id: number;
  name: string;
  logoPath: string | null;
  originCountry: string;
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

export type VideoSite = 'YouTube' | 'Vimeo';

export type VideoType = 'Trailer' | 'Teaser' | 'Clip' | 'Featurette' | 'Behind the Scenes' | 'Bloopers';

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface SeriesResponse {
  page: number;
  results: Series[];
  total_pages: number;
  total_results: number;
}
