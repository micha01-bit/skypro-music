import axios from "axios";
import { BASE_URL } from "../constants";
import { TrackType, CategoryType } from "@/sharedTypes/sharedTypes";

export const getTracks = (): Promise<TrackType[]> => {
  return axios.get(BASE_URL + '/catalog/track/all/')
    .then((res) => res.data.data as TrackType[])
    .catch((error) => {
      throw error;
    });
};

export const getCategoryTracks = (trackId: string): Promise<CategoryType> => {
  return axios.get(BASE_URL + `/catalog/selection/${trackId}/`)
    .then((res) => res.data.data as CategoryType)
    .catch((error) => {
      throw error;
    });
};

export const getFavoriteTrackIds = async (access: string): Promise<number[]> => {
  try {
    const resp = await axios.get(BASE_URL + `/catalog/track/favorite/ids/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      }
    });
    return resp.data.data as number[];
  } catch (error) {
    throw error;
  }
};

export const getFavoriteTracks = async (access: string): Promise<TrackType[]> => {
  try {
    const resp = await axios.get(BASE_URL + `/catalog/track/favorite/all/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      }
    });
    return resp.data.data as TrackType[];
  } catch (error) {
    throw error;
  }
};

export const addTrackToFavorite = async (trackId: string, accessToken: string): Promise<void> => {
  try {
    await axios.post(BASE_URL + `/catalog/track/${trackId}/favorite/`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
  } catch (error) {
    throw error;
  }
};

export const deleteTrackFromFavorite = async (trackId: string, accessToken: string): Promise<void> => {
  try {
    await axios.delete(BASE_URL + `/catalog/track/${trackId}/favorite/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
  } catch (error) {
    throw error;
  }
};