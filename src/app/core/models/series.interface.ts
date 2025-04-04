export interface Series {
  id: number;
  name: string;
  originalName: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  firstAirDate: string;
  lastAirDate: string;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  status: string;
  episodeCount: number;
  seasonCount: number;
  tagline: string;
  genres: Array<{
    id: number;
    name: string;
  }>;
  networks: Array<{
    id: number;
    name: string;
    logoPath: string | null;
  }>;
  createdBy: Array<{
    id: number;
    name: string;
    profilePath: string | null;
  }>;
  seasons: Array<{
    id: number;
    name: string;
    overview: string;
    posterPath: string | null;
    seasonNumber: number;
    episodeCount: number;
    airDate: string;
  }>;
}
