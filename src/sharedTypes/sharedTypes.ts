export type TrackType = {
  _id: number;
  name: string;
  author: string;
  release_date: string;
  genre: string[];
  duration_in_seconds: number;
  album: string;
  logo: string | null;
  track_file: string;
  stared_user: string[];
};

export type CategoryType = {
  _id: number;
  items: number[]; // ID треков, а не сами треки
  name: string;
};